const Affiliate = require('../models/Affiliate');
const Commission = require('../models/Commission');
const User = require('../models/User');
const Order = require('../models/Order');
const { validationResult } = require('express-validator');
const { generateReferralCode } = require('../utils/helpers');

// @desc    Register as affiliate
// @route   POST /api/affiliate/register
// @access  Private
exports.registerAffiliate = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { website, niche, promoMethods, taxInfo, paymentInfo } = req.body;

    // Check if already an affiliate
    const existingAffiliate = await Affiliate.findOne({ user: req.user.id });
    if (existingAffiliate) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered as an affiliate'
      });
    }

    // Generate unique referral code
    const referralCode = await generateReferralCode(req.user.id);

    // Create affiliate profile
    const affiliate = await Affiliate.create({
      user: req.user.id,
      referralCode,
      website,
      niche,
      promoMethods,
      taxInfo,
      paymentInfo,
      status: 'pending',
      tier: 'bronze',
      commissionRate: 10, // Default 10%
      joinedAt: new Date()
    });

    // Update user role
    await User.findByIdAndUpdate(req.user.id, {
      role: 'affiliate'
    });

    res.status(201).json({
      success: true,
      data: affiliate,
      message: 'Affiliate registration submitted for review'
    });

  } catch (error) {
    console.error('Register affiliate error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get affiliate dashboard
// @route   GET /api/affiliate/dashboard
// @access  Private (Affiliate only)
exports.getDashboard = async (req, res) => {
  try {
    const affiliate = await Affiliate.findOne({ user: req.user.id });
    if (!affiliate) {
      return res.status(404).json({
        success: false,
        message: 'Affiliate profile not found'
      });
    }

    // Get commissions summary
    const commissions = await Commission.aggregate([
      { $match: { affiliate: affiliate._id } },
      {
        $group: {
          _id: '$status',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent commissions
    const recentCommissions = await Commission.find({ affiliate: affiliate._id })
      .populate('order', 'orderNumber total createdAt')
      .sort('-createdAt')
      .limit(10);

    // Get clicks and conversions
    const stats = {
      totalClicks: affiliate.totalClicks || 0,
      totalConversions: affiliate.totalConversions || 0,
      conversionRate: affiliate.totalClicks > 0 
        ? ((affiliate.totalConversions / affiliate.totalClicks) * 100).toFixed(2) 
        : 0,
      totalEarnings: affiliate.totalEarnings || 0,
      pendingEarnings: commissions.find(c => c._id === 'pending')?.total || 0,
      paidEarnings: commissions.find(c => c._id === 'paid')?.total || 0
    };

    res.json({
      success: true,
      data: {
        affiliate,
        stats,
        recentCommissions
      }
    });

  } catch (error) {
    console.error('Get affiliate dashboard error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get affiliate commissions
// @route   GET /api/affiliate/commissions
// @access  Private (Affiliate only)
exports.getCommissions = async (req, res) => {
  try {
    const { status, page = 1, limit = 20, startDate, endDate } = req.query;

    const affiliate = await Affiliate.findOne({ user: req.user.id });
    if (!affiliate) {
      return res.status(404).json({
        success: false,
        message: 'Affiliate profile not found'
      });
    }

    const query = { affiliate: affiliate._id };
    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const commissions = await Commission.find(query)
      .populate('order', 'orderNumber total customer')
      .populate('product', 'name price')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Commission.countDocuments(query);

    // Calculate summary
    const summary = await Commission.aggregate([
      { $match: { affiliate: affiliate._id } },
      {
        $group: {
          _id: null,
          totalEarned: { $sum: '$amount' },
          totalCommissions: { $sum: 1 },
          averageCommission: { $avg: '$amount' }
        }
      }
    ]);

    res.json({
      success: true,
      data: commissions,
      summary: summary[0] || {
        totalEarned: 0,
        totalCommissions: 0,
        averageCommission: 0
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get commissions error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get referral links
// @route   GET /api/affiliate/links
// @access  Private (Affiliate only)
exports.getReferralLinks = async (req, res) => {
  try {
    const affiliate = await Affiliate.findOne({ user: req.user.id });
    if (!affiliate) {
      return res.status(404).json({
        success: false,
        message: 'Affiliate profile not found'
      });
    }

    const baseUrl = process.env.FRONTEND_URL || 'https://quickstore.com';
    const links = {
      main: `${baseUrl}/ref/${affiliate.referralCode}`,
      products: `${baseUrl}/ref/${affiliate.referralCode}/products`,
      store: `${baseUrl}/ref/${affiliate.referralCode}/store`,
      ...affiliate.customLinks
    };

    res.json({
      success: true,
      data: links
    });

  } catch (error) {
    console.error('Get referral links error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create custom referral link
// @route   POST /api/affiliate/links
// @access  Private (Affiliate only)
exports.createReferralLink = async (req, res) => {
  try {
    const { name, destination, utmParams } = req.body;

    const affiliate = await Affiliate.findOne({ user: req.user.id });
    if (!affiliate) {
      return res.status(404).json({
        success: false,
        message: 'Affiliate profile not found'
      });
    }

    const baseUrl = process.env.FRONTEND_URL || 'https://quickstore.com';
    const utmString = utmParams ? `?${new URLSearchParams(utmParams).toString()}` : '';
    const link = `${baseUrl}/ref/${affiliate.referralCode}/${destination}${utmString}`;

    affiliate.customLinks = affiliate.customLinks || {};
    affiliate.customLinks[name] = link;
    await affiliate.save();

    res.json({
      success: true,
      data: { [name]: link },
      message: 'Referral link created successfully'
    });

  } catch (error) {
    console.error('Create referral link error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Track click
// @route   GET /api/affiliate/track/:code
// @access  Public
exports.trackClick = async (req, res) => {
  try {
    const { code } = req.params;
    const { destination, utm_source, utm_medium, utm_campaign } = req.query;

    const affiliate = await Affiliate.findOne({ referralCode: code });
    if (!affiliate) {
      return res.status(404).json({
        success: false,
        message: 'Invalid referral code'
      });
    }

    // Update click stats
    affiliate.totalClicks = (affiliate.totalClicks || 0) + 1;
    affiliate.clicks.push({
      timestamp: new Date(),
      destination,
      utmSource: utm_source,
      utmMedium: utm_medium,
      utmCampaign: utm_campaign,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });
    await affiliate.save();

    // Redirect to destination or store
    const redirectUrl = destination 
      ? `${process.env.FRONTEND_URL}/${destination}`
      : `${process.env.FRONTEND_URL}/?ref=${code}`;

    res.redirect(redirectUrl);

  } catch (error) {
    console.error('Track click error:', error);
    res.redirect(process.env.FRONTEND_URL);
  }
};

// @desc    Track conversion (called when order is placed)
// @route   POST /api/affiliate/track/conversion
// @access  Private
exports.trackConversion = async (req, res) => {
  try {
    const { code, orderId } = req.body;

    const affiliate = await Affiliate.findOne({ referralCode: code });
    if (!affiliate) {
      return res.status(404).json({
        success: false,
        message: 'Invalid referral code'
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Calculate commission
    const commissionAmount = (order.total * affiliate.commissionRate) / 100;

    // Create commission record
    const commission = await Commission.create({
      affiliate: affiliate._id,
      order: order._id,
      amount: commissionAmount,
      rate: affiliate.commissionRate,
      status: 'pending',
      products: order.items.map(item => ({
        product: item.product,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        commission: (item.total * affiliate.commissionRate) / 100
      }))
    });

    // Update affiliate stats
    affiliate.totalConversions = (affiliate.totalConversions || 0) + 1;
    affiliate.totalEarnings = (affiliate.totalEarnings || 0) + commissionAmount;
    await affiliate.save();

    res.json({
      success: true,
      data: commission
    });

  } catch (error) {
    console.error('Track conversion error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Request payout
// @route   POST /api/affiliate/payout
// @access  Private (Affiliate only)
exports.requestPayout = async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;

    const affiliate = await Affiliate.findOne({ user: req.user.id });
    if (!affiliate) {
      return res.status(404).json({
        success: false,
        message: 'Affiliate profile not found'
      });
    }

    // Get pending commissions
    const pendingCommissions = await Commission.aggregate([
      { $match: { affiliate: affiliate._id, status: 'pending' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const pendingAmount = pendingCommissions[0]?.total || 0;

    if (amount > pendingAmount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance for payout'
      });
    }

    // Create payout request
    affiliate.payoutRequests = affiliate.payoutRequests || [];
    affiliate.payoutRequests.push({
      amount,
      paymentMethod,
      status: 'pending',
      requestedAt: new Date()
    });
    await affiliate.save();

    res.json({
      success: true,
      message: 'Payout request submitted successfully'
    });

  } catch (error) {
    console.error('Request payout error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get affiliate stats
// @route   GET /api/affiliate/stats
// @access  Private (Affiliate only)
exports.getStats = async (req, res) => {
  try {
    const { timeframe = 'month' } = req.query;

    const affiliate = await Affiliate.findOne({ user: req.user.id });
    if (!affiliate) {
      return res.status(404).json({
        success: false,
        message: 'Affiliate profile not found'
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
    }

    // Get commissions in date range
    const commissions = await Commission.find({
      affiliate: affiliate._id,
      createdAt: { $gte: startDate, $lte: endDate }
    }).populate('order');

    // Group by date
    const stats = {
      clicks: affiliate.clicks.filter(c => 
        c.timestamp >= startDate && c.timestamp <= endDate
      ).length,
      conversions: commissions.length,
      revenue: commissions.reduce((sum, c) => sum + c.amount, 0),
      byDay: {},
      byProduct: {},
      bySource: {}
    };

    // Group by day
    commissions.forEach(commission => {
      const day = commission.createdAt.toISOString().split('T')[0];
      if (!stats.byDay[day]) {
        stats.byDay[day] = {
          clicks: 0,
          conversions: 0,
          revenue: 0
        };
      }
      stats.byDay[day].conversions++;
      stats.byDay[day].revenue += commission.amount;
    });

    // Group clicks by day
    affiliate.clicks.forEach(click => {
      if (click.timestamp >= startDate && click.timestamp <= endDate) {
        const day = click.timestamp.toISOString().split('T')[0];
        if (!stats.byDay[day]) {
          stats.byDay[day] = {
            clicks: 0,
            conversions: 0,
            revenue: 0
          };
        }
        stats.byDay[day].clicks++;
      }
    });

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get affiliate stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};