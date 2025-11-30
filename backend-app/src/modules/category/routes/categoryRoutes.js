const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect, authorize } = require('../../../middleware/auth');
const { ROLES } = require('../../../constants');

router.get('/', categoryController.getAllCategories);
router.get('/slug/:slug', categoryController.getCategoryBySlug);
router.get('/:id', categoryController.getCategoryById);

router.post('/', protect, authorize(ROLES.ADMIN), categoryController.createCategory);
router.put('/:id', protect, authorize(ROLES.ADMIN), categoryController.updateCategory);
router.delete('/:id', protect, authorize(ROLES.ADMIN), categoryController.deleteCategory);

module.exports = router;