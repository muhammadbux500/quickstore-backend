const User = require('../models/User');

// Admin check middleware
exports.isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    next();

  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in admin check'
    });
  }
};

// Super admin check (for critical operations)
exports.isSuperAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Check if user has super admin permissions
    if (req.user.role !== 'admin' || !req.user.permissions?.includes('super_admin')) {
      return res.status(403).json({
        success: false,
        message: 'Super admin access required'
      });
    }

    next();

  } catch (error) {
    console.error('Super admin check error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in super admin check'
    });
  }
};

// Log admin actions
exports.logAdminAction = (action) => {
  return async (req, res, next) => {
    const originalJson = res.json;
    
    res.json = function(data) {
      // Log after response is sent
      if (data.success) {
        const log = {
          admin: req.user._id,
          action,
          target: req.params.id || req.body.id || null,
          details: {
            method: req.method,
            path: req.path,
            body: req.body,
            query: req.query,
            params: req.params
          },
          timestamp: new Date(),
          ip: req.ip,
          userAgent: req.get('User-Agent')
        };

        // Save log to database or file
        console.log('Admin action:', log);
        
        // You can save to a separate collection
        // const AdminLog = require('../models/AdminLog');
        // await AdminLog.create(log);
      }

      originalJson.call(this, data);
    };

    next();
  };
};

// Check admin permissions
exports.hasPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    // Check specific permission
    if (permission && !req.user.permissions?.includes(permission)) {
      return res.status(403).json({
        success: false,
        message: `Permission '${permission}' required`
      });
    }

    next();
  };
};

// Rate limit for admin actions
exports.adminRateLimiter = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();

  return (req, res, next) => {
    const adminId = req.user?._id?.toString();
    if (!adminId) return next();

    const now = Date.now();
    
    if (!requests.has(adminId)) {
      requests.set(adminId, []);
    }

    const adminRequests = requests.get(adminId).filter(timestamp => now - timestamp < windowMs);
    
    if (adminRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many admin requests. Please try again later.'
      });
    }

    adminRequests.push(now);
    requests.set(adminId, adminRequests);
    next();
  };
};

// Validate before admin actions
exports.validateAdminAction = (req, res, next) => {
  // Add additional validation for sensitive operations
  const sensitiveActions = ['DELETE', 'PUT', 'POST'];
  
  if (sensitiveActions.includes(req.method)) {
    // Require confirmation for sensitive actions
    if (req.headers['x-confirm-action'] !== 'true') {
      return res.status(400).json({
        success: false,
        message: 'Please confirm this action with X-Confirm-Action header'
      });
    }
  }

  next();
};

// Check if admin can modify user
exports.canModifyUser = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    
    // Admin can't modify themselves through this route
    if (targetUserId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Use profile update route to modify your own account'
      });
    }

    // Check if target user is another admin
    const targetUser = await User.findById(targetUserId);
    if (targetUser && targetUser.role === 'admin' && !req.user.permissions?.includes('manage_admins')) {
      return res.status(403).json({
        success: false,
        message: 'Cannot modify other admin accounts'
      });
    }

    next();

  } catch (error) {
    console.error('Can modify user check error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error checking user modification permissions'
    });
  }
};