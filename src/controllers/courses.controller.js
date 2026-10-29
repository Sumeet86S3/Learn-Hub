const courseModel = require('../models/courses.model')

const addCourses = async (req,res) =>{

    const {courseName,description} = req.body
    
    if (req.role !== 'teacher'){
        return res.status(401).send('Not authorized')
    }

    const addACourse = await courseModel.create({
        courseName:courseName,
        description:description
    })

    return res.send({
        message:"course added successfully",
        course:addACourse
    })

}


module.exports = {addCourses}