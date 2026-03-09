const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator');
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin'));

// Validation rules
const userIdValidation = [
  param('id').isMongoId().withMessage('Invalid user ID')
];

const storeIdValidation = [
  param('id').isMongoId().withMessage('Invalid store ID')
];

const updateUserValidation = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail().withMessage('Please enter a valid email'),
  body('role')
    .optional()
    .isIn(['customer', 'store_owner', 'affiliate', 'admin']).withMessage('Invalid role'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'suspended', 'pending']).withMessage('Invalid status'),
  body('plan')
    .optional()
    .isIn(['starter', 'professional', 'enterprise', 'affiliate', 'custom']).withMessage('Invalid plan'),
  body('permissions')
    .optional()
    .isArray().withMessage('Permissions must be an array')
];

const updateStoreStatusValidation = [
  body('status')
    .isIn(['pending', 'active', 'suspended', 'closed']).withMessage('Invalid status'),
  body('reason')
    .optional()
    .isLength({ max: 500 }).withMessage('Reason cannot exceed 500 characters')
];

// User management routes
router.get('/users', adminController.getUsers);
router.get('/users/:id', userIdValidation, adminController.getUser);
router.put('/users/:id', [...userIdValidation, ...updateUserValidation], adminController.updateUser);
router.delete('/users/:id', userIdValidation, adminController.deleteUser);

// Store management routes
router.get('/stores', adminController.getStores);
router.put('/stores/:id/status', [...storeIdValidation, ...updateStoreStatusValidation], adminController.updateStoreStatus);

// Analytics routes
router.get('/analytics', adminController.getAnalytics);

// System health route
router.get('/health', adminController.getSystemHealth);

module.exports = router;