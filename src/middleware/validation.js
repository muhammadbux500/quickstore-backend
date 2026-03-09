const { validationResult } = require('express-validator');

// Validation result checker
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// Custom validators
exports.customValidators = {
  // Check if value is a valid MongoDB ObjectId
  isObjectId: (value) => {
    const mongoose = require('mongoose');
    return mongoose.Types.ObjectId.isValid(value);
  },

  // Check if email is from allowed domain
  isAllowedEmailDomain: (email, allowedDomains = []) => {
    if (allowedDomains.length === 0) return true;
    const domain = email.split('@')[1];
    return allowedDomains.includes(domain);
  },

  // Check password strength
  isStrongPassword: (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    return {
      isValid: hasUpperCase && hasLowerCase && hasNumbers && hasSpecial && isLongEnough,
      errors: {
        upperCase: !hasUpperCase,
        lowerCase: !hasLowerCase,
        numbers: !hasNumbers,
        special: !hasSpecial,
        length: !isLongEnough
      }
    };
  },

  // Check if URL is valid and reachable
  isReachableUrl: async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }
};

// Sanitize input
exports.sanitize = {
  // Remove HTML tags
  stripHtml: (value) => {
    if (typeof value !== 'string') return value;
    return value.replace(/<[^>]*>/g, '');
  },

  // Trim whitespace
  trim: (value) => {
    if (typeof value !== 'string') return value;
    return value.trim();
  },

  // Convert to proper case
  properCase: (value) => {
    if (typeof value !== 'string') return value;
    return value.replace(/\w\S*/g, txt => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },

  // Slugify string
  slugify: (value) => {
    if (typeof value !== 'string') return value;
    return value
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
};

// Validate request body against schema
exports.validateSchema = (schema) => {
  return (req, res, next) => {
    const errors = [];

    Object.keys(schema).forEach(field => {
      const rules = schema[field];
      const value = req.body[field];

      // Check required
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push({
          field,
          message: rules.message || `${field} is required`
        });
        return;
      }

      if (value !== undefined) {
        // Check type
        if (rules.type && typeof value !== rules.type) {
          errors.push({
            field,
            message: rules.typeMessage || `${field} must be a ${rules.type}`
          });
        }

        // Check min length
        if (rules.minLength && value.length < rules.minLength) {
          errors.push({
            field,
            message: rules.minLengthMessage || `${field} must be at least ${rules.minLength} characters`
          });
        }

        // Check max length
        if (rules.maxLength && value.length > rules.maxLength) {
          errors.push({
            field,
            message: rules.maxLengthMessage || `${field} cannot exceed ${rules.maxLength} characters`
          });
        }

        // Check pattern
        if (rules.pattern && !rules.pattern.test(value)) {
          errors.push({
            field,
            message: rules.patternMessage || `${field} is invalid`
          });
        }

        // Check custom validator
        if (rules.validate && !rules.validate(value)) {
          errors.push({
            field,
            message: rules.validateMessage || `${field} is invalid`
          });
        }
      }
    });

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors
      });
    }

    next();
  };
};

// Validate query parameters
exports.validateQuery = (allowedParams = []) => {
  return (req, res, next) => {
    const invalidParams = Object.keys(req.query).filter(
      param => !allowedParams.includes(param)
    );

    if (invalidParams.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid query parameters: ${invalidParams.join(', ')}`
      });
    }

    next();
  };
};

// Validate pagination parameters
exports.validatePagination = (req, res, next) => {
  const { page, limit } = req.query;

  if (page && (isNaN(page) || page < 1)) {
    return res.status(400).json({
      success: false,
      message: 'Page must be a positive number'
    });
  }

  if (limit && (isNaN(limit) || limit < 1 || limit > 100)) {
    return res.status(400).json({
      success: false,
      message: 'Limit must be between 1 and 100'
    });
  }

  next();
};

// Validate date range
exports.validateDateRange = (req, res, next) => {
  const { startDate, endDate } = req.query;

  if (startDate && isNaN(Date.parse(startDate))) {
    return res.status(400).json({
      success: false,
      message: 'Invalid start date'
    });
  }

  if (endDate && isNaN(Date.parse(endDate))) {
    return res.status(400).json({
      success: false,
      message: 'Invalid end date'
    });
  }

  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    return res.status(400).json({
      success: false,
      message: 'Start date cannot be after end date'
    });
  }

  next();
};

// Validate ID parameter
exports.validateId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];

    if (!id) {
      return res.status(400).json({
        success: false,
        message: `${paramName} is required`
      });
    }

    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${paramName} format`
      });
    }

    next();
  };
};

// Validate email
exports.validateEmail = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format'
    });
  }

  next();
};

// Validate phone number
exports.validatePhone = (req, res, next) => {
  const { phone } = req.body;

  if (!phone) return next();

  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid phone number format'
    });
  }

  next();
};

// Validate URL
exports.validateUrl = (req, res, next) => {
  const { website, url } = req.body;
  const urlToCheck = website || url;

  if (!urlToCheck) return next();

  try {
    new URL(urlToCheck);
    next();
  } catch {
    return res.status(400).json({
      success: false,
      message: 'Invalid URL format'
    });
  }
};

module.exports = exports;