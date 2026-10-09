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