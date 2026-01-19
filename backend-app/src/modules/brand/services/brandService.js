const Brand = require('../models/Brand');
const Product = require('../../product/models/Product');
const brandValidator = require('../validators/brandValidator');

const brandService = {
  getAllBrands: async (queryParams) => {
    const { page = 1, limit = 10, search = '', isActive } = queryParams;

    const query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const brands = await Brand.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Brand.countDocuments(query);

    return {
      brands,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      total: count,
    };
  },

  getBrandById: async (brandId) => {
    const brand = await Brand.findById(brandId);
    if (!brand) {
      throw new Error('Thương hiệu không tồn tại');
    }
    return brand;
  },

  getBrandBySlug: async (slug, queryParams = {}) => {
    const brand = await Brand.findOne({ slug });
    if (!brand) {
      throw new Error('Thương hiệu không tồn tại');
    }

    const {
      page = 1,
      limit = 12,
      sort = '-createdAt',
      minPrice,
      maxPrice,
      category,
      effect,
    } = queryParams;

    const productQuery = {
      brand: brand._id,
      isActive: true,
    };

    if (minPrice || maxPrice) {
      productQuery.price = {};
      if (minPrice) productQuery.price.$gte = Number(minPrice);
      if (maxPrice) productQuery.price.$lte = Number(maxPrice);
    }

    if (category) {
      productQuery.category = category;
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
      brand,
      products,
      pagination: {
        total: productsCount,
        totalPages: Math.ceil(productsCount / limit),
        currentPage: Number(page),
        limit: Number(limit),
      },
    };
  },

  createBrand: async (brandData) => {
    const validatedData = brandValidator.validateCreate(brandData);
    const { name, description, image } = validatedData;

    const brandExists = await Brand.findOne({ name });
    if (brandExists) {
      throw new Error('Thương hiệu đã tồn tại');
    }

    const brand = await Brand.create({
      name,
      description,
      image,
    });

    return brand;
  },

  updateBrand: async (brandId, updateData) => {
    const brand = await Brand.findById(brandId);
    if (!brand) {
      throw new Error('Thương hiệu không tồn tại');
    }
    
    const validatedData = brandValidator.validateUpdate(updateData);
    const { name, description, isActive, image } = validatedData;

    if (name) {
      const existingBrand = await Brand.findOne({
        name,
        _id: { $ne: brandId },
      });
      if (existingBrand) {
        throw new Error('Tên thương hiệu đã tồn tại');
      }
      brand.name = name;
    }

    if (description !== undefined) brand.description = description;
    if (isActive !== undefined) brand.isActive = isActive;
    if (image !== undefined) brand.image = image;

    await brand.save();
    return brand;
  },

  updateBrandImage: async (brandId, imageUrl) => {
    const brand = await Brand.findById(brandId);
    if (!brand) {
      throw new Error('Thương hiệu không tồn tại');
    }
    
    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
      throw new Error('URL hình ảnh không hợp lệ');
    }
    
    brand.image = imageUrl.trim();
    await brand.save();
    return brand;
  },

  deleteBrand: async (brandId) => {
    const brand = await Brand.findById(brandId);
    if (!brand) {
      throw new Error('Thương hiệu không tồn tại');
    }

    const productsCount = await Product.countDocuments({ brand: brandId });
    
    if (productsCount > 0) {
      throw new Error(`Không thể xóa thương hiệu vì có ${productsCount} sản phẩm đang sử dụng`);
    }

    await brand.deleteOne();
    return { message: 'Xóa thương hiệu thành công' };
  },
};

module.exports = brandService;