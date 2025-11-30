const BlogService = require('../services/blogService');

const BlogController = {
  getAll: async (req, res) => {
    try {
      const result = await BlogService.getAll(req.query);
      res.json({
        success: true,
        data: result.blogs,
        pagination: result.pagination
      });
    } catch (err) {
      res.status(500).json({ 
        success: false,
        message: err.message 
      });
    }
  },

  getBySlug: async (req, res) => {
    try {
      const { slug } = req.params;
      
      const post = await BlogService.getBySlug(slug);
      
      await BlogService.increaseViewCount(slug);
      
      res.json({
        success: true,
        data: post
      });
    } catch (err) {
      const statusCode = err.message === 'Không tìm thấy bài viết' ? 404 : 400;
      res.status(statusCode).json({ 
        success: false,
        message: err.message 
      });
    }
  },

  create: async (req, res) => {
    try {
      const newPost = await BlogService.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Tạo bài viết thành công',
        data: newPost
      });
    } catch (err) {
      res.status(400).json({ 
        success: false,
        message: err.message 
      });
    }
  },

  update: async (req, res) => {
    try {
      const updated = await BlogService.update(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Cập nhật bài viết thành công',
        data: updated
      });
    } catch (err) {
      const statusCode = err.message === 'Không tìm thấy bài viết để cập nhật' ? 404 : 400;
      res.status(statusCode).json({ 
        success: false,
        message: err.message 
      });
    }
  },

  delete: async (req, res) => {
    try {
      await BlogService.delete(req.params.id);
      res.json({ 
        success: true,
        message: "Đã xóa bài viết thành công" 
      });
    } catch (err) {
      const statusCode = err.message === 'Không tìm thấy bài viết để xóa' ? 404 : 500;
      res.status(statusCode).json({ 
        success: false,
        message: err.message 
      });
    }
  },
};

module.exports = BlogController;