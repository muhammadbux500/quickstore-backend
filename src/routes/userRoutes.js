const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Validation rules
const updateProfileValidation = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/).withMessage('Please enter a valid phone number'),
  body('website')
    .optional()
    .isURL().withMessage('Please enter a valid URL'),
  body('social.facebook')
    .optional()
    .isURL().withMessage('Please enter a valid Facebook URL'),
  body('social.twitter')
    .optional()
    .isURL().withMessage('Please enter a valid Twitter URL'),
  body('social.instagram')
    .optional()
    .isURL().withMessage('Please enter a valid Instagram URL'),
  body('social.linkedin')
    .optional()
    .isURL().withMessage('Please enter a valid LinkedIn URL')
];

// All routes require authentication
router.use(protect);

// User profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', updateProfileValidation, userController.updateProfile);
router.post('/avatar', upload.single('avatar'), userController.uploadAvatar);

// Notification routes
router.get('/notifications', userController.getNotifications);
router.put('/notifications/:id/read', userController.markNotificationRead);
router.put('/notifications/read-all', userController.markAllNotificationsRead);

// Store and order routes
router.get('/stores', userController.getUserStores);
router.get('/orders', userController.getUserOrders);

// Account management
router.delete('/account', userController.deleteAccount);

module.exports = router;