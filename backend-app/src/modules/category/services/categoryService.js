const Category = require('../models/Category');
const Product = require('../../product/models/Product');
const categoryValidator = require('../validators/categoryValidator');

const categoryService = {
  getAllCategories: async (queryParams) => {
    const { page = 1, limit = 10, search = '', isActive } = queryParams;

    const query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const categories = await Category.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Category.countDocuments(query);

    return {
      categories,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      total: count,
    };
  },

  getCategoryById: async (categoryId) => {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error('Danh mục không tồn tại');
    }
    return category;
  },

  getCategoryBySlug: async (slug, queryParams = {}) => {
    const category = await Category.findOne({ slug });
    if (!category) {
      throw new Error('Danh mục không tồn tại');
    }

    const {
      page = 1,
      limit = 12,
      sort = '-createdAt',
      minPrice,
      maxPrice,
      brand,
      effect,
    } = queryParams;

    const productQuery = {
      category: category._id,
      isActive: true,
    };

    if (minPrice || maxPrice) {
      productQuery.price = {};
      if (minPrice) productQuery.price.$gte = Number(minPrice);
      if (maxPrice) productQuery.price.$lte = Number(maxPrice);
    }

    if (brand) {
      productQuery.brand = brand;
    }

    if (effect) {
      productQuery['effective.name'] = { $regex: effect, $options: 'i' };
    }

    const products = await Product.find(productQuery)
      .populate('category', 'name slug')
      .populate('brand', 'name slug')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sort);

    const productsCount = await Product.countDocuments(productQuery);

    return {
      category,
      products,
      pagination: {
        total: productsCount,
        totalPages: Math.ceil(productsCount / limit),
        currentPage: Number(page),
        limit: Number(limit),
      },
    };
  },

  createCategory: async (categoryData) => {
    const validatedData = categoryValidator.validateCreate(categoryData);
    let { name, description, image, images } = validatedData;

    // Nếu có images nhưng không có image, lấy ảnh đầu tiên làm image chính
    if (!image && images && images.length > 0) {
      image = images[0];
    }

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      throw new Error('Danh mục đã tồn tại');
    }

    const category = await Category.create({
      name,
      description,
      image,
      ...(images ? { images } : {}),
    });

    return category;
  },

  updateCategory: async (categoryId, updateData) => {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error('Danh mục không tồn tại');
    }
    const validatedData = categoryValidator.validateUpdate(updateData);
    const { name, description, isActive, image, images } = validatedData;

    if (name) {
      const existingCategory = await Category.findOne({
        name,
        _id: { $ne: categoryId },
      });
      if (existingCategory) {
        throw new Error('Tên danh mục đã tồn tại');
      }
      category.name = name;
    }

    if (description !== undefined) category.description = description;
    if (isActive !== undefined) category.isActive = isActive;
    if (image) category.image = image;
    if (images !== undefined) category.images = images;

    await category.save();
    return category;
  },

  updateCategoryImage: async (categoryId, imageUrl) => {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error('Danh mục không tồn tại');
    }
    
    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
      throw new Error('URL hình ảnh không hợp lệ');
    }
    
    category.image = imageUrl.trim();
    await category.save();
    return category;
  },

  deleteCategory: async (categoryId) => {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error('Danh mục không tồn tại');
    }

    const productsCount = await Product.countDocuments({ category: categoryId });
    
    if (productsCount > 0) {
      throw new Error(`Không thể xóa danh mục vì có ${productsCount} sản phẩm đang sử dụng`);
    }

    await category.deleteOne();
    return { message: 'Xóa danh mục thành công' };
  },
};

module.exports = categoryService;