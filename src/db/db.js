const mongoose = require('mongoose')

const URL = process.env.MONGO_URI

const connectDB = async () =>{
    await mongoose.connect(URL)
    console.log('Database Connected.....')
}

module.exports = connectDB