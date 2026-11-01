const {Router} = require('express')
const enrollmentsController = require('../controllers/enrollments.controller')
const authMiddleware = require('../middlewares/auth.middleware')

const router = Router()

router.post('/:courseId', authMiddleware, enrollmentsController.enrollInCourse)
router.get('/my-courses', authMiddleware, enrollmentsController.getMyCourses)

module.exports = router
