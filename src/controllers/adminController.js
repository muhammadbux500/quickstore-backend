const User = require('../models/User');
const Store = require('../models/Store');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Affiliate = require('../models/Affiliate');
const { validationResult } = require('express-validator');
const { sendEmail } = require('../services/emailService');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      role,
      status,
      search,
      sort = '-createdAt'
    } = req.query;

    // Build query
    const query = {};
    if (role) query.role = role;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password -refreshToken -resetPasswordToken')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    // Get additional stats for each user
    const usersWithStats = await Promise.all(users.map(async (user) => {
      const storeCount = await Store.countDocuments({ owner: user._id });
      const orderCount = await Order.countDocuments({ customer: user._id });
      
      return {
        ...user.toObject(),
        stats: {
          stores: storeCount,
          orders: orderCount
        }
      };
    }));

    res.json({
      success: true,
      data: usersWithStats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -refreshToken -resetPasswordToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's stores
    const stores = await Store.find({ owner: user._id });

    // Get user's orders
    const orders = await Order.find({ customer: user._id })
      .limit(10)
      .sort('-createdAt');

    // Get affiliate info if applicable
    const affiliate = await Affiliate.findOne({ user: user._id });

    res.json({
      success: true,
      data: {
        user,
        stores,
        recentOrders: orders,
        affiliate
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const {
      name,
      email,
      role,
      status,
      plan,
      permissions
    } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (status) user.status = status;
    if (plan) user.plan = plan;
    if (permissions) user.permissions = permissions;

    await user.save();

    // If user is an affiliate, update affiliate status
    if (role === 'affiliate') {
      await Affiliate.findOneAndUpdate(
        { user: user._id },
        { status: status === 'active' ? 'active' : 'suspended' }
      );
    }

    // Send email notification
    await sendEmail({
      to: user.email,
      subject: 'Account Update',
      template: 'account-updated',
      data: {
        name: user.name,
        changes: req.body
      }
    });

    res.json({
      success: true,
      data: user,
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete user's stores and related data
    const stores = await Store.find({ owner: user._id });
    for (const store of stores) {
      await Product.deleteMany({ store: store._id });
      await Order.deleteMany({ store: store._id });
      await store.deleteOne();
    }

    // Delete affiliate data if exists
    await Affiliate.deleteOne({ user: user._id });

    // Delete user
    await user.deleteOne();

    res.json({
      success: true,
      message: 'User and all associated data deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all stores
// @route   GET /api/admin/stores
// @access  Private/Admin
exports.getStores = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      plan,
      search,
      sort = '-createdAt'
    } = req.query;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (plan) query.plan = plan;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { url: { $regex: search, $options: 'i' } }
      ];
    }

    const stores = await Store.find(query)
      .populate('owner', 'name email')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Store.countDocuments(query);

    // Get stats for each store
    const storesWithStats = await Promise.all(stores.map(async (store) => {
      const productCount = await Product.countDocuments({ store: store._id });
      const orderCount = await Order.countDocuments({ store: store._id });
      const revenue = await Order.aggregate([
        { $match: { store: store._id, paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]);

      return {
        ...store.toObject(),
        stats: {
          products: productCount,
          orders: orderCount,
          revenue: revenue[0]?.total || 0
        }
      };
    }));

    res.json({
      success: true,
      data: storesWithStats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update store status
// @route   PUT /api/admin/stores/:id/status
// @access  Private/Admin
exports.updateStoreStatus = async (req, res) => {
  try {
    const { status, reason } = req.body;

    const store = await Store.findById(req.params.id).populate('owner');
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    store.status = status;
    store.statusReason = reason;
    store.statusUpdatedAt = new Date();
    store.statusUpdatedBy = req.user.id;
    await store.save();

    // Notify store owner
    await sendEmail({
      to: store.owner.email,
      subject: `Store ${status}`,
      template: 'store-status-update',
      data: {
        storeName: store.name,
        status,
        reason
      }
    });

    res.json({
      success: true,
      message: `Store status updated to ${status}`
    });

  } catch (error) {
    console.error('Update store status error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getAnalytics = async (req, res) => {
  try {
    const { timeframe = 'month' } = req.query;

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
    }

    // Get statistics
    const [
      totalUsers,
      totalStores,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentUsers,
      popularPlans,
      topStores
    ] = await Promise.all([
      User.countDocuments(),
      Store.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate }, paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      User.find().sort('-createdAt').limit(5).select('name email createdAt'),
      Store.aggregate([
        { $group: { _id: '$plan', count: { $sum: 1 } } }
      ]),
      Store.aggregate([
        { $lookup: { from: 'orders', localField: '_id', foreignField: 'store', as: 'orders' } },
        { $addFields: { orderCount: { $size: '$orders' } } },
        { $sort: { orderCount: -1 } },
        { $limit: 5 },
        { $project: { name: 1, url: 1, orderCount: 1 } }
      ])
    ]);

    // Get daily stats for chart
    const dailyStats = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate }, paymentStatus: 'paid' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          revenue: { $sum: '$total' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalStores,
          totalProducts,
          totalOrders,
          totalRevenue: totalRevenue[0]?.total || 0
        },
        trends: {
          daily: dailyStats,
          userGrowth: await getUserGrowth(startDate, endDate),
          storeGrowth: await getStoreGrowth(startDate, endDate)
        },
        popularPlans,
        topStores,
        recentUsers
      }
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get system health
// @route   GET /api/admin/health
// @access  Private/Admin
exports.getSystemHealth = async (req, res) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'healthy' : 'unhealthy';

    // Check Redis if used
    let redisStatus = 'not_configured';
    if (global.redisClient) {
      try {
        await global.redisClient.ping();
        redisStatus = 'healthy';
      } catch {
        redisStatus = 'unhealthy';
      }
    }

    // Get queue status if using Bull
    let queueStatus = 'not_configured';
    if (global.emailQueue) {
      const queueCounts = await global.emailQueue.getJobCounts();
      queueStatus = queueCounts;
    }

    // Get system metrics
    const metrics = {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      version: process.version,
      platform: process.platform
    };

    res.json({
      success: true,
      data: {
        status: dbStatus === 'healthy' ? 'operational' : 'degraded',
        timestamp: new Date(),
        components: {
          database: dbStatus,
          redis: redisStatus,
          queue: queueStatus
        },
        metrics
      }
    });

  } catch (error) {
    console.error('Get system health error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper functions
async function getUserGrowth(startDate, endDate) {
  const users = await User.aggregate([
    { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  return users;
}

async function getStoreGrowth(startDate, endDate) {
  const stores = await Store.aggregate([
    { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  return stores;
}