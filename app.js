const express = require('express');
const {connectDB} = require('./config/database');
const validateUser = require('./config/utils/validation'); 
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const userAuth = require('./middleware/auth');
const User = require('./model/user');


const app = express();
app.use(express.json()); 
app.use(cookieParser());
// Middleware to parse JSON request bodies 
// Server Unable to Reads the Json data So the Express.json (express middleware) handle parsing the JSON request bodies to  Javascript objects


connectDB().then(() => {
    console.log('Database connected successfully');
    app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
}).catch((err) => {
    console.error('Database connection failed', err)
})


app.get('/user', async (req, res) => {
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
app.get('/feed', async (req, res) => {
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



app.post('/register', async (req, res) => {

    //Validate User
    validateUser(req);

    //Encrypt Password

    const {firstName, lastName, email, password, age, gender, phoneNumber} = req.body;
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

app.post("/login", async (req,res)=>{
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(404).send('User not found');
        }
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid) {
        const token = await user.getJWT();
        res.cookie('token', token );
        res.status(200).send('Login successful');
        }
        else{
            return res.status(400).send('Invalid Credentials');
        }
 
    } catch(err) {
        res.status(400).send(err);
    }
})

app.get("/profile", userAuth, async (req, res) => {
 try{ 

    res.send(req.user);
 }
    catch(err) {
        res.status(400).send("ERROR:" + err.message  );
    }
});

app.post("/SendConnectionRequest", userAuth, async (req, res) => {
    try {
        // Logic to send a connection request

        const { user } = req;
        // console.log('Sending connection request for user:', user);
        res.status(200).send( user.firstName + ' '  + ' has Sent Connection Request');
    } catch(err) {
        res.status(400).send(err);
    }
});


app.delete('/user', async (req, res) => {
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

app.patch("/user/:userId", async (req, res) => {
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

app.patch("/updateUserbyEmail", async (req, res) => {
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




