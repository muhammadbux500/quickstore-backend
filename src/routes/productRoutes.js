const express = require('express');
const router = express.Router({ mergeParams: true });
const { body, param, query } = require('express-validator');
const productController = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Validation rules
const createProductValidation = [
  body('name')
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Product name must be between 3 and 100 characters'),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('comparePrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Compare price must be a positive number'),
  body('cost')
    .optional()
    .isFloat({ min: 0 }).withMessage('Cost must be a positive number'),
  body('sku')
    .optional()
    .isLength({ min: 3, max: 20 }).withMessage('SKU must be between 3 and 20 characters')
    .matches(/^[A-Z0-9-]+$/).withMessage('SKU can only contain uppercase letters, numbers, and hyphens'),
  body('quantity')
    .optional()
    .isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  body('category')
    .optional()
    .isMongoId().withMessage('Invalid category ID'),
  body('status')
    .optional()
    .isIn(['draft', 'active', 'archived', 'out_of_stock']).withMessage('Invalid status')
];

const updateProductValidation = [
  body('name')
    .optional()
    .isLength({ min: 3, max: 100 }).withMessage('Product name must be between 3 and 100 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('status')
    .optional()
    .isIn(['draft', 'active', 'archived', 'out_of_stock']).withMessage('Invalid status')
];

const productIdValidation = [
  param('productId').isMongoId().withMessage('Invalid product ID')
];

const storeIdValidation = [
  param('storeId').isMongoId().withMessage('Invalid store ID')
];

// All routes require authentication
router.use(protect);

// Product CRUD routes
router.post('/', [...storeIdValidation, ...createProductValidation], productController.createProduct);
router.get('/', storeIdValidation, productController.getProducts);
router.get('/:productId', [...storeIdValidation, ...productIdValidation], productController.getProduct);
router.put('/:productId', [...storeIdValidation, ...productIdValidation, ...updateProductValidation], productController.updateProduct);
router.delete('/:productId', [...storeIdValidation, ...productIdValidation], productController.deleteProduct);

// Bulk operations
router.post('/bulk', storeIdValidation, productController.bulkUpdateProducts);

// Image routes
router.post(
  '/:productId/images',
  [...storeIdValidation, ...productIdValidation],
  upload.array('images', 10),
  productController.uploadProductImages
);
router.delete(
  '/:productId/images/:imageId',
  [...storeIdValidation, ...productIdValidation],
  productController.deleteProductImage
);
router.put(
  '/:productId/images/:imageId/primary',
  [...storeIdValidation, ...productIdValidation],
  productController.setPrimaryImage
);

module.exports = router;