const express = require('express');
const app = express();

// Middleware to parse JSON request bodies
// app.use(express.json());


app.use("/", (req, res, next)=>{
    let body = "";
    req.on('data', (chunk) => {
        body += chunk.toString();
        console.log('Received chunk:', chunk.toString());
    });
    console.log("Middleware executed");
    // next();
    req.on('end', () => {
try {
        req.body = JSON.parse(body);
    } catch (err) {
        console.error('Error parsing JSON:', err);
        res.status(400).send('Invalid JSON');
        return;
    }
    next();
    });
})