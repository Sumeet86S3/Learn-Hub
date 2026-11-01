const mongoose = require('mongoose')

const enrollmentSchema = new mongoose.Schema({
    student:{
        type:String,
        required:true
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'course',
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

enrollmentSchema.index({student:1, course:1}, {unique:true})

const enrollmentModel = mongoose.model('enrollment', enrollmentSchema)

module.exports = enrollmentModel
