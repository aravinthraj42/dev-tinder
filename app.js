const express = require('express');
const {connectDB} = require('./config/database');
const validateUser = require('./config/utils/validation'); 
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const User = require('./model/user')
const userAuth = require('./middleware/auth');;
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');


const app = express();
app.use(express.json()); 
app.use(cookieParser());

app.use('/', authRouter)
app.use('/', profileRouter);
app.use('/', requestRouter); 
app.use('/', userRouter)

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













