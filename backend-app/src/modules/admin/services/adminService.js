const User = require('../../user/models/User');
const Product = require('../../product/models/Product');
const Order = require('../../order/models/Order');
const Review = require('../../review/models/Review');
const { ORDER_STATUS, PAYMENT_STATUS } = require('../../../constants');

const adminService = {
  // Thống kê tổng quan
  getDashboardStats: async () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Tổng số users
    const totalUsers = await User.countDocuments();
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    });
    const newUsersLastMonth = await User.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });

    // Tổng số sản phẩm
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const outOfStock = await Product.countDocuments({ stock: 0 });

    // Tổng số đơn hàng
    const totalOrders = await Order.countDocuments();
    const ordersThisMonth = await Order.countDocuments({
      createdAt: { $gte: startOfMonth },
    });
    const pendingOrders = await Order.countDocuments({
      status: ORDER_STATUS.PENDING,
    });
    const processingOrders = await Order.countDocuments({
      status: ORDER_STATUS.PROCESSING,
    });

    // Doanh thu
    const revenueResult = await Order.aggregate([
      {
        $match: {
          status: ORDER_STATUS.DELIVERED,
          paymentStatus: PAYMENT_STATUS.PAID,
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
    ]);

    const revenueThisMonthResult = await Order.aggregate([
      {
        $match: {
          status: ORDER_STATUS.DELIVERED,
          paymentStatus: PAYMENT_STATUS.PAID,
          createdAt: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
    ]);

    const revenueLastMonthResult = await Order.aggregate([
      {
        $match: {
          status: ORDER_STATUS.DELIVERED,
          paymentStatus: PAYMENT_STATUS.PAID,
          createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;
    const revenueThisMonth = revenueThisMonthResult[0]?.totalRevenue || 0;
    const revenueLastMonth = revenueLastMonthResult[0]?.totalRevenue || 0;

    // Tổng số reviews
    const totalReviews = await Review.countDocuments();
    const reviewsThisMonth = await Review.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    const userGrowth = newUsersLastMonth > 0
      ? ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100
      : 100;

    const revenueGrowth = revenueLastMonth > 0
      ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100
      : 100;

    return {
      users: {
        total: totalUsers,
        newThisMonth: newUsersThisMonth,
        growth: userGrowth.toFixed(2),
      },
      products: {
        total: totalProducts,
        active: activeProducts,
        outOfStock,
      },
      orders: {
        total: totalOrders,
        thisMonth: ordersThisMonth,
        pending: pendingOrders,
        processing: processingOrders,
      },
      revenue: {
        total: totalRevenue,
        thisMonth: revenueThisMonth,
        lastMonth: revenueLastMonth,
        growth: revenueGrowth.toFixed(2),
      },
      reviews: {
        total: totalReviews,
        thisMonth: reviewsThisMonth,
      },
    };
  },

  getRevenueByMonth: async () => {
    const result = await Order.aggregate([
      {
        $match: {
          status: ORDER_STATUS.DELIVERED,
          paymentStatus: PAYMENT_STATUS.PAID,
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 11)),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$totalPrice' },
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    return result.map((item) => ({
      month: `${item._id.month}/${item._id.year}`,
      revenue: item.revenue,
      orderCount: item.orderCount,
    }));
  },

  // Top sản phẩm bán chạy
  getTopSellingProducts: async (limit = 10) => {
    const products = await Product.find()
      .sort({ sold: -1 })
      .limit(limit)
      .select('name slug images price sold stock');

    return products;
  },

  // Sản phẩm sắp hết hàng
  getLowStockProducts: async (threshold = 10) => {
    const products = await Product.find({
      stock: { $lte: threshold, $gt: 0 },
      isActive: true,
    })
      .sort({ stock: 1 })
      .select('name slug images stock');

    return products;
  },

  // Đơn hàng gần đây
  getRecentOrders: async (limit = 10) => {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('orderNumber user totalPrice status createdAt');

    return orders;
  },

  // Thống kê theo trạng thái đơn hàng
  getOrderStatusStats: async () => {
    const result = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalPrice' },
        },
      },
    ]);

    return result.map((item) => ({
      status: item._id,
      count: item.count,
      totalAmount: item.totalAmount,
    }));
  },

  // Top khách hàng (theo tổng giá trị đơn hàng)
  getTopCustomers: async (limit = 10) => {
    const result = await Order.aggregate([
      {
        $match: {
          status: ORDER_STATUS.DELIVERED,
        },
      },
      {
        $group: {
          _id: '$user',
          totalSpent: { $sum: '$totalPrice' },
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: { totalSpent: -1 },
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: '$userDetails',
      },
      {
        $project: {
          _id: 1,
          name: '$userDetails.name',
          email: '$userDetails.email',
          totalSpent: 1,
          orderCount: 1,
        },
      },
    ]);

    return result;
  },

  // Thống kê đánh giá trung bình
  getAverageRatings: async () => {
    const result = await Review.aggregate([
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return result.map((item) => ({
      rating: item._id,
      count: item.count,
    }));
  },
};

module.exports = adminService;