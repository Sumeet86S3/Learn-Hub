const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'course',
        required:true
    },
    student:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5,
        validate:{
            validator: Number.isInteger,
            message: 'Rating must be an integer'
        }
    },
    comment:{
        type:String,
        required:true,
        trim:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
})

reviewSchema.index({course:1, student:1}, {unique:true})

const reviewModel = mongoose.model('review', reviewSchema)

module.exports = reviewModel
