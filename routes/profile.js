const express = require('express');
const app = express();
const User = require('../model/user');
const userAuth = require('../middleware/auth');
const { validateEditUserDetails } = require('../config/utils/validation');
const profileRouter = express.Router();


profileRouter.delete('/user', async (req, res) => {
    const userId = req.body.userId;
    try{
        const result = await User.findByIdAndDelete(userId);
        if(result) {
            res.status(200).send('User deleted successfully');
        } else {
            res.status(404).send('User not found');
        }
    } catch(err) {
        res.status(400).send(err);
    }
});

profileRouter.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const updates = req.body;
    try {
        const ALLOWED_UPDATES = ["firstName", "lastName",  "age", "phoneNumber", "skill", "about"];
        const isValidOperation = Object.keys(updates).every((update) => ALLOWED_UPDATES.includes(update));
        if(!isValidOperation) {
            return res.status(400).send({ error: "Invalid updates!" });
        }
        const result = await User.findByIdAndUpdate(userId, updates, { returnDocument: "before", runValidators: true });
        console.log('Previous user data:', result);

        if(result) {
            res.status(200).send('User updated successfully');
        } else {
            res.status(404).send('User not found');
        }
    } catch(err) {
        res.status(400).send(err);
    }
});

profileRouter.patch("/updateUserbyEmail", async (req, res) => {
    const email = req.body.email;
    const updates = req.body;
    try {
        const result = await User.findOneAndUpdate({ email: email }, updates, { returnDocument: "before", runValidators: true });
        console.log('Previous user data:', result);
        if(result) {
            res.status(200).send('User updated successfully');
        } else {
            res.status(404).send('User not found');
        }
    } catch(err) {
        res.status(400).send(err);
    }
});



profileRouter.get('/user', async (req, res) => {
        // Logic to retrieve user information
        // console.log('Received request with body:', req.body);
    try{
        const users = await User.find({email: req.body.email})
        if(users.length === 0) {
            console.log('No users found');
            res.status(404).send('No users found');
        } else {
            res.send(users);
            // return res.status(200).json(users);
        }
    }catch(err){
        res.status(400).send(err);
    }
    }); 
profileRouter.get('/feed', userAuth, async (req, res) => {
    // Logic to retrieve user information
    // console.log('Received request with body:', req.body);
try{
    const users = await User.find({})
    if(users.length === 0) {
        console.log('No users found');
        res.status(404).send('No users found');
    } else {
        res.send(users);
        // return res.status(200).json(users);
    }
}catch(err){
    res.status(400).send(err);
}
}); 

profileRouter.get("/profile/view", userAuth, async (req, res) => {

    try{
        const user = req.user;
        res.send(user);
    }catch(err){
     res.status(400).send("ERROR:" + err.message);
    }
});



profileRouter.patch("/profile/edit", userAuth, async (req, res) => {

    try{
        // validateEditUserDetails(req)
        if(!validateEditUserDetails(req)) {
            throw new Error('Invalid edit fields');
        }
        const user = req.user;
        Object.keys(req.body).forEach(field => {
            user[field] = req.body[field];
        });
        await user.save();
        console.log('User attempting to edit:', user);
        // res.status(200).send(`Yours ${user.firstName} Fields are updated successfully and are valid`);
        res.json({ 
            message: `Yours ${user.firstName} Fields are updated successfully and are valid`,
            status: 200,
            data: user,
            timestamp: new Date(),
            requestId: req.id || null,
            method: req.method || null,
         });
    }catch(err){
     res.status(400).send("ERROR:" + err.message);
    }


});
module.exports = profileRouter;