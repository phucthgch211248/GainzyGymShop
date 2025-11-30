const Blog = require('../models/Blog');
const blogValidator = require('../validators/blogValidator');

const generateSlug = (title) => {
  const from = 'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ';
  const to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd';
  
  let slug = title.toLowerCase().trim();
  
  for (let i = 0; i < from.length; i++) {
    slug = slug.replace(new RegExp(from[i], 'g'), to[i]);
  }
  
  slug = slug
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  return slug;
};

const BlogService = {
  getAll: async (queryParams = {}) => {
    const { page, limit, search, status, tags, author, isFeatured, sortBy, order } = queryParams;
    
    const validatedOptions = blogValidator.validatePaginationParams({ page, limit });
    
    const pageNum = validatedOptions.page;
    const limitNum = validatedOptions.limit;
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    
    if (status && ['draft', 'published', 'archived'].includes(status)) {
      filter.status = status;
    }

    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { excerpt: { $regex: search.trim(), $options: 'i' } },
        { content: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : [tags];
      if (tagsArray.length > 0) {
        filter.tags = { $in: tagsArray };
      }
    }

    if (author) {
      blogValidator.validateObjectId(author);
      filter.author = author;
    }

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === 'true' || isFeatured === true;
    }

    const sortOptions = {};
    const sortField = sortBy || 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;
    sortOptions[sortField] = sortOrder;

    if (sortField !== 'createdAt') {
      sortOptions.createdAt = -1;
    }

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .populate('author', 'name email')
        .sort(sortOptions)
        .limit(limitNum)
        .skip(skip)
        .lean(),
      Blog.countDocuments(filter)
    ]);

    return {
      blogs,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1
      }
    };
  },

  getBySlug: async (slug) => {
    blogValidator.validateSlug(slug);

    const blog = await Blog.findOne({ slug, status: 'published' })
      .populate('author', 'name email')
      .populate('relatedPosts', 'title slug thumbnail excerpt')
      .lean();

    if (!blog) {
      throw new Error('Không tìm thấy bài viết');
    }

    return blog;
  },

  create: async (data) => {
    blogValidator.validateBlogData(data);

    const slug = generateSlug(data.title);
    
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      const timestamp = Date.now();
      data.slug = `${slug}-${timestamp}`;
    } else {
      data.slug = slug;
    }

    const post = new Blog(data);
    return await post.save();
  },

  update: async (id, data) => {
    blogValidator.validateObjectId(id);
    blogValidator.validateBlogData(data, true);

    if (data.title) {
      const newSlug = generateSlug(data.title);
      const existingBlog = await Blog.findOne({ slug: newSlug, _id: { $ne: id } });
      
      if (existingBlog) {
        const timestamp = Date.now();
        data.slug = `${newSlug}-${timestamp}`;
      } else {
        data.slug = newSlug;
      }
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { ...data, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('author', 'name email');

    if (!updatedBlog) {
      throw new Error('Không tìm thấy bài viết để cập nhật');
    }

    return updatedBlog;
  },

  delete: async (id) => {
    blogValidator.validateObjectId(id);

    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      throw new Error('Không tìm thấy bài viết để xóa');
    }

    return deletedBlog;
  },

  increaseViewCount: async (slug) => {
    blogValidator.validateSlug(slug);

    const blog = await Blog.findOneAndUpdate(
      { slug, status: 'published' },
      { $inc: { viewCount: 1 } },
      { new: true }
    ).lean();

    if (!blog) {
      throw new Error('Không tìm thấy bài viết');
    }

    return blog;
  },

  getPublished: async (queryParams = {}) => {
    return await BlogService.getAll({ ...queryParams, status: 'published' });
  },

  getFeatured: async (limitNum = 5) => {
    const blogs = await Blog.find({ status: 'published', isFeatured: true })
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .lean();

    return blogs;
  },

  getByTags: async (tags, queryParams = {}) => {
    if (!Array.isArray(tags) || tags.length === 0) {
      throw new Error('Tags phải là mảng và không được rỗng');
    }

    return await BlogService.getAll({ ...queryParams, tags, status: 'published' });
  }
};

module.exports = BlogService;