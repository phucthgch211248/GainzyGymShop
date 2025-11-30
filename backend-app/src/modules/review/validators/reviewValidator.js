const mongoose = require('mongoose');

const reviewValidator = {
  validateCreateReview: (req, res, next) => {
    const { productId, rating, comment } = req.body;
    const errors = [];

    if (!productId) {
      errors.push('productId là bắt buộc');
    } else if (!mongoose.Types.ObjectId.isValid(productId)) {
      errors.push('productId không hợp lệ');
    }

    if (!rating && rating !== 0) {
      errors.push('rating là bắt buộc');
    } else if (typeof rating !== 'number') {
      errors.push('rating phải là số');
    } else if (rating < 1 || rating > 5) {
      errors.push('rating phải từ 1 đến 5');
    } else if (!Number.isInteger(rating)) {
      errors.push('rating phải là số nguyên');
    }

    if (!comment) {
      errors.push('comment là bắt buộc');
    } else if (typeof comment !== 'string') {
      errors.push('comment phải là chuỗi');
    } else {
      const trimmedComment = comment.trim();
      if (trimmedComment.length === 0) {
        errors.push('comment không được để trống');
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errors,
      });
    }

    req.body.comment = comment.trim();

    next();
  },

  validateUpdateReview: (req, res, next) => {
    const { rating, comment } = req.body;
    const errors = [];

    if (!rating && !comment) {
      errors.push('Phải có ít nhất rating hoặc comment để cập nhật');
    }

    if (rating !== undefined) {
      if (typeof rating !== 'number') {
        errors.push('rating phải là số');
      } else if (rating < 1 || rating > 5) {
        errors.push('rating phải từ 1 đến 5');
      } else if (!Number.isInteger(rating)) {
        errors.push('rating phải là số nguyên');
      }
    }

    if (comment !== undefined) {
      if (typeof comment !== 'string') {
        errors.push('comment phải là chuỗi');
      } else {
        const trimmedComment = comment.trim();
        if (trimmedComment.length === 0) {
          errors.push('comment không được để trống');
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errors,
      });
    }

    if (comment) {
      req.body.comment = comment.trim();
    }

    next();
  },

  validateObjectId: (paramName) => {
    return (req, res, next) => {
      const id = req.params[paramName];

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: `${paramName} không hợp lệ`,
        });
      }

      next();
    };
  },
};

module.exports = reviewValidator;