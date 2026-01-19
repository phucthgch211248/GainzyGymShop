const brandService = require('../services/brandService');

const brandController = {
  // @desc    Lấy tất cả thương hiệu
  // @route   GET /api/brands
  // @access  Public
  getAllBrands: async (req, res, next) => {
    try {
      const result = await brandService.getAllBrands(req.query);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Lấy danh mục theo ID
  // @route   GET /api/brands/:id
  // @access  Public
  getBrandById: async (req, res, next) => {
    try {
      const brand = await brandService.getBrandById(req.params.id);
      res.status(200).json({
        success: true,
        data: brand,
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Lấy danh mục theo slug
  // @route   GET /api/brands/slug/:slug
  // @access  Public
  getBrandBySlug: async (req, res, next) => {
    try {
      const brand = await brandService.getBrandBySlug(req.params.slug);
      res.status(200).json({
        success: true,
        data: brand,
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Tạo danh mục mới (FE upload image, gửi URL)
  // @route   POST /api/brands
  // @access  Private/Admin
  createBrand: async (req, res, next) => {
    try {
      const brand = await brandService.createBrand(req.body);
      res.status(201).json({
        success: true,
        data: brand,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // @desc    Cập nhật thương hiệu (bao gồm image URL)
  // @route   PUT /api/brands/:id
  // @access  Private/Admin
  updateBrand: async (req, res, next) => {
    try {
      const brand = await brandService.updateBrand(req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: brand,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // @desc    Cập nhật ảnh thương hiệu
  // @route   PUT /api/brands/:id/image
  // @access  Private/Admin
  updateBrandImage: async (req, res, next) => {
    try {
      const { image } = req.body;
      if (!image) {
        return res.status(400).json({
          success: false,
          message: 'URL hình ảnh là bắt buộc',
        });
      }
      const brand = await brandService.updateBrandImage(req.params.id, image);
      res.status(200).json({
        success: true,
        data: brand,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // @desc    Xóa thương hiệu
  // @route   DELETE /api/brands/:id
  // @access  Private/Admin
  deleteBrand: async (req, res, next) => {
    try {
      const result = await brandService.deleteBrand(req.params.id);
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

module.exports = brandController;