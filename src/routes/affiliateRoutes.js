const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const affiliateController = require('../controllers/affiliateController');
const { protect, authorize } = require('../middleware/auth');

// Validation rules
const registerValidation = [
  body('website')
    .optional()
    .isURL().withMessage('Please enter a valid website URL'),
  body('niche')
    .optional()
    .isLength({ max: 100 }).withMessage('Niche cannot exceed 100 characters'),
  body('promoMethods')
    .optional()
    .isArray().withMessage('Promo methods must be an array'),
  body('taxInfo.taxId')
    .optional()
    .isLength({ min: 5, max: 50 }).withMessage('Tax ID must be between 5 and 50 characters'),
  body('paymentInfo.method')
    .optional()
    .isIn(['paypal', 'bank_transfer', 'stripe']).withMessage('Invalid payment method'),
  body('paymentInfo.paypalEmail')
    .optional()
    .isEmail().withMessage('Please enter a valid PayPal email')
];

const payoutValidation = [
  body('amount')
    .isFloat({ min: 1 }).withMessage('Amount must be at least 1'),
  body('paymentMethod')
    .isIn(['paypal', 'bank_transfer', 'stripe']).withMessage('Invalid payment method')
];

const linkValidation = [
  body('name')
    .notEmpty().withMessage('Link name is required')
    .isLength({ min: 3, max: 50 }).withMessage('Link name must be between 3 and 50 characters'),
  body('destination')
    .notEmpty().withMessage('Destination is required')
    .isLength({ min: 1, max: 200 }).withMessage('Destination cannot exceed 200 characters'),
  body('utmParams')
    .optional()
    .isObject().withMessage('UTM parameters must be an object')
];

// Public route for tracking
router.get('/track/:code', affiliateController.trackClick);
router.post('/track/conversion', affiliateController.trackConversion);

// Protected routes (affiliate only)
router.use(protect);
router.use(authorize('affiliate', 'admin'));

// Affiliate registration and dashboard
router.post('/register', registerValidation, affiliateController.registerAffiliate);
router.get('/dashboard', affiliateController.getDashboard);
router.get('/commissions', affiliateController.getCommissions);
router.get('/stats', affiliateController.getStats);

// Referral links
router.get('/links', affiliateController.getReferralLinks);
router.post('/links', linkValidation, affiliateController.createReferralLink);

// Payouts
router.post('/payout', payoutValidation, affiliateController.requestPayout);

module.exports = router;