const Product = require('../models/Product');
const Category = require('../../category/models/Category');
const Brand = require('../../brand/models/Brand');
const mongoose = require('mongoose');
const slugify = require('slugify');

const generateUniqueSlug = async (name, excludeId = null) => {
  let slug = slugify(name, { lower: true, strict: true });
  
  const slugRegEx = new RegExp(`^${slug}(-[0-9]+)?$`, 'i');
  const query = { slug: slugRegEx };
  
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  
  const existingSlugs = await Product.find(query).select('slug');
  
  if (existingSlugs.length > 0) {
    slug = `${slug}-${existingSlugs.length}`;
  }
  
  return slug;
};

const productService = {
  getAllProducts: async (queryParams) => {
    const {
      page = 1,
      limit = 12,
      search = '',
      category,
      brand,
      effect, 
      minPrice,
      maxPrice,
      sort = '-createdAt',
      isActive,
      isFeatured,
    } = queryParams;

    const query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      // Kiểm tra xem category có phải là ObjectId hợp lệ không
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        // Nếu không phải ObjectId, tìm category theo slug hoặc tên
        const foundCategory = await Category.findOne({
          $or: [
            { slug: category },
            { name: { $regex: category, $options: 'i' } }
          ]
        });
        if (foundCategory) {
          query.category = foundCategory._id;
        } else {
          // Nếu không tìm thấy category, trả về mảng rỗng
          return {
            products: [],
            totalPages: 0,
            currentPage: Number(page),
            total: 0,
          };
        }
      }
    }

    if (brand) {
      // Kiểm tra xem brand có phải là ObjectId hợp lệ không
      if (mongoose.Types.ObjectId.isValid(brand)) {
        query.brand = brand;
      } else {
        // Nếu không phải ObjectId, tìm brand theo slug hoặc tên
        const foundBrand = await Brand.findOne({
          $or: [
            { slug: brand },
            { name: { $regex: brand, $options: 'i' } }
          ]
        });
        if (foundBrand) {
          query.brand = foundBrand._id;
        } else {
          // Nếu không tìm thấy brand, trả về mảng rỗng
          return {
            products: [],
            totalPages: 0,
            currentPage: Number(page),
            total: 0,
          };
        }
      }
    }

    if (effect) {
      query['effective.label'] = { $regex: effect, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured === 'true';
    }

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('brand', 'name slug') 
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sort);

    const count = await Product.countDocuments(query);

    return {
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      total: count,
    };
  },

  getProductsByCategory: async (categoryId, queryParams = {}) => {
    const { page = 1, limit = 12, sort = '-createdAt' } = queryParams;

    const products = await Product.find({ 
      category: categoryId, 
      isActive: true 
    })
      .populate('category', 'name slug')
      .populate('brand', 'name slug')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sort);

    const count = await Product.countDocuments({ 
      category: categoryId, 
      isActive: true 
    });

    return {
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      total: count,
    };
  },

  getProductsByBrand: async (brandId, queryParams = {}) => {
    const { page = 1, limit = 12, sort = '-createdAt' } = queryParams;

    const products = await Product.find({ 
      brand: brandId, 
      isActive: true 
    })
      .populate('category', 'name slug')
      .populate('brand', 'name slug')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sort);

    const count = await Product.countDocuments({ 
      brand: brandId, 
      isActive: true 
    });

    return {
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      total: count,
    };
  },

  getProductsByEffect: async (effectName, queryParams = {}) => {
    const { page = 1, limit = 12, sort = '-createdAt' } = queryParams;

    const products = await Product.find({ 
      'effective.label': { $regex: effectName, $options: 'i' },
      isActive: true 
    })
      .populate('category', 'name slug')
      .populate('brand', 'name slug')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sort);

    const count = await Product.countDocuments({ 
      'effective.label': { $regex: effectName, $options: 'i' },
      isActive: true 
    });

    return {
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      total: count,
    };
  },

  getProductById: async (productId) => {
    const product = await Product.findById(productId)
      .populate('category', 'name slug')
      .populate('brand', 'name slug');
    if (!product) {
      throw new Error('Sản phẩm không tồn tại');
    }
    return product;
  },

  getProductBySlug: async (slug) => {
    const product = await Product.findOne({ slug })
      .populate('category', 'name slug')
      .populate('brand', 'name slug');
    if (!product) {
      throw new Error('Sản phẩm không tồn tại');
    }
    return product;
  },

  getFeaturedProducts: async (limit = 8) => {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate('category', 'name slug')
      .populate('brand', 'name slug')
      .limit(limit)
      .sort('-createdAt');

    return products;
  },

  getRelatedProducts: async (productId, categoryId, limit = 4) => {
    const products = await Product.find({
      _id: { $ne: productId },
      category: categoryId,
      isActive: true,
    })
      .populate('category', 'name slug')
      .populate('brand', 'name slug')
      .limit(limit)
      .sort('-rating');

    return products;
  },

  createProduct: async (productData) => {
    if (!productData.slug && productData.name) {
      productData.slug = await generateUniqueSlug(productData.name);
    } else if (productData.slug) {
      const existingProduct = await Product.findOne({ slug: productData.slug });
      if (existingProduct) {
        productData.slug = await generateUniqueSlug(productData.name || productData.slug);
      }
    }

    const product = await Product.create(productData);
    
    await Product.populate(product, [
      { path: 'category', select: 'name slug' },
      { path: 'brand', select: 'name slug' }
    ]);
    
    return product;
  },

  updateProduct: async (productId, updateData) => {
    if (updateData.name) {
      updateData.slug = await generateUniqueSlug(updateData.name, productId);
    } else if (updateData.slug) {
      const existingProduct = await Product.findOne({ 
        slug: updateData.slug,
        _id: { $ne: productId }
      });
      if (existingProduct) {
        updateData.slug = await generateUniqueSlug(updateData.slug, productId);
      }
    }

    const product = await Product.findByIdAndUpdate(productId, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('category', 'name slug')
      .populate('brand', 'name slug');

    if (!product) {
      throw new Error('Sản phẩm không tồn tại');
    }

    return product;
  },

  deleteProduct: async (productId) => {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Sản phẩm không tồn tại');
    }

    await product.deleteOne();
    return { message: 'Xóa sản phẩm thành công' };
  },

  updateStock: async (productId, quantity) => {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Sản phẩm không tồn tại');
    }

    if (product.stock < quantity) {
      throw new Error('Không đủ hàng trong kho');
    }

    product.stock -= quantity;
    product.sold += quantity;
    await product.save();

    return product;
  },
};

module.exports = productService;