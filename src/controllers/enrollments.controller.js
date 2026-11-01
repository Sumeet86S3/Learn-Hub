const mongoose = require('mongoose')
const courseModel = require('../models/courses.model')
const enrollmentModel = require('../models/enrollment.model')

const requireStudent = (req, res) => {
    if (req.role !== 'student') {
        res.status(403).json({message: 'Only students can enroll in courses'})
        return false
    }

    return true
}

const enrollInCourse = async (req, res) => {
    if (!requireStudent(req, res)) {
        return
    }

    const {courseId} = req.params
    if (!mongoose.isValidObjectId(courseId)) {
        return res.status(400).json({message: 'Invalid course id'})
    }

    const course = await courseModel.findById(courseId)
    if (!course) {
        return res.status(404).json({message: 'Course not found'})
    }

    const existingEnrollment = await enrollmentModel.findOne({
        student: req.username,
        course: course._id
    })
    if (existingEnrollment) {
        return res.status(409).json({message: 'Already enrolled in this course'})
    }

    let enrollment
    try {
        enrollment = await enrollmentModel.create({
            student: req.username,
            course: course._id
        })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({message: 'Already enrolled in this course'})
        }

        throw error
    }

    return res.status(201).json({
        message: 'Enrolled successfully',
        enrollment
    })
}

const getMyCourses = async (req, res) => {
    if (!requireStudent(req, res)) {
        return
    }

    const enrollments = await enrollmentModel
        .find({student: req.username})
        .populate('course')

    return res.json({
        courses: enrollments
            .filter(enrollment => enrollment.course)
            .map(enrollment => enrollment.course)
    })
}

module.exports = {enrollInCourse, getMyCourses}
