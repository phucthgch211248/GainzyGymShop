const Cart = require('../models/Cart');
const Product = require('../../product/models/Product');

const cartService = {
  getCart: async (userId) => {
    let cart = await Cart.findOne({ user: userId }).populate({
      path: 'items.product',
      select: 'name slug price discount images stock isActive',
    });

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    return cart;
  },

  addToCart: async (userId, productId, quantity = 1) => {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Sản phẩm không tồn tại');
    }

    if (!product.isActive) {
      throw new Error('Sản phẩm không còn bán');
    }

    if (product.stock < quantity) {
      throw new Error('Không đủ hàng trong kho');
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    const price = product.discount > 0 
      ? product.price * (1 - product.discount / 100)
      : product.price;

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (product.stock < newQuantity) {
        throw new Error('Không đủ hàng trong kho');
      }
      
      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].price = price;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price,
      });
    }

    await cart.save();
    return await cart.populate({
      path: 'items.product',
      select: 'name slug price discount images stock isActive',
    });
  },

  updateCartItem: async (userId, productId, quantity) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new Error('Giỏ hàng không tồn tại');
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Sản phẩm không tồn tại');
    }

    if (product.stock < quantity) {
      throw new Error('Không đủ hàng trong kho');
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      throw new Error('Sản phẩm không có trong giỏ hàng');
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    return await cart.populate({
      path: 'items.product',
      select: 'name slug price discount images stock isActive',
    });
  },

  removeFromCart: async (userId, productId) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new Error('Giỏ hàng không tồn tại');
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    return await cart.populate({
      path: 'items.product',
      select: 'name slug price discount images stock isActive',
    });
  },

  clearCart: async (userId) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new Error('Giỏ hàng không tồn tại');
    }

    cart.items = [];
    await cart.save();
    return cart;
  },
};

module.exports = cartService;