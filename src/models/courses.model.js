const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    courseName:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
})

const courseModel = mongoose.model('course',courseSchema)

module.exports = courseModel