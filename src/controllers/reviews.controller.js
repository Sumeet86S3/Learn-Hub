const mongoose = require('mongoose')
const courseModel = require('../models/courses.model')
const enrollmentModel = require('../models/enrollment.model')
const reviewModel = require('../models/review.model')

const requireStudent = (req, res) => {
    if (req.role !== 'student') {
        res.status(403).json({message: 'Only students can manage reviews'})
        return false
    }

    return true
}

const isValidObjectId = (id, res) => {
    if (!mongoose.isValidObjectId(id)) {
        res.status(400).json({message: 'Invalid id'})
        return false
    }

    return true
}

const isValidRating = rating =>
    Number.isInteger(rating) && rating >= 1 && rating <= 5

const isValidComment = comment =>
    typeof comment === 'string' && comment.trim().length > 0

const addCourseReview = async (req, res) => {
    if (!requireStudent(req, res)) {
        return
    }

    const {courseId} = req.params
    if (!isValidObjectId(courseId, res)) {
        return
    }

    const course = await courseModel.findById(courseId)
    if (!course) {
        return res.status(404).json({message: 'Course not found'})
    }

    const enrollment = await enrollmentModel.findOne({
        student: req.username,
        course: course._id
    })
    if (!enrollment) {
        return res.status(403).json({message: 'Enroll in the course before reviewing it'})
    }

    const {rating, comment} = req.body || {}
    if (!isValidRating(rating)) {
        return res.status(400).json({message: 'Rating must be an integer from 1 to 5'})
    }
    if (!isValidComment(comment)) {
        return res.status(400).json({message: 'Comment is required'})
    }

    let review
    try {
        review = await reviewModel.create({
            course: course._id,
            student: req.username,
            rating,
            comment
        })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({message: 'You have already reviewed this course'})
        }

        throw error
    }

    return res.status(201).json({
        message: 'Review added successfully',
        review
    })
}

const getCourseReviews = async (req, res) => {
    const {courseId} = req.params
    if (!isValidObjectId(courseId, res)) {
        return
    }

    const course = await courseModel.findById(courseId)
    if (!course) {
        return res.status(404).json({message: 'Course not found'})
    }

    const reviews = await reviewModel
        .find({course: course._id})
        .sort({createdAt: -1})

    return res.json({reviews})
}

const updateReview = async (req, res) => {
    if (!requireStudent(req, res)) {
        return
    }

    const {reviewId} = req.params
    if (!isValidObjectId(reviewId, res)) {
        return
    }

    const updates = {}
    for (const field of ['rating', 'comment']) {
        if (req.body?.[field] !== undefined) {
            updates[field] = req.body[field]
        }
    }

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({message: 'No review fields to update'})
    }
    if (updates.rating !== undefined && !isValidRating(updates.rating)) {
        return res.status(400).json({message: 'Rating must be an integer from 1 to 5'})
    }
    if (updates.comment !== undefined && !isValidComment(updates.comment)) {
        return res.status(400).json({message: 'Comment cannot be empty'})
    }

    const review = await reviewModel.findOneAndUpdate(
        {_id: reviewId, student: req.username},
        {...updates, updatedAt: new Date()},
        {new: true, runValidators: true}
    )

    if (!review) {
        const existingReview = await reviewModel.exists({_id: reviewId})
        if (!existingReview) {
            return res.status(404).json({message: 'Review not found'})
        }

        return res.status(403).json({message: 'You can only update your own reviews'})
    }

    return res.json({
        message: 'Review updated successfully',
        review
    })
}

const deleteReview = async (req, res) => {
    if (!requireStudent(req, res)) {
        return
    }

    const {reviewId} = req.params
    if (!isValidObjectId(reviewId, res)) {
        return
    }

    const review = await reviewModel.findOneAndDelete({
        _id: reviewId,
        student: req.username
    })

    if (!review) {
        const existingReview = await reviewModel.exists({_id: reviewId})
        if (!existingReview) {
            return res.status(404).json({message: 'Review not found'})
        }

        return res.status(403).json({message: 'You can only delete your own reviews'})
    }

    return res.json({
        message: 'Review deleted successfully',
        review
    })
}

module.exports = {
    addCourseReview,
    getCourseReviews,
    updateReview,
    deleteReview
}
