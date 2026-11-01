const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    instructor:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
        validate:{
            validator: Number.isInteger,
            message: 'Price must be an integer'
        }
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const courseModel = mongoose.model('course',courseSchema)

module.exports = courseModel