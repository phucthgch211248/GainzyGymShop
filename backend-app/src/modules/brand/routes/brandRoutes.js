const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const { protect, authorize } = require('../../../middleware/auth');
const { ROLES } = require('../../../constants');

router.get('/', brandController.getAllBrands);
router.get('/slug/:slug', brandController.getBrandBySlug);
router.get('/:id', brandController.getBrandById);

router.post('/', protect, authorize(ROLES.ADMIN), brandController.createBrand);
router.put('/:id', protect, authorize(ROLES.ADMIN), brandController.updateBrand);
router.put('/:id/image', protect, authorize(ROLES.ADMIN), brandController.updateBrandImage);
router.delete('/:id', protect, authorize(ROLES.ADMIN), brandController.deleteBrand);

module.exports = router;