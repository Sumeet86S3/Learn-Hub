const {Router} = require('express')
const coursesController = require('../controllers/courses.controller')
const reviewsController = require('../controllers/reviews.controller')
const authMiddleware = require('../middlewares/auth.middleware')

const router = Router()

router.post('/', authMiddleware, coursesController.addCourses)
router.get('/', coursesController.getCourses)
router.get('/:id', coursesController.getCourseById)
router.put('/:id', authMiddleware, coursesController.updateCourse)
router.delete('/:id', authMiddleware, coursesController.deleteCourse)
router.post('/:courseId/reviews', authMiddleware, reviewsController.addCourseReview)
router.get('/:courseId/reviews', reviewsController.getCourseReviews)


module.exports = router