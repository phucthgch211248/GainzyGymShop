const { body, param, query, validationResult } = require('express-validator');
const { ORDER_STATUS, PAYMENT_STATUS, PAYMENT_METHOD } = require('../../../constants');

const orderValidator = {
  createOrder: [
    body('shippingAddress.fullName')
      .trim()
      .notEmpty()
      .withMessage('Họ tên người nhận là bắt buộc')
      .isLength({ min: 2, max: 100 })
      .withMessage('Họ tên phải từ 2-100 ký tự'),

    body('shippingAddress.phone')
      .trim()
      .notEmpty()
      .withMessage('Số điện thoại là bắt buộc')
      .matches(/^(0|\+84)[0-9]{9}$/)
      .withMessage('Số điện thoại không hợp lệ'),

    body('shippingAddress.street')
      .trim()
      .notEmpty()
      .withMessage('Địa chỉ đường/phố là bắt buộc')
      .isLength({ min: 5, max: 200 })
      .withMessage('Địa chỉ phải từ 5-200 ký tự'),

    body('shippingAddress.ward')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Tên phường/xã không được quá 100 ký tự'),

    body('shippingAddress.district')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Tên quận/huyện không được quá 100 ký tự'),

    body('shippingAddress.city')
      .trim()
      .notEmpty()
      .withMessage('Tỉnh/thành phố là bắt buộc')
      .isLength({ max: 100 })
      .withMessage('Tên tỉnh/thành phố không được quá 100 ký tự'),

    body('paymentMethod')
      .notEmpty()
      .withMessage('Phương thức thanh toán là bắt buộc')
      .isIn(Object.values(PAYMENT_METHOD))
      .withMessage('Phương thức thanh toán không hợp lệ'),

    body('shippingPrice')
      .optional()
      .isNumeric()
      .withMessage('Phí vận chuyển phải là số')
      .custom((value) => value >= 0)
      .withMessage('Phí vận chuyển không được âm'),

    body('note')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Ghi chú không được quá 500 ký tự'),
  ],

  getUserOrders: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Trang phải là số nguyên dương'),

    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Giới hạn phải từ 1-100'),

    query('status')
      .optional()
      .isIn(Object.values(ORDER_STATUS))
      .withMessage('Trạng thái đơn hàng không hợp lệ'),
  ],

  getOrderById: [
    param('id')
      .notEmpty()
      .withMessage('ID đơn hàng là bắt buộc')
      .isMongoId()
      .withMessage('ID đơn hàng không hợp lệ'),
  ],

  cancelOrder: [
    param('id')
      .notEmpty()
      .withMessage('ID đơn hàng là bắt buộc')
      .isMongoId()
      .withMessage('ID đơn hàng không hợp lệ'),
  ],

  getAllOrders: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Trang phải là số nguyên dương'),

    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Giới hạn phải từ 1-100'),

    query('status')
      .optional()
      .isIn(Object.values(ORDER_STATUS))
      .withMessage('Trạng thái đơn hàng không hợp lệ'),

    query('search')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Từ khóa tìm kiếm phải từ 1-50 ký tự'),
  ],

  updateOrderStatus: [
    param('id')
      .notEmpty()
      .withMessage('ID đơn hàng là bắt buộc')
      .isMongoId()
      .withMessage('ID đơn hàng không hợp lệ'),

    body('status')
      .notEmpty()
      .withMessage('Trạng thái đơn hàng là bắt buộc')
      .isIn(Object.values(ORDER_STATUS))
      .withMessage('Trạng thái đơn hàng không hợp lệ'),
  ],

  updatePaymentStatus: [
    param('id')
      .notEmpty()
      .withMessage('ID đơn hàng là bắt buộc')
      .isMongoId()
      .withMessage('ID đơn hàng không hợp lệ'),

    body('paymentStatus')
      .notEmpty()
      .withMessage('Trạng thái thanh toán là bắt buộc')
      .isIn(Object.values(PAYMENT_STATUS))
      .withMessage('Trạng thái thanh toán không hợp lệ'),
  ],

  handleValidationErrors: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg,
        })),
      });
    }
    next();
  },
};

module.exports = orderValidator;