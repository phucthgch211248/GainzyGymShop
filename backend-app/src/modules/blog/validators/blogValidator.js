const validatePaginationParams = (options) => {
  const page = parseInt(options.page) || 1;
  const limit = parseInt(options.limit) || 20;

  if (page < 1) {
    throw new Error('Số trang phải lớn hơn 0');
  }

  if (limit < 1 || limit > 100) {
    throw new Error('Giới hạn phải từ 1 đến 100');
  }

  return { page, limit };
};

const validateBlogData = (data, isUpdate = false) => {
  const errors = [];

  if (!isUpdate || data.title !== undefined) {
    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
      errors.push('Tiêu đề không được để trống');
    }
    if (data.title && data.title.length > 200) {
      errors.push('Tiêu đề không được vượt quá 200 ký tự');
    }
  }

  if (!isUpdate || data.content !== undefined) {
    if (!data.content || typeof data.content !== 'string' || data.content.trim().length === 0) {
      errors.push('Nội dung không được để trống');
    }
    if (data.content && data.content.length < 50) {
      errors.push('Nội dung phải có ít nhất 50 ký tự');
    }
  }

  if (data.excerpt && data.excerpt.length > 300) {
    errors.push('Mô tả ngắn không được vượt quá 300 ký tự');
  }

  if (data.tags) {
    if (!Array.isArray(data.tags)) {
      errors.push('Tags phải là một mảng');
    } else if (data.tags.length > 10) {
      errors.push('Không được vượt quá 10 tags');
    } else if (data.tags.some(tag => typeof tag !== 'string' || tag.trim().length === 0)) {
      errors.push('Mỗi tag phải là chuỗi không rỗng');
    }
  }

  if (data.status && !['draft', 'published', 'archived'].includes(data.status)) {
    errors.push('Trạng thái không hợp lệ');
  }

  if (data.thumbnail && typeof data.thumbnail !== 'string') {
    errors.push('Thumbnail phải là chuỗi URL');
  }

  if (data.isFeatured !== undefined && typeof data.isFeatured !== 'boolean') {
    errors.push('isFeatured phải là boolean');
  }

  if (data.author) {
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(data.author)) {
      errors.push('Author ID không hợp lệ');
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }

  return true;
};

const validateSlug = (slug) => {
  if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
    throw new Error('Slug không hợp lệ');
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error('Slug chỉ được chứa chữ thường, số và dấu gạch ngang');
  }

  return true;
};

const validateObjectId = (id) => {
  const mongoose = require('mongoose');
  
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('ID không hợp lệ');
  }

  return true;
};

module.exports = {
  validatePaginationParams,
  validateBlogData,
  validateSlug,
  validateObjectId
};