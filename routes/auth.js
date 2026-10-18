const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const User = require('../model/user');
const validateUser = require('../config/utils/validation');
const authRouter = express.Router();




authRouter.post('/register', async (req, res) => {

    //Validate User
    validateUser(req);

    //Encrypt Password

    const { firstName, lastName, email, password, age, gender, phoneNumber } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    console.log('Password hash:', passwordHash);

    // Replace the plain text password with the hashed password

    const user = new User({
        firstName,
        lastName,
        email,
        password: passwordHash,
        age,
        gender,
        phoneNumber
    });
    user.save()
        .then(() => res.status(201).send('User registered successfully'))
        .catch((err) => res.status(400).send(err));
});

// router.post("/login", async (req,res)=>{

authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('User not found');
        }
        const isPasswordValid = await user.validatePassword(password);
        console.log(isPasswordValid)
        if (isPasswordValid) {
            const token = await user.getJWT();
            res.cookie('token', token);
            res.status(200).send('Login successful');
        }
        else {
            return res.status(400).send('Invalid Credentials');
        }

    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
})

authRouter.post("/logout", (req, res) => {
    res.clearCookie('token', { path: '/' });
    

    // res.cookie('token', 'null', { expires: new Date(Date.now()),  path: '/' });
    res.status(200).send('Logout successful');
});

authRouter.post("/forgotPassword", async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('User not found');
        }
        // Logic to send password reset email or token goes here
        console.log(`Password reset requested for email: ${email}`);

        const newPassword = req.body.newPassword;
        const confirmPassword = req.body.confirmPassword;
        if (!newPassword || !confirmPassword) {
            throw new Error('New password and confirm password are required');
        }
        if (newPassword !== confirmPassword) {
            throw new Error('Passwords do not match');
        }
        const passwordHash = await bcrypt.hash(newPassword, 10);
        user.password = passwordHash;
        await user.save();
        res.status(200).send('Password reset instructions sent');
    } catch (err) {
        console.log(err);
        res.status(400).json({ 
            error: err.message,
            status: 400,
            message: err.message,
            timestamp: new Date(),
            requestId: req.id || null,
            method: req.method || null
         });
    }
});

//     authRouter.post("/logout", (req, res) => {
//     res.clearCookie('token', { path: '/' });
//     res.status(200).send('Logout successful');
// });
module.exports = authRouter;