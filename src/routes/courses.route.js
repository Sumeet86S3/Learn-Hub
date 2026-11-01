const {Router} = require('express')
const coursesController = require('../controllers/courses.controller')
const authMiddleware = require('../middlewares/auth.middleware')

const router = Router()

router.post('/add', authMiddleware, coursesController.addCourses)
router.get('/', coursesController.getCourses)
router.get('/:id', coursesController.getCourseById)
router.put('/:id', authMiddleware, coursesController.updateCourse)
router.delete('/:id', authMiddleware, coursesController.deleteCourse)


module.exports = router