const {Router} = require('express')
const coursesController = require('../controllers/courses.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router = Router()

router.post('/add',authMiddleware, coursesController.addCourses)


module.exports = router