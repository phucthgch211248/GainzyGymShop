// src/modules/user/controllers/userController.js
const userService = require('../services/userService');

const userController = {
  // @desc    Lấy thông tin profile
  // @route   GET /api/users/profile
  // @access  Private
  getProfile: async (req, res, next) => {
    try {
      const user = await userService.getProfile(req.user._id);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Cập nhật profile (bao gồm avatar URL từ FE)
  // @route   PUT /api/users/profile
  // @access  Private
  updateProfile: async (req, res, next) => {
    try {
      const user = await userService.updateProfile(req.user._id, req.body);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Đổi mật khẩu
  // @route   PUT /api/users/change-password
  // @access  Private
  changePassword: async (req, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập đầy đủ thông tin',
        });
      }

      const result = await userService.changePassword(
        req.user._id,
        oldPassword,
        newPassword
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // @desc    Lấy tất cả users (Admin)
  // @route   GET /api/users
  // @access  Private/Admin
  getAllUsers: async (req, res, next) => {
    try {
      const result = await userService.getAllUsers(req.query);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Lấy user theo ID (Admin)
  // @route   GET /api/users/:id
  // @access  Private/Admin
  getUserById: async (req, res, next) => {
    try {
      const user = await userService.getProfile(req.params.id);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Cập nhật user (Admin)
  // @route   PUT /api/users/:id
  // @access  Private/Admin
  updateUser: async (req, res, next) => {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Xóa user (Admin)
  // @route   DELETE /api/users/:id
  // @access  Private/Admin
  deleteUser: async (req, res, next) => {
    try {
      const result = await userService.deleteUser(req.params.id);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController; 