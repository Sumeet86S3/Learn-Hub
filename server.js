require('dotenv').config()

const app = require('./src/app')
const connectDB = require('./src/db/db')
const express = require('express')

app.use(express.json())






try {
    connectDB()
    app.listen(3000,()=>{
    console.log('server is running....')
})
} catch (error) {
    console.error(error.message)
}






