const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, authorize } = require('../../../middleware/auth');
const { ROLES } = require('../../../constants');
const orderValidator = require('../validators/orderValidator');

router.get(
  '/all',
  protect,
  authorize(ROLES.ADMIN),
  orderValidator.getAllOrders,
  orderValidator.handleValidationErrors,
  orderController.getAllOrders
);

// User routes
router.post(
  '/',
  protect,
  orderValidator.createOrder,
  orderValidator.handleValidationErrors,
  orderController.createOrder
);

router.get(
  '/my-orders',
  protect,
  orderValidator.getUserOrders,
  orderValidator.handleValidationErrors,
  orderController.getUserOrders
);

router.get(
  '/:id',
  protect,
  orderValidator.getOrderById,
  orderValidator.handleValidationErrors,
  orderController.getOrderById
);

router.put(
  '/:id/cancel',
  protect,
  orderValidator.cancelOrder,
  orderValidator.handleValidationErrors,
  orderController.cancelOrder
);

router.put(
  '/:id/status',
  protect,
  authorize(ROLES.ADMIN),
  orderValidator.updateOrderStatus,
  orderValidator.handleValidationErrors,
  orderController.updateOrderStatus
);

router.put(
  '/:id/payment',
  protect,
  authorize(ROLES.ADMIN),
  orderValidator.updatePaymentStatus,
  orderValidator.handleValidationErrors,
  orderController.updatePaymentStatus
);

module.exports = router;