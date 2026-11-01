const {Router} = require('express')
const reviewsController = require('../controllers/reviews.controller')
const authMiddleware = require('../middlewares/auth.middleware')

const router = Router()

router.put('/:reviewId', authMiddleware, reviewsController.updateReview)
router.delete('/:reviewId', authMiddleware, reviewsController.deleteReview)

module.exports = router
