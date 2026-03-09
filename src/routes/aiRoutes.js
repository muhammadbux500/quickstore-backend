const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

// Validation rules
const generateStoreValidation = [
  body('prompt')
    .notEmpty().withMessage('Prompt is required')
    .isLength({ min: 10, max: 500 }).withMessage('Prompt must be between 10 and 500 characters'),
  body('industry')
    .optional()
    .isLength({ max: 50 }).withMessage('Industry cannot exceed 50 characters'),
  body('style')
    .optional()
    .isLength({ max: 50 }).withMessage('Style cannot exceed 50 characters'),
  body('name')
    .optional()
    .isLength({ max: 100 }).withMessage('Store name cannot exceed 100 characters')
];

const generateDescriptionValidation = [
  body('name')
    .notEmpty().withMessage('Product name is required')
    .isLength({ max: 100 }).withMessage('Product name cannot exceed 100 characters'),
  body('category')
    .optional()
    .isLength({ max: 50 }).withMessage('Category cannot exceed 50 characters'),
  body('features')
    .optional()
    .isLength({ max: 500 }).withMessage('Features cannot exceed 500 characters'),
  body('keywords')
    .optional()
    .isLength({ max: 200 }).withMessage('Keywords cannot exceed 200 characters'),
  body('tone')
    .optional()
    .isIn(['professional', 'casual', 'luxury', 'friendly', 'technical'])
    .withMessage('Invalid tone')
];

const generateSEOTagsValidation = [
  body('content')
    .notEmpty().withMessage('Content is required')
    .isLength({ max: 2000 }).withMessage('Content cannot exceed 2000 characters'),
  body('type')
    .optional()
    .isIn(['product', 'store', 'blog', 'page']).withMessage('Invalid content type'),
  body('keywords')
    .optional()
    .isLength({ max: 200 }).withMessage('Keywords cannot exceed 200 characters')
];

const generateImageValidation = [
  body('prompt')
    .notEmpty().withMessage('Prompt is required')
    .isLength({ min: 5, max: 500 }).withMessage('Prompt must be between 5 and 500 characters'),
  body('style')
    .optional()
    .isLength({ max: 100 }).withMessage('Style cannot exceed 100 characters')
];

const chatValidation = [
  body('message')
    .notEmpty().withMessage('Message is required')
    .isLength({ max: 1000 }).withMessage('Message cannot exceed 1000 characters'),
  body('context')
    .optional()
    .isObject().withMessage('Context must be an object')
];

const storeIdValidation = [
  param('storeId').isMongoId().withMessage('Invalid store ID')
];

// All routes require authentication
router.use(protect);

// AI generation routes
router.post('/generate-store', generateStoreValidation, aiController.generateStore);
router.post('/generate-description', generateDescriptionValidation, aiController.generateProductDescription);
router.post('/generate-seo', generateSEOTagsValidation, aiController.generateSEOTags);
router.post('/generate-image', generateImageValidation, aiController.generateImage);

// Store analysis
router.post('/analyze/:storeId', storeIdValidation, aiController.analyzeStore);

// AI chat assistant
router.post('/chat', chatValidation, aiController.chatWithAI);

module.exports = router;