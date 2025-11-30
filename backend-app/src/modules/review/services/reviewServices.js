const Review = require('../models/Review');
const Product = require('../../product/models/Product');
const Order = require('../../order/models/Order');
const { ORDER_STATUS } = require('../../../constants');

const reviewService = {
  // Tạo review mới
  createReview: async (userId, reviewData) => {
    const { productId, rating, comment } = reviewData;

    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Sản phẩm không tồn tại');
    }

    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
    });

    if (existingReview) {
      throw new Error('Bạn đã đánh giá sản phẩm này rồi');
    }

    const order = await Order.findOne({
      user: userId,
      'items.product': productId,
      status: ORDER_STATUS.DELIVERED,
    });

    const isVerifiedPurchase = !!order;

    const review = await Review.create({
      user: userId,
      product: productId,
      rating,
      comment,
      isVerifiedPurchase,
    });

    await updateProductRating(productId);

    return await review.populate('user', 'name avatar');
  },

  // Lấy reviews của sản phẩm
  getProductReviews: async (productId, queryParams) => {
    const { page = 1, limit = 10, sort = '-createdAt' } = queryParams;

    const reviews = await Review.find({ product: productId })
      .populate('user', 'name avatar')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sort);

    const count = await Review.countDocuments({ product: productId });

    return {
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      total: count,
    };
  },

  // Lấy reviews của user
  getUserReviews: async (userId, queryParams) => {
    const { page = 1, limit = 10 } = queryParams;

    const reviews = await Review.find({ user: userId })
      .populate('product', 'name slug images')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort('-createdAt');

    const count = await Review.countDocuments({ user: userId });

    return {
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      total: count,
    };
  },

  // Cập nhật review
  updateReview: async (reviewId, userId, updateData) => {
    const review = await Review.findOne({ _id: reviewId, user: userId });

    if (!review) {
      throw new Error('Review không tồn tại');
    }

    const { rating, comment } = updateData;

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();

    // Cập nhật lại rating của product
    await updateProductRating(review.product);

    return await review.populate('user', 'name avatar');
  },

  // Xóa review
  deleteReview: async (reviewId, userId) => {
    const review = await Review.findOne({ _id: reviewId, user: userId });

    if (!review) {
      throw new Error('Review không tồn tại');
    }

    const productId = review.product;
    await review.deleteOne();

    await updateProductRating(productId);

    return { message: 'Xóa đánh giá thành công' };
  },

  // Admin: Xóa review
  adminDeleteReview: async (reviewId) => {
    const review = await Review.findById(reviewId);

    if (!review) {
      throw new Error('Review không tồn tại');
    }

    const productId = review.product;
    await review.deleteOne();

    // Cập nhật lại rating của product
    await updateProductRating(productId);

    return { message: 'Xóa đánh giá thành công' };
  },

  // Admin: Lấy tất cả reviews
  getAllReviews: async (queryParams) => {
    const { page = 1, limit = 10, productId, userId } = queryParams;

    const query = {};
    if (productId) query.product = productId;
    if (userId) query.user = userId;

    const reviews = await Review.find(query)
      .populate('user', 'name email avatar')
      .populate('product', 'name slug')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort('-createdAt');

    const count = await Review.countDocuments(query);

    return {
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      total: count,
    };
  },
};

async function updateProductRating(productId) {
  const reviews = await Review.find({ product: productId });

  if (reviews.length === 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: 0,
      numReviews: 0,
    });
  } else {
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const avgRating = totalRating / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      rating: avgRating.toFixed(1),
      numReviews: reviews.length,
    });
  }
}

module.exports = reviewService;