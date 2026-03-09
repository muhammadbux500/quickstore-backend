const express = require('express');
const router = express.Router({ mergeParams: true });
const { body, param, query } = require('express-validator');
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

// Validation rules
const createOrderValidation = [
  body('items')
    .isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.productId')
    .isMongoId().withMessage('Invalid product ID'),
  body('items.*.quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('customer.name')
    .notEmpty().withMessage('Customer name is required'),
  body('customer.email')
    .isEmail().withMessage('Please enter a valid email'),
  body('shippingAddress.street')
    .notEmpty().withMessage('Street address is required'),
  body('shippingAddress.city')
    .notEmpty().withMessage('City is required'),
  body('shippingAddress.country')
    .notEmpty().withMessage('Country is required'),
  body('shippingAddress.zipCode')
    .notEmpty().withMessage('Zip code is required'),
  body('paymentMethod')
    .isIn(['stripe', 'paypal', 'bank_transfer', 'cod']).withMessage('Invalid payment method')
];

const updateStatusValidation = [
  body('status')
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])
    .withMessage('Invalid status'),
  body('trackingNumber')
    .optional()
    .isLength({ min: 3 }).withMessage('Tracking number must be at least 3 characters'),
  body('carrier')
    .optional()
    .isLength({ min: 2 }).withMessage('Carrier name must be at least 2 characters')
];

const updatePaymentValidation = [
  body('paymentStatus')
    .isIn(['pending', 'paid', 'failed', 'refunded', 'partially_refunded'])
    .withMessage('Invalid payment status'),
  body('transactionId')
    .optional()
    .isLength({ min: 3 }).withMessage('Transaction ID must be at least 3 characters')
];

const refundValidation = [
  body('amount')
    .optional()
    .isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('reason')
    .optional()
    .isLength({ max: 500 }).withMessage('Reason cannot exceed 500 characters')
];

const storeIdValidation = [
  param('storeId').isMongoId().withMessage('Invalid store ID')
];

const orderIdValidation = [
  param('orderId').isMongoId().withMessage('Invalid order ID')
];

// Public route for creating orders
router.post('/', [...storeIdValidation, ...createOrderValidation], orderController.createOrder);

// Protected routes
router.use(protect);

// Order list and details
router.get('/', storeIdValidation, orderController.getOrders);
router.get('/:orderId', [...storeIdValidation, ...orderIdValidation], orderController.getOrder);

// Status updates
router.put(
  '/:orderId/status',
  [...storeIdValidation, ...orderIdValidation, ...updateStatusValidation],
  orderController.updateOrderStatus
);
router.put(
  '/:orderId/payment',
  [...storeIdValidation, ...orderIdValidation, ...updatePaymentValidation],
  orderController.updatePaymentStatus
);

// Invoice and refunds
router.get('/:orderId/invoice', [...storeIdValidation, ...orderIdValidation], orderController.getOrderInvoice);
router.post('/:orderId/refund', [...storeIdValidation, ...orderIdValidation, ...refundValidation], orderController.createRefund);

module.exports = router;