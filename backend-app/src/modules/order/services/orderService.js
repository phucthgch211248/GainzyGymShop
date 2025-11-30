const Order = require('../models/Order');
const Cart = require('../../cart/models/Cart');
const Product = require('../../product/models/Product');
const { ORDER_STATUS, PAYMENT_STATUS } = require('../../../constants');

const orderService = {
  createOrder: async (userId, orderData) => {
    const { shippingAddress, paymentMethod, shippingPrice = 30000, note } = orderData;

    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      throw new Error('Giỏ hàng trống');
    }

    const orderItems = [];
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      
      if (!product) {
        throw new Error(`Sản phẩm ${item.product.name} không tồn tại`);
      }

      if (!product.isActive) {
        throw new Error(`Sản phẩm ${product.name} không còn bán`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Sản phẩm ${product.name} không đủ hàng trong kho`);
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || '',
        price: item.price,
        quantity: item.quantity,
      });
    }

    const itemsPrice = orderItems.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    const totalPrice = itemsPrice + shippingPrice;

    const order = await Order.create({
      user: userId,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      note,
    });

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, sold: item.quantity },
      });
    }

    // Xóa giỏ hàng
    cart.items = [];
    await cart.save();

    return await order.populate('user', 'name email phone');
  },

  getUserOrders: async (userId, queryParams) => {
    const { page = 1, limit = 10, status } = queryParams;

    const query = { user: userId };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Order.countDocuments(query);

    return {
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      total: count,
    };
  },

  getOrderById: async (orderId, userId, userRole) => {
    const query = { _id: orderId };
    
    if (userRole !== 'admin') {
      query.user = userId;
    }

    const order = await Order.findOne(query)
      .populate('user', 'name email phone')
      .populate('items.product', 'name slug');

    if (!order) {
      throw new Error('Đơn hàng không tồn tại');
    }

    return order;
  },

  cancelOrder: async (orderId, userId) => {
    const order = await Order.findOne({ _id: orderId, user: userId });

    if (!order) {
      throw new Error('Đơn hàng không tồn tại');
    }

    if (order.status !== ORDER_STATUS.PENDING) {
      throw new Error('Chỉ có thể hủy đơn hàng đang chờ xử lý');
    }

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, sold: -item.quantity },
      });
    }

    order.status = ORDER_STATUS.CANCELLED;
    order.cancelledAt = new Date();
    await order.save();

    return order;
  },

  getAllOrders: async (queryParams) => {
    const { page = 1, limit = 10, status, search } = queryParams;

    const query = {};
    if (status) {
      query.status = status;
    }
    if (search) {
      query.orderNumber = { $regex: search, $options: 'i' };
    }

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Order.countDocuments(query);

    return {
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      total: count,
    };
  },

  updateOrderStatus: async (orderId, status) => {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('Đơn hàng không tồn tại');
    }

    order.status = status;

    if (status === ORDER_STATUS.DELIVERED) {
      order.deliveredAt = new Date();
      order.paymentStatus = PAYMENT_STATUS.PAID;
      order.paidAt = new Date();
    }

    if (status === ORDER_STATUS.CANCELLED) {
      order.cancelledAt = new Date();
      
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity, sold: -item.quantity },
        });
      }
    }

    await order.save();
    return order;
  },

  updatePaymentStatus: async (orderId, paymentStatus) => {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('Đơn hàng không tồn tại');
    }

    order.paymentStatus = paymentStatus;

    if (paymentStatus === PAYMENT_STATUS.PAID) {
      order.paidAt = new Date();
    }

    await order.save();
    return order;
  },
};

module.exports = orderService;