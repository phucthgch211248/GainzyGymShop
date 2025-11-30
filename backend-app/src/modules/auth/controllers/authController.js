const authService = require('../services/authService');

const authController = {
  // @desc    Đăng ký user mới
  // @route   POST /api/auth/register
  // @access  Public
  register: async (req, res, next) => {
    try {
      const user = await authService.register(req.body);
      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Đăng nhập user
  // @route   POST /api/auth/login
  // @access  Public
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập email và mật khẩu',
        });
      }

      const user = await authService.login(email, password);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  },

  // @desc    Lấy thông tin user hiện tại
  // @route   GET /api/auth/me
  // @access  Private
  getMe: async (req, res, next) => {
    try {
      const user = await authService.getMe(req.user._id);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Đăng xuất
  // @route   POST /api/auth/logout
  // @access  Private
  logout: async (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Đăng xuất thành công',
    });
  },

  // @desc    Đăng nhập bằng Google
  // @route   POST /api/auth/google
  // @access  Public
  googleLogin: async (req, res, next) => {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp Google ID token',
        });
      }

      const user = await authService.googleLogin(idToken);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  },
};

module.exports = authController;