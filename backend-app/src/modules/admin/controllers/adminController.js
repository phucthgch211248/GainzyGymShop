const adminService = require('../services/adminService');

const adminController = {
  // @desc    Lấy thống kê tổng quan
  // @route   GET /api/admin/dashboard/stats
  // @access  Private/Admin
  getDashboardStats: async (req, res, next) => {
    try {
      const stats = await adminService.getDashboardStats();
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Lấy thống kê doanh thu theo tháng
  // @route   GET /api/admin/dashboard/revenue-by-month
  // @access  Private/Admin
  getRevenueByMonth: async (req, res, next) => {
    try {
      const data = await adminService.getRevenueByMonth();
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Lấy top sản phẩm bán chạy
  // @route   GET /api/admin/dashboard/top-selling-products
  // @access  Private/Admin
  getTopSellingProducts: async (req, res, next) => {
    try {
      const { limit } = req.query;
      const products = await adminService.getTopSellingProducts(limit);
      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Lấy sản phẩm sắp hết hàng
  // @route   GET /api/admin/dashboard/low-stock-products
  // @access  Private/Admin
  getLowStockProducts: async (req, res, next) => {
    try {
      const { threshold } = req.query;
      const products = await adminService.getLowStockProducts(threshold);
      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Lấy đơn hàng gần đây
  // @route   GET /api/admin/dashboard/recent-orders
  // @access  Private/Admin
  getRecentOrders: async (req, res, next) => {
    try {
      const { limit } = req.query;
      const orders = await adminService.getRecentOrders(limit);
      res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Lấy thống kê theo trạng thái đơn hàng
  // @route   GET /api/admin/dashboard/order-status-stats
  // @access  Private/Admin
  getOrderStatusStats: async (req, res, next) => {
    try {
      const stats = await adminService.getOrderStatusStats();
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Lấy top khách hàng
  // @route   GET /api/admin/dashboard/top-customers
  // @access  Private/Admin
  getTopCustomers: async (req, res, next) => {
    try {
      const { limit } = req.query;
      const customers = await adminService.getTopCustomers(limit);
      res.status(200).json({
        success: true,
        data: customers,
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Lấy thống kê đánh giá
  // @route   GET /api/admin/dashboard/rating-stats
  // @access  Private/Admin
  getAverageRatings: async (req, res, next) => {
    try {
      const stats = await adminService.getAverageRatings();
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = adminController;