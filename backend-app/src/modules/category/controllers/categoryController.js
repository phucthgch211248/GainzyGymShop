const categoryService = require('../services/categoryService');

const categoryController = {
  // @desc    Lấy tất cả danh mục
  // @route   GET /api/categories
  // @access  Public
  getAllCategories: async (req, res, next) => {
    try {
      const result = await categoryService.getAllCategories(req.query);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Lấy danh mục theo ID
  // @route   GET /api/categories/:id
  // @access  Public
  getCategoryById: async (req, res, next) => {
    try {
      const category = await categoryService.getCategoryById(req.params.id);
      res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Lấy danh mục theo slug
  // @route   GET /api/categories/slug/:slug
  // @access  Public
  getCategoryBySlug: async (req, res, next) => {
    try {
      const category = await categoryService.getCategoryBySlug(req.params.slug);
      res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Tạo danh mục mới (FE upload image, gửi URL)
  // @route   POST /api/categories
  // @access  Private/Admin
  createCategory: async (req, res, next) => {
    try {
      const category = await categoryService.createCategory(req.body);
      res.status(201).json({
        success: true,
        data: category,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // @desc    Cập nhật danh mục (bao gồm image URL)
  // @route   PUT /api/categories/:id
  // @access  Private/Admin
  updateCategory: async (req, res, next) => {
    try {
      const category = await categoryService.updateCategory(req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // @desc    Cập nhật ảnh danh mục
  // @route   PUT /api/categories/:id/image
  // @access  Private/Admin
  updateCategoryImage: async (req, res, next) => {
    try {
      const { image } = req.body;
      if (!image) {
        return res.status(400).json({
          success: false,
          message: 'URL hình ảnh là bắt buộc',
        });
      }
      const category = await categoryService.updateCategoryImage(req.params.id, image);
      res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // @desc    Xóa danh mục
  // @route   DELETE /api/categories/:id
  // @access  Private/Admin
  deleteCategory: async (req, res, next) => {
    try {
      const result = await categoryService.deleteCategory(req.params.id);
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

module.exports = categoryController;