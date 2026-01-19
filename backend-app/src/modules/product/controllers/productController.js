const productService = require('../services/productService');
const { validateProductCreate, validateProductUpdate } = require('../validators/productValidator');

const productController = {
  // @desc    Lấy tất cả sản phẩm
  // @route   GET /api/products
  // @access  Public
  getAllProducts: async (req, res, next) => {
    try {
      const result = await productService.getAllProducts(req.query);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Lấy sản phẩm theo category
  // @route   GET /api/products/category/:categoryId
  // @access  Public
  getProductsByCategory: async (req, res, next) => {
    try {
      const result = await productService.getProductsByCategory(
        req.params.categoryId,
        req.query
      );
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Lấy sản phẩm theo brand
  // @route   GET /api/products/brand/:brandId
  // @access  Public
  getProductsByBrand: async (req, res, next) => {
    try {
      const result = await productService.getProductsByBrand(
        req.params.brandId,
        req.query
      );
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Lấy sản phẩm theo effect
  // @route   GET /api/products/effect/:effectName
  // @access  Public
  getProductsByEffect: async (req, res, next) => {
    try {
      const result = await productService.getProductsByEffect(
        req.params.effectName,
        req.query
      );
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Lấy sản phẩm theo ID
  // @route   GET /api/products/:id
  // @access  Public
  getProductById: async (req, res, next) => {
    try {
      const product = await productService.getProductById(req.params.id);
      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Lấy sản phẩm theo slug
  // @route   GET /api/products/slug/:slug
  // @access  Public
  getProductBySlug: async (req, res, next) => {
    try {
      const product = await productService.getProductBySlug(req.params.slug);
      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Lấy sản phẩm nổi bật
  // @route   GET /api/products/featured
  // @access  Public
  getFeaturedProducts: async (req, res, next) => {
    try {
      const { limit } = req.query;
      const products = await productService.getFeaturedProducts(limit);
      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Lấy sản phẩm liên quan
  // @route   GET /api/products/:id/related
  // @access  Public
  getRelatedProducts: async (req, res, next) => {
    try {
      const product = await productService.getProductById(req.params.id);
      const relatedProducts = await productService.getRelatedProducts(
        req.params.id,
        product.category._id,
        req.query.limit
      );
      res.status(200).json({
        success: true,
        data: relatedProducts,
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Tạo sản phẩm mới
  // @route   POST /api/products
  // @access  Private/Admin
  createProduct: [
    validateProductCreate,
    async (req, res, next) => {
      try {
        const product = await productService.createProduct(req.body);
        res.status(201).json({
          success: true,
          data: product,
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      }
    }
  ],

  // @desc    Cập nhật sản phẩm
  // @route   PUT /api/products/:id
  // @access  Private/Admin
  updateProduct: [
    validateProductUpdate,
    async (req, res, next) => {
      try {
        const product = await productService.updateProduct(req.params.id, req.body);
        res.status(200).json({
          success: true,
          data: product,
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      }
    }
  ],

  // @desc    Thêm ảnh sản phẩm
  // @route   POST /api/products/:id/images
  // @access  Private/Admin
  addProductImages: async (req, res, next) => {
    try {
      const { images } = req.body;
      if (!images || !Array.isArray(images) || images.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Danh sách URL hình ảnh là bắt buộc',
        });
      }
      const product = await productService.addProductImages(req.params.id, images);
      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // @desc    Xóa ảnh sản phẩm
  // @route   DELETE /api/products/:id/images
  // @access  Private/Admin
  deleteProductImages: async (req, res, next) => {
    try {
      const { images } = req.body;
      if (!images || !Array.isArray(images) || images.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Danh sách URL hình ảnh là bắt buộc',
        });
      }
      const product = await productService.deleteProductImages(req.params.id, images);
      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // @desc    Xóa sản phẩm
  // @route   DELETE /api/products/:id
  // @access  Private/Admin
  deleteProduct: async (req, res, next) => {
    try {
      const result = await productService.deleteProduct(req.params.id);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
};

module.exports = productController;