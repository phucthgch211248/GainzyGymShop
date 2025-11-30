const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'gym-supplements/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  },
});

const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'gym-supplements/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill' }],
  },
});

const categoryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'gym-supplements/categories',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 600, height: 600, crop: 'limit' }],
  },
});

const uploadProduct = multer({ storage: productStorage });
const uploadAvatar = multer({ storage: avatarStorage });
const uploadCategory = multer({ storage: categoryStorage });

module.exports = {
  uploadProduct,
  uploadAvatar,
  uploadCategory,
};