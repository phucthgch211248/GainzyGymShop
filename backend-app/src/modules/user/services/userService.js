const User = require('../models/User');

const userService = {
  getProfile: async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Người dùng không tồn tại');
    }
    return user;
  },

  updateProfile: async (userId, updateData) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Người dùng không tồn tại');
    }

    const { name, phone, address, avatar } = updateData;

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (avatar) user.avatar = avatar; 

    await user.save();
    return user;
  },

  changePassword: async (userId, oldPassword, newPassword) => {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new Error('Người dùng không tồn tại');
    }

    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      throw new Error('Mật khẩu cũ không đúng');
    }

    user.password = newPassword;
    await user.save();
    return { message: 'Đổi mật khẩu thành công' };
  },

  getAllUsers: async (queryParams) => {
    const { page = 1, limit = 10, search = '', role } = queryParams;
    
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await User.countDocuments(query);

    return {
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    };
  },

  updateUser: async (userId, updateData) => {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new Error('Người dùng không tồn tại');
    }

    return user;
  },

  deleteUser: async (userId) => {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new Error('Người dùng không tồn tại');
    }
    return { message: 'Xóa người dùng thành công' };
  },
};

module.exports = userService;