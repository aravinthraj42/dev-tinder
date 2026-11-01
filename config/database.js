
const mongoose = require('mongoose')

const connectDB = async () =>{

    await mongoose.connect('mongodb+srv://aravinthraj42_db_user:2iUaJ4qIfbaluB0G@namaste-node.tfymmg4.mongodb.net/devtinder')
}


// connectDB().then(() => {
//     console.log('Database connected successfully')
// }).catch((err) => {
//     console.error('Database connection failed', err)
// })

module.exports = { connectDB };


