const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../../../middleware/auth');
const { ROLES } = require('../../../constants');

router.use(protect);
router.use(authorize(ROLES.ADMIN));

router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/dashboard/revenue-by-month', adminController.getRevenueByMonth);
router.get('/dashboard/top-selling-products', adminController.getTopSellingProducts);
router.get('/dashboard/low-stock-products', adminController.getLowStockProducts);
router.get('/dashboard/recent-orders', adminController.getRecentOrders);
router.get('/dashboard/order-status-stats', adminController.getOrderStatusStats);
router.get('/dashboard/top-customers', adminController.getTopCustomers);
router.get('/dashboard/rating-stats', adminController.getAverageRatings);

module.exports = router;