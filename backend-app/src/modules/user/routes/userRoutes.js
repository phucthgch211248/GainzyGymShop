const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../../../middleware/auth');
const { ROLES } = require('../../../constants');

router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);
router.put('/change-password', protect, userController.changePassword);

// Admin routes
router.get('/', protect, authorize(ROLES.ADMIN), userController.getAllUsers);
router.get('/:id', protect, authorize(ROLES.ADMIN), userController.getUserById);
router.put('/:id', protect, authorize(ROLES.ADMIN), userController.updateUser);
router.delete('/:id', protect, authorize(ROLES.ADMIN), userController.deleteUser);

module.exports = router;