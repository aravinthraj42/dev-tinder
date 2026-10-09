const express = require('express');
const {connectDB} = require('./config/database');

const User = require('./model/user');


const app = express();

app.post('/register', (req, res) => {
    // Logic to create a new user   

    const userobj ={
        firstName: "Nandhini",
        lastName: "V",
        email: "nandhini.raj@example.com",
        password: "securepassword",
        age: 25,
        phoneNumber: 79012345678
    }

    const user = new User(userobj);
    user.save()
        .then(() => res.status(201).send('User registered successfully'))
        .catch((err) => res.status(400).send(err));
}); 

connectDB().then(() => {
    console.log('Database connected successfully');
    app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
}).catch((err) => {
    console.error('Database connection failed', err)
})



