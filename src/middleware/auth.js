const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify token
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.id).select('-password -refreshToken -resetPasswordToken');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if user is active
      if (user.status === 'suspended') {
        return res.status(403).json({
          success: false,
          message: 'Your account has been suspended'
        });
      }

      if (user.status === 'inactive') {
        return res.status(403).json({
          success: false,
          message: 'Your account is inactive'
        });
      }

      // Attach user to request
      req.user = user;
      next();

    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired',
          expired: true
        });
      }
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }

      throw error;
    }

  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

// Authorize by role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }

    next();
  };
};

// Check if user owns resource or is admin
exports.checkOwnership = (model) => {
  return async (req, res, next) => {
    try {
      if (req.user.role === 'admin') {
        return next();
      }

      const resource = await model.findById(req.params.id);
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }

      // Check if user owns the resource
      const ownerField = resource.store ? 'store' : 'owner';
      const ownerId = resource[ownerField]?.toString();

      if (ownerId === req.user.id || resource.user?.toString() === req.user.id) {
        return next();
      }

      // For store resources, check if user owns the store
      if (resource.store) {
        const Store = require('../models/Store');
        const store = await Store.findById(resource.store);
        
        if (store && store.owner.toString() === req.user.id) {
          return next();
        }
      }

      return res.status(403).json({
        success: false,
        message: 'You do not own this resource'
      });

    } catch (error) {
      console.error('Ownership check error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error in ownership check'
      });
    }
  };
};

// Rate limiting for auth attempts
exports.authRateLimiter = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  const attempts = new Map();

  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    
    if (!attempts.has(ip)) {
      attempts.set(ip, []);
    }

    const userAttempts = attempts.get(ip).filter(timestamp => now - timestamp < windowMs);
    
    if (userAttempts.length >= maxAttempts) {
      return res.status(429).json({
        success: false,
        message: 'Too many login attempts. Please try again later.'
      });
    }

    userAttempts.push(now);
    attempts.set(ip, userAttempts);
    next();
  };
};

// Optional authentication (doesn't require token but attaches user if present)
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (user && user.status === 'active') {
          req.user = user;
        }
      } catch (error) {
        // Token invalid but continue as guest
      }
    }

    next();

  } catch (error) {
    console.error('Optional auth error:', error);
    next();
  }
};

// Check if store is active
exports.checkStoreActive = async (req, res, next) => {
  try {
    const storeId = req.params.storeId || req.body.storeId || req.query.storeId;
    
    if (!storeId) {
      return next();
    }

    const Store = require('../models/Store');
    const store = await Store.findById(storeId);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    if (store.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: `Store is ${store.status}`
      });
    }

    req.store = store;
    next();

  } catch (error) {
    console.error('Check store active error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error checking store status'
    });
  }
};

// Verify email before allowing certain actions
exports.requireVerifiedEmail = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Please verify your email address first'
    });
  }
  next();
};