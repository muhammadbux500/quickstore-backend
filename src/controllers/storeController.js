const Store = require('../models/Store');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { validationResult } = require('express-validator');
const slugify = require('slugify');

// @desc    Create store
// @route   POST /api/stores
// @access  Private
exports.createStore = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, url, description, category, logo } = req.body;

    // Check if store URL is available
    const existingStore = await Store.findOne({ url });
    if (existingStore) {
      return res.status(400).json({
        success: false,
        message: 'Store URL already taken'
      });
    }

    // Check store limit based on plan
    const userStores = await Store.countDocuments({ owner: req.user.id });
    const user = await User.findById(req.user.id);
    
    const planLimits = {
      starter: 1,
      professional: 3,
      enterprise: -1 // unlimited
    };

    const limit = planLimits[user.plan] || 1;
    if (limit !== -1 && userStores >= limit) {
      return res.status(400).json({
        success: false,
        message: `You have reached the maximum number of stores (${limit}) for your plan`
      });
    }

    // Create store
    const store = await Store.create({
      name,
      url,
      slug: slugify(name, { lower: true }),
      description,
      category,
      logo,
      owner: req.user.id,
      plan: user.plan,
      settings: {
        currency: 'USD',
        language: 'en',
        timezone: 'UTC',
        email: user.email
      }
    });

    res.status(201).json({
      success: true,
      data: store,
      message: 'Store created successfully'
    });

  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all stores for user
// @route   GET /api/stores
// @access  Private
exports.getStores = async (req, res) => {
  try {
    const stores = await Store.find({ owner: req.user.id });

    res.json({
      success: true,
      data: stores
    });

  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single store
// @route   GET /api/stores/:id
// @access  Private
exports.getStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('products');

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Check if user owns the store
    if (store.owner._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this store'
      });
    }

    res.json({
      success: true,
      data: store
    });

  } catch (error) {
    console.error('Get store error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update store
// @route   PUT /api/stores/:id
// @access  Private
exports.updateStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Check if user owns the store
    if (store.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this store'
      });
    }

    // Update fields
    const updates = [
      'name', 'description', 'category', 'logo', 'coverImage',
      'address', 'phone', 'email', 'website', 'social'
    ];

    updates.forEach(field => {
      if (req.body[field] !== undefined) {
        store[field] = req.body[field];
      }
    });

    await store.save();

    res.json({
      success: true,
      data: store,
      message: 'Store updated successfully'
    });

  } catch (error) {
    console.error('Update store error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete store
// @route   DELETE /api/stores/:id
// @access  Private
exports.deleteStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Check if user owns the store
    if (store.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this store'
      });
    }

    // Delete all products
    await Product.deleteMany({ store: store._id });

    // Delete all orders
    await Order.deleteMany({ store: store._id });

    // Delete store
    await store.deleteOne();

    res.json({
      success: true,
      message: 'Store deleted successfully'
    });

  } catch (error) {
    console.error('Delete store error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get store settings
// @route   GET /api/stores/:id/settings
// @access  Private
exports.getStoreSettings = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Check if user owns the store
    if (store.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.json({
      success: true,
      data: store.settings
    });

  } catch (error) {
    console.error('Get store settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update store settings
// @route   PUT /api/stores/:id/settings
// @access  Private
exports.updateStoreSettings = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Check if user owns the store
    if (store.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Update settings
    const settingsFields = [
      'currency', 'language', 'timezone', 'email', 'phone',
      'address', 'taxRate', 'shippingRates', 'paymentMethods',
      'orderSettings', 'notificationSettings', 'seoSettings'
    ];

    settingsFields.forEach(field => {
      if (req.body[field] !== undefined) {
        store.settings[field] = req.body[field];
      }
    });

    await store.save();

    res.json({
      success: true,
      data: store.settings,
      message: 'Store settings updated successfully'
    });

  } catch (error) {
    console.error('Update store settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get store analytics
// @route   GET /api/stores/:id/analytics
// @access  Private
exports.getStoreAnalytics = async (req, res) => {
  try {
    const { timeframe = 'month' } = req.query;
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Check if user owns the store
    if (store.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Calculate date range
    const endDate = new Date();
    let startDate = new Date();

    switch(timeframe) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 1);
    }

    // Get orders in date range
    const orders = await Order.find({
      store: store._id,
      createdAt: { $gte: startDate, $lte: endDate }
    });

    // Calculate analytics
    const analytics = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
      averageOrderValue: orders.length > 0 
        ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length 
        : 0,
      ordersByStatus: {},
      ordersByDay: {},
      topProducts: [],
      revenueByDay: {}
    };

    // Group by status
    orders.forEach(order => {
      analytics.ordersByStatus[order.status] = 
        (analytics.ordersByStatus[order.status] || 0) + 1;
    });

    // Group by day
    orders.forEach(order => {
      const day = order.createdAt.toISOString().split('T')[0];
      analytics.ordersByDay[day] = (analytics.ordersByDay[day] || 0) + 1;
      analytics.revenueByDay[day] = (analytics.revenueByDay[day] || 0) + order.total;
    });

    res.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('Get store analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Upload store logo
// @route   POST /api/stores/:id/logo
// @access  Private
exports.uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Check if user owns the store
    if (store.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Upload to cloud storage
    const logoUrl = await uploadToS3(req.file, 'store-logos');

    store.logo = logoUrl;
    await store.save();

    res.json({
      success: true,
      data: { logo: logoUrl },
      message: 'Logo uploaded successfully'
    });

  } catch (error) {
    console.error('Upload logo error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Check store URL availability
// @route   GET /api/stores/check-url/:url
// @access  Public
exports.checkStoreUrl = async (req, res) => {
  try {
    const { url } = req.params;

    const existingStore = await Store.findOne({ url });

    res.json({
      success: true,
      data: {
        available: !existingStore,
        url
      }
    });

  } catch (error) {
    console.error('Check store URL error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};