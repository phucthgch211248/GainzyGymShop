const cartService = require('../services/cartService');

const cartController = {
  // @desc    Lấy giỏ hàng
  // @route   GET /api/cart
  // @access  Private
  getCart: async (req, res, next) => {
    try {
      const cart = await cartService.getCart(req.user._id);
      res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Thêm sản phẩm vào giỏ hàng
  // @route   POST /api/cart
  // @access  Private
  addToCart: async (req, res, next) => {
    try {
      const { productId, quantity } = req.body;

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp productId',
        });
      }

      const cart = await cartService.addToCart(
        req.user._id,
        productId,
        quantity || 1
      );

      res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // @desc    Cập nhật số lượng sản phẩm
  // @route   PUT /api/cart/:productId
  // @access  Private
  updateCartItem: async (req, res, next) => {
    try {
      const { quantity } = req.body;

      if (!quantity || quantity < 0) {
        return res.status(400).json({
          success: false,
          message: 'Số lượng không hợp lệ',
        });
      }

      const cart = await cartService.updateCartItem(
        req.user._id,
        req.params.productId,
        quantity
      );

      res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // @desc    Xóa sản phẩm khỏi giỏ hàng
  // @route   DELETE /api/cart/:productId
  // @access  Private
  removeFromCart: async (req, res, next) => {
    try {
      const cart = await cartService.removeFromCart(
        req.user._id,
        req.params.productId
      );

      res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // @desc    Xóa toàn bộ giỏ hàng
  // @route   DELETE /api/cart
  // @access  Private
  clearCart: async (req, res, next) => {
    try {
      const cart = await cartService.clearCart(req.user._id);
      res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = cartController;