const courseModel = require('../models/courses.model')
const mongoose = require('mongoose')

const requireTeacher = (req, res) => {
    if (req.role !== 'teacher') {
        res.status(403).json({message: 'Not authorized'})
        return false
    }

    return true
}

const isValidCourseId = (id, res) => {
    if (!mongoose.isValidObjectId(id)) {
        res.status(400).json({message: 'Invalid course id'})
        return false
    }

    return true
}

const addCourses = async (req,res) =>{

    if (!requireTeacher(req, res)) {
        return 
    }

    const {courseName,description} = req.body || {}

    const addACourse = await courseModel.create({
        courseName:courseName,
        description:description
    })

    return res.status(201).json({
        message:"course added successfully",
        course:addACourse
    })

}

const getCourses = async (req, res) => {
    const courses = await courseModel.find()

    return res.json({courses})
}

const getCourseById = async (req, res) => {
    if (!isValidCourseId(req.params.id, res)) {
        return
    }

    const course = await courseModel.findById(req.params.id)

    if (!course) {
        return res.status(404).json({message: 'Course not found'})
    }

    return res.json({course})
}

const updateCourse = async (req, res) => {
    if (!requireTeacher(req, res)) {
        return
    }

    if (!isValidCourseId(req.params.id, res)) {
        return
    }

    const updates = {}
    if (req.body?.courseName !== undefined) {
        updates.courseName = req.body.courseName
    }
    if (req.body?.description !== undefined) {
        updates.description = req.body.description
    }

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({message: 'No course fields to update'})
    }

    const course = await courseModel.findByIdAndUpdate(
        req.params.id,
        updates,
        {new: true, runValidators: true}
    )

    if (!course) {
        return res.status(404).json({message: 'Course not found'})
    }

    return res.json({
        message: 'Course updated successfully',
        course
    })
}

const deleteCourse = async (req, res) => {
    if (!requireTeacher(req, res)) {
        return
    }

    if (!isValidCourseId(req.params.id, res)) {
        return
    }

    const course = await courseModel.findByIdAndDelete(req.params.id)

    if (!course) {
        return res.status(404).json({message: 'Course not found'})
    }

    return res.json({
        message: 'Course deleted successfully',
        course
    })
}

module.exports = {
    addCourses,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse
}