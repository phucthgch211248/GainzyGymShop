const mongoose = require('mongoose');

const validateProductCreate = (req, res, next) => {
  const { name, description, price, category, stock, brand, effective } = req.body;
  const errors = [];

  if (!name || name.trim() === '') {
    errors.push('Tên sản phẩm không được để trống');
  }

  if (!description || description.trim() === '') {
    errors.push('Mô tả sản phẩm không được để trống');
  }

  if (!price || price <= 0) {
    errors.push('Giá sản phẩm phải lớn hơn 0');
  }

  if (!category || !mongoose.Types.ObjectId.isValid(category)) {
    errors.push('Danh mục không hợp lệ');
  }

  if (!brand || !mongoose.Types.ObjectId.isValid(brand)) {
    errors.push('Thương hiệu không hợp lệ');
  }

  if (stock === undefined || stock < 0) {
    errors.push('Số lượng không hợp lệ');
  }

  if (effective !== undefined) {
    if (!Array.isArray(effective)) {
      errors.push('Trường effective phải là mảng');
    } else {
      const invalidItems = effective.some(
        (item) => typeof item !== 'object' || item === null || Array.isArray(item)
      );
      if (invalidItems) {
        errors.push('Mỗi phần tử trong effective phải là object hợp lệ');
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors,
    });
  }

  next();
};

const validateProductUpdate = (req, res, next) => {
  const { name, description, price, category, stock, brand, effective } = req.body;
  const errors = [];

  if (name !== undefined && name.trim() === '') {
    errors.push('Tên sản phẩm không được để trống');
  }

  if (description !== undefined && description.trim() === '') {
    errors.push('Mô tả sản phẩm không được để trống');
  }

  if (price !== undefined && price <= 0) {
    errors.push('Giá sản phẩm phải lớn hơn 0');
  }

  if (category !== undefined && !mongoose.Types.ObjectId.isValid(category)) {
    errors.push('Danh mục không hợp lệ');
  }

  if (brand !== undefined && !mongoose.Types.ObjectId.isValid(brand)) {
    errors.push('Thương hiệu không hợp lệ');
  }

  if (stock !== undefined && stock < 0) {
    errors.push('Số lượng không hợp lệ');
  }

  if (effective !== undefined) {
    if (!Array.isArray(effective)) {
      errors.push('Trường effective phải là mảng');
    } else {
      const invalidItems = effective.some(
        (item) => typeof item !== 'object' || item === null || Array.isArray(item)
      );
      if (invalidItems) {
        errors.push('Mỗi phần tử trong effective phải là object hợp lệ');
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors,
    });
  }

  next();
};

module.exports = { 
  validateProductCreate, 
  validateProductUpdate 
};