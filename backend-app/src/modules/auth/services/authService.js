const User = require('../../user/models/User');
const generateToken = require('../../../utils/generateToken');
const { OAuth2Client } = require('google-auth-library');

const authService = {
  // dang ky
  register: async (userData) => {
    const { name, email, password } = userData;

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error('Email đã được sử dụng');
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token: generateToken(user._id),
    };
  },

  // dang nhap
  login: async (email, password) => {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new Error('Email hoặc mật khẩu không đúng');
    }

    if (!user.isActive) {
      throw new Error('Tài khoản đã bị khóa');
    }

    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      throw new Error('Email hoặc mật khẩu không đúng');
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token: generateToken(user._id),
    };
  },

  // get me
  getMe: async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Người dùng không tồn tại');
    }
    return user;
  },

  // Google login
  googleLogin: async (idToken) => {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    
    try {
      // Verify Google token
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      
      const payload = ticket.getPayload();
      const { sub: googleId, email, name, picture } = payload;

      // Tìm user theo Google ID hoặc email
      let user = await User.findOne({ 
        $or: [
          { googleId },
          { email }
        ]
      });

      if (user) {
        // Nếu user đã tồn tại nhưng chưa có googleId, cập nhật
        if (!user.googleId) {
          user.googleId = googleId;
          if (picture && !user.avatar) {
            user.avatar = picture;
          }
          await user.save();
        }
      } else {
        // Tạo user mới
        user = await User.create({
          name: name || email.split('@')[0],
          email,
          googleId,
          avatar: picture,
          password: undefined, // Không cần password cho Google user
        });
      }

      if (!user.isActive) {
        throw new Error('Tài khoản đã bị khóa');
      }

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token: generateToken(user._id),
      };
    } catch (error) {
      throw new Error('Xác thực Google thất bại: ' + error.message);
    }
  },
};

module.exports = authService;