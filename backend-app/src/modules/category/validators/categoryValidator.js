const categoryValidator = {
  validateCreate: (data) => {
    const errors = [];

    // Kiểm tra name
    if (!data.name || data.name.trim() === '') {
      errors.push('Tên danh mục không được để trống');
    } else if (data.name.trim().length < 2) {
      errors.push('Tên danh mục phải có ít nhất 2 ký tự');
    } else if (data.name.trim().length > 100) {
      errors.push('Tên danh mục không được vượt quá 100 ký tự');
    }

    // Kiểm tra description
    if (data.description && data.description.length > 500) {
      errors.push('Mô tả không được vượt quá 500 ký tự');
    }

    // Regex URL hỗ trợ Cloudinary và các URL có query params
    const urlPattern = /^https?:\/\/.+$/i;

    // Kiểm tra image (ảnh chính)
    if (data.image) {
      if (!urlPattern.test(data.image)) {
        errors.push('URL hình ảnh không hợp lệ');
      }
    }

    // Kiểm tra images (nhiều ảnh)
    let images;
    if (data.images !== undefined) {
      if (!Array.isArray(data.images)) {
        errors.push('Danh sách hình ảnh phải là một mảng');
      } else {
        images = data.images
          .filter((url) => typeof url === 'string' && url.trim() !== '')
          .map((url) => url.trim());

        if (images.length === 0) {
          images = undefined;
        } else {
          const invalidUrl = images.find((url) => !urlPattern.test(url));
          if (invalidUrl) {
            errors.push('Một hoặc nhiều URL hình ảnh trong danh sách không hợp lệ');
          }
        }
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
      ...(images ? { images } : {}),
    };
  },

  // Validate khi cập nhật danh mục
  validateUpdate: (data) => {
    const errors = [];

    if (data.name !== undefined) {
      if (data.name.trim() === '') {
        errors.push('Tên danh mục không được để trống');
      } else if (data.name.trim().length < 2) {
        errors.push('Tên danh mục phải có ít nhất 2 ký tự');
      } else if (data.name.trim().length > 100) {
        errors.push('Tên danh mục không được vượt quá 100 ký tự');
      }
    }

    if (data.description !== undefined && data.description.length > 500) {
      errors.push('Mô tả không được vượt quá 500 ký tự');
    }

    // Regex URL hỗ trợ Cloudinary và các URL có query params
    const urlPattern = /^https?:\/\/.+$/i;

    if (data.image) {
      if (!urlPattern.test(data.image)) {
        errors.push('URL hình ảnh không hợp lệ');
      }
    }

    // Kiểm tra images khi cập nhật
    let images;
    if (data.images !== undefined) {
      if (!Array.isArray(data.images)) {
        errors.push('Danh sách hình ảnh phải là một mảng');
      } else {
        images = data.images
          .filter((url) => typeof url === 'string' && url.trim() !== '')
          .map((url) => url.trim());

        if (images.length === 0) {
          images = [];
        } else {
          const invalidUrl = images.find((url) => !urlPattern.test(url));
          if (invalidUrl) {
            errors.push('Một hoặc nhiều URL hình ảnh trong danh sách không hợp lệ');
          }
        }
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
    if (images !== undefined) cleanData.images = images;
    if (data.isActive !== undefined) cleanData.isActive = data.isActive;

    return cleanData;
  },
};

module.exports = categoryValidator;