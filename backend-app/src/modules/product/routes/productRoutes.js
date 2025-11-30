const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, authorize } = require('../../../middleware/auth');
const { ROLES } = require('../../../constants');

// Public routes
router.get('/featured', productController.getFeaturedProducts);
router.get('/category/:categoryId', productController.getProductsByCategory);
router.get('/brand/:brandId', productController.getProductsByBrand);
router.get('/effect/:effectName', productController.getProductsByEffect);
router.get('/slug/:slug', productController.getProductBySlug);
router.get('/:id/related', productController.getRelatedProducts);
router.get('/:id', productController.getProductById);
router.get('/', productController.getAllProducts);

// Admin routes
router.post('/', protect, authorize(ROLES.ADMIN), productController.createProduct);
router.put('/:id', protect, authorize(ROLES.ADMIN), productController.updateProduct);
router.delete('/:id', protect, authorize(ROLES.ADMIN), productController.deleteProduct);

module.exports = router;