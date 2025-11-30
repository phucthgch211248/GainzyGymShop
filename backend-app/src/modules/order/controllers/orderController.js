const orderService = require('../services/orderService');

const orderController = {
  // @desc    Tạo đơn hàng
  // @route   POST /api/orders
  // @access  Private
  createOrder: async (req, res, next) => {
    try {
      const order = await orderService.createOrder(req.user._id, req.body);
      res.status(201).json({
        success: true,
        data: order,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // @desc    Lấy danh sách đơn hàng của user
  // @route   GET /api/orders/my-orders
  // @access  Private
  getUserOrders: async (req, res, next) => {
    try {
      const result = await orderService.getUserOrders(req.user._id, req.query);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Lấy chi tiết đơn hàng
  // @route   GET /api/orders/:id
  // @access  Private
  getOrderById: async (req, res, next) => {
    try {
      const orderId = req.params.id;
      const userId = req.user._id;
      const userRole = req.user.role;
      const order = await orderService.getOrderById(orderId, userId, userRole);
      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  },

  // @desc    Hủy đơn hàng
  // @route   PUT /api/orders/:id/cancel
  // @access  Private
  cancelOrder: async (req, res, next) => {
    try {
      const order = await orderService.cancelOrder(req.params.id, req.user._id);
      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // @desc    Lấy tất cả đơn hàng (Admin)
  // @route   GET /api/orders
  // @access  Private/Admin
  getAllOrders: async (req, res, next) => {
    try {
      const result = await orderService.getAllOrders(req.query);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Cập nhật trạng thái đơn hàng (Admin)
  // @route   PUT /api/orders/:id/status
  // @access  Private/Admin
  updateOrderStatus: async (req, res, next) => {
    try {
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp trạng thái',
        });
      }

      const order = await orderService.updateOrderStatus(req.params.id, status);
      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // @desc    Cập nhật trạng thái thanh toán (Admin)
  // @route   PUT /api/orders/:id/payment
  // @access  Private/Admin
  updatePaymentStatus: async (req, res, next) => {
    try {
      const { paymentStatus } = req.body;
      
      if (!paymentStatus) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp trạng thái thanh toán',
        });
      }

      const order = await orderService.updatePaymentStatus(req.params.id, paymentStatus);
      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
};

module.exports = orderController;