const express = require('express');
const { adminAuth, userAuth } = require('./middleware/auth');

const app = express();

// app.use("/", (req, res) => {
//     res.send('Hello from Root'); // ---> Request Handler
// });

// app.use("/user", (req, res, next)=>{
// console.log('Request received at /user 1');
// // res.send('Hello from Server-1'); // ---> Request Handler
// next();
// },
// (req, res,next)=>{
// console.log('Request received at /user 2');
// // res.send('Hello from Server-2'); // ---> Request Handler
// next();
// },
// (req, res,next)=>{
//         console.log('Request received at /user 3₹');

// // res.send('Hello from Server-3'); // ---> Request Handler
// next();
// },

// (req, res, next)=>{
//         console.log('Request received at /user 4');

// res.send('Hello from Server-4'); // ---> Request Handler
// },
// (req, res)=>{
//         console.log('Request received at /user 5');
// res.send('Hello from Server-5'); // ---> Request Handler
// }
// );

// app.use("/test", (req, res)=>{
// res.send('Hello from Server'); // ---> Request Handler
// })


// app.use("/admin", adminAuth);

// app.get("/user", userAuth, (req, res) => {
//     res.send('Hello from User'); // ---> Request Handler
// });

// app.get("/admin/getAllUser", (req, res) => {
//     res.send('Hello from Admin Get All User'); // ---> Request Handler
// });
// app.get("/admin/deleteAllUser", (req, res) => {
//     res.send('Hello from Admin Delete All User'); // ---> Request Handler
// });
app.use("/", (err, req, res, next) => {
    console.error(err);
if(err){
        res.status(500).send('Internal Server Error');
}
    });


app.use("/getUserData", ( req, res) => {
    // console.error(err);
    throw new Error('Something went wrong');
    // res.status(500).send('Internal Server Error');

    // try{
    //     throw new Error('Something went wrong');
    // }catch(err){
    //     console.error(err); 
    //     res.status(500).send('Internal Server Error - catch block');
    //    }
});



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

---------------

const express = require('express');
const {connectDB} = require('./config/database');
const validateUser = require('./config/utils/validation'); 
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

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
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(400).send('Invalid Credentials');
        }
        const token = jwt.sign({_id: user._id}, 'DEV@Tinder@790');
        res.cookie('token', token);
        console.log('Generated token:', token);
        // res.cookie('token', 'fwkfjkjrwnwjkfnwiofownojkndwfjnwjk', { httpOnly: true });
        // console.log('cookie', cookie)
        res.status(200).send('Login successful');
    } catch(err) {
        res.status(400).send(err);
    }
})

app.get("/profile", async (req, res) => {
                        // const cookie = req.cookies?.token;

    const { token } = req.cookies;
    if(!token) {
        return res.status(401).send('Unauthorized: No token provided');
    }
    const decodedMessage = jwt.verify(token, 'DEV@Tinder@790');

    const {_id} = decodedMessage;
    console.log('Decoded user ID:', _id);
 try{ 
    const user = await User.findById(_id);
    console.log('Fetched user data:', user);
    console.log('Decoded message:', decodedMessage);
    console.log('Received cookie:', token);
    res.send(user);
 }
    catch(err) {
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


--------
auth.js

const adminAuth =(req, res, next)=>{
const token = "xyzẓ";
console.log('Request received at /admin Authorization');
const isAdminAuthoziartion = token === "xyzẓ";
if(isAdminAuthoziartion){
    next();
}else{
    res.status(401).send('Unauthorized');
}

}

const userAuth =(req, res, next)=>{
const token = "abcẓ";
console.log('Request received at /user Authorization');
const isUserAuthoziartion = token === "abcẓ";
if(isUserAuthoziartion){
    next();
}else{
    res.status(401).send('Unauthorized');
}

}

module.exports = {
    adminAuth,
    userAuth
};

