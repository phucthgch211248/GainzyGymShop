const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const reviewValidator = require('../validators/reviewValidator');
const { protect, authorize } = require('../../../middleware/auth');
const { ROLES } = require('../../../constants');

// Public routes
router.get(
  '/product/:productId',
  reviewValidator.validateObjectId('productId'),
  reviewController.getProductReviews
);

// User routes
router.post(
  '/',
  protect,
  reviewValidator.validateCreateReview,
  reviewController.createReview
);

router.get('/my-reviews', protect, reviewController.getUserReviews);

router.put(
  '/:id',
  protect,
  reviewValidator.validateObjectId('id'),
  reviewValidator.validateUpdateReview,
  reviewController.updateReview
);

router.delete(
  '/:id',
  protect,
  reviewValidator.validateObjectId('id'),
  reviewController.deleteReview
);

// Admin routes
router.get('/', protect, authorize(ROLES.ADMIN), reviewController.getAllReviews);

router.delete(
  '/:id/admin',
  protect,
  authorize(ROLES.ADMIN),
  reviewValidator.validateObjectId('id'),
  reviewController.adminDeleteReview
);

module.exports = router;