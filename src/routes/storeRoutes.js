const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const storeController = require('../controllers/storeController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Validation rules
const createStoreValidation = [
  body('name')
    .notEmpty().withMessage('Store name is required')
    .isLength({ min: 3, max: 50 }).withMessage('Store name must be between 3 and 50 characters'),
  body('url')
    .notEmpty().withMessage('Store URL is required')
    .isLength({ min: 3, max: 30 }).withMessage('Store URL must be between 3 and 30 characters')
    .matches(/^[a-z0-9-]+$/).withMessage('Store URL can only contain lowercase letters, numbers, and hyphens'),
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('category')
    .optional()
    .isIn(['fashion', 'electronics', 'home', 'beauty', 'food', 'sports', 'books', 'jewelry', 'pets', 'other'])
    .withMessage('Invalid category')
];

const updateStoreValidation = [
  body('name')
    .optional()
    .isLength({ min: 3, max: 50 }).withMessage('Store name must be between 3 and 50 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('category')
    .optional()
    .isIn(['fashion', 'electronics', 'home', 'beauty', 'food', 'sports', 'books', 'jewelry', 'pets', 'other'])
    .withMessage('Invalid category')
];

const storeIdValidation = [
  param('id').isMongoId().withMessage('Invalid store ID')
];

// All routes require authentication
router.use(protect);

// Store routes
router.post('/', createStoreValidation, storeController.createStore);
router.get('/', storeController.getStores);
router.get('/check-url/:url', storeController.checkStoreUrl);
router.get('/:id', storeIdValidation, storeController.getStore);
router.put('/:id', [...storeIdValidation, ...updateStoreValidation], storeController.updateStore);
router.delete('/:id', storeIdValidation, storeController.deleteStore);

// Store settings routes
router.get('/:id/settings', storeIdValidation, storeController.getStoreSettings);
router.put('/:id/settings', storeIdValidation, storeController.updateStoreSettings);

// Store analytics routes
router.get('/:id/analytics', storeIdValidation, storeController.getStoreAnalytics);

// Store upload routes
router.post('/:id/logo', storeIdValidation, upload.single('logo'), storeController.uploadLogo);

module.exports = router;