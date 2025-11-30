const reviewService = require('../services/reviewServices');

const reviewController = {
  // @desc    Tạo review
  // @route   POST /api/reviews
  // @access  Private
  createReview: async (req, res, next) => {
    try {
      const review = await reviewService.createReview(req.user._id, req.body);
      res.status(201).json({
        success: true,
        data: review,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // @desc    Lấy reviews của sản phẩm
  // @route   GET /api/reviews/product/:productId
  // @access  Public
  getProductReviews: async (req, res, next) => {
    try {
      const result = await reviewService.getProductReviews(
        req.params.productId,
        req.query
      );
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Lấy reviews của user
  // @route   GET /api/reviews/my-reviews
  // @access  Private
  getUserReviews: async (req, res, next) => {
    try {
      const result = await reviewService.getUserReviews(req.user._id, req.query);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Cập nhật review
  // @route   PUT /api/reviews/:id
  // @access  Private
  updateReview: async (req, res, next) => {
    try {
      const review = await reviewService.updateReview(
        req.params.id,
        req.user._id,
        req.body
      );
      res.status(200).json({
        success: true,
        data: review,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // @desc    Xóa review
  // @route   DELETE /api/reviews/:id
  // @access  Private
  deleteReview: async (req, res, next) => {
    try {
      const result = await reviewService.deleteReview(req.params.id, req.user._id);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // @desc    Admin: Lấy tất cả reviews
  // @route   GET /api/reviews
  // @access  Private/Admin
  getAllReviews: async (req, res, next) => {
    try {
      const result = await reviewService.getAllReviews(req.query);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Admin: Xóa review
  // @route   DELETE /api/reviews/:id/admin
  // @access  Private/Admin
  adminDeleteReview: async (req, res, next) => {
    try {
      const result = await reviewService.adminDeleteReview(req.params.id);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
};

module.exports = reviewController;