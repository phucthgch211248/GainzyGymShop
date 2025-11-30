const brandValidator = {
  validateCreate: (data) => {
    const errors = [];

    // Kiểm tra name
    if (!data.name || data.name.trim() === '') {
      errors.push('Tên thương hiệu không được để trống');
    } else if (data.name.trim().length < 2) {
      errors.push('Tên thương hiệu phải có ít nhất 2 ký tự');
    } else if (data.name.trim().length > 100) {
      errors.push('Tên thương hiệu không được vượt quá 100 ký tự');
    }

    // Kiểm tra description
    if (data.description && data.description.length > 500) {
      errors.push('Mô tả không được vượt quá 500 ký tự');
    }

    // Kiểm tra image
    if (data.image) {
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(data.image)) {
        errors.push('URL hình ảnh không hợp lệ');
      }
    }

    if (errors.length > 0) {
      const error = new Error('Dữ liệu không hợp lệ');
      error.errors = errors;
      throw error;
    }

    return {
      name: data.name.trim(),
      description: data.description ? data.description.trim() : undefined,
      image: data.image ? data.image.trim() : undefined,
    };
  },

  // Validate khi cập nhật thương hiệu
  validateUpdate: (data) => {
    const errors = [];

    if (data.name !== undefined) {
      if (data.name.trim() === '') {
        errors.push('Tên thương hiệu không được để trống');
      } else if (data.name.trim().length < 2) {
        errors.push('Tên thương hiệu phải có ít nhất 2 ký tự');
      } else if (data.name.trim().length > 100) {
        errors.push('Tên thương hiệu không được vượt quá 100 ký tự');
      }
    }

    if (data.description !== undefined && data.description.length > 500) {
      errors.push('Mô tả không được vượt quá 500 ký tự');
    }

    if (data.image) {
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(data.image)) {
        errors.push('URL hình ảnh không hợp lệ');
      }
    }

    if (data.isActive !== undefined && typeof data.isActive !== 'boolean') {
      errors.push('Trạng thái phải là true hoặc false');
    }

    if (errors.length > 0) {
      const error = new Error('Dữ liệu không hợp lệ');
      error.errors = errors;
      throw error;
    }

    const cleanData = {};
    if (data.name !== undefined) cleanData.name = data.name.trim();
    if (data.description !== undefined) cleanData.description = data.description.trim();
    if (data.image !== undefined) cleanData.image = data.image.trim();
    if (data.isActive !== undefined) cleanData.isActive = data.isActive;

    return cleanData;
  },
};

module.exports = brandValidator;