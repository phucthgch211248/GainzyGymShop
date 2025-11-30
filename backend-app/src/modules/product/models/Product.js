const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên sản phẩm'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Vui lòng nhập mô tả sản phẩm'],
    },
    price: {
      type: Number,
      required: [true, 'Vui lòng nhập giá sản phẩm'],
      min: [0, 'Giá không thể âm'],
    },
    originalPrice: {
      type: Number,
      min: [0, 'Giá không thể âm'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Giảm giá không thể âm'],
      max: [100, 'Giảm giá không thể lớn hơn 100%'],
    },
    images: [
      {
        type: String,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Vui lòng chọn danh mục'],
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand', 
      required: [true, 'Vui lòng chọn thương hiệu'],
    },
    effective: [
      {
        type: Object, 
        default: {},
      },
    ],
    stock: {
      type: Number,
      required: [true, 'Vui lòng nhập số lượng'],
      min: [0, 'Số lượng không thể âm'],
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating tối thiểu là 0'],
      max: [5, 'Rating tối đa là 5'],
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    specifications: {
      weight: String,
      servingSize: String,
      servingsPerContainer: String,
      flavor: String,
      ingredients: String,
      usage: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

productSchema.virtual('finalPrice').get(function () {
  if (this.discount > 0) {
    return this.price * (1 - this.discount / 100);
  }
  return this.price;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
