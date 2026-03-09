const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const slugify = require('slugify');
const { v4: uuidv4 } = require('uuid');

class Helpers {
  // ==================== Password Helpers ====================

  // Hash password
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  // Compare password
  async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Generate random password
  generateRandomPassword(length = 12) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, charset.length);
      password += charset[randomIndex];
    }
    
    return password;
  }

  // Validate password strength
  validatePasswordStrength(password) {
    const checks = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const score = Object.values(checks).filter(Boolean).length;
    const strength = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][score];

    return {
      isValid: score >= 4,
      score,
      strength,
      checks
    };
  }

  // ==================== Token Helpers ====================

  // Generate JWT token
  generateToken(payload, expiresIn = '30d') {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  }

  // Generate refresh token
  generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  }

  // Verify token
  verifyToken(token, secret = process.env.JWT_SECRET) {
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      return null;
    }
  }

  // Generate random token
  generateRandomToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  // Generate OTP
  generateOTP(length = 6) {
    return crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
  }

  // ==================== String Helpers ====================

  // Generate slug
  generateSlug(text) {
    return slugify(text, {
      lower: true,
      strict: true,
      trim: true
    });
  }

  // Generate unique ID
  generateId(prefix = '') {
    const id = uuidv4().replace(/-/g, '');
    return prefix ? `${prefix}_${id}` : id;
  }

  // Generate order number
  generateOrderNumber(storePrefix = 'ORD') {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = crypto.randomInt(1000, 9999);
    
    return `${storePrefix}${year}${month}${day}${random}`;
  }

  // Generate SKU
  generateSKU(productName, category, attributes = {}) {
    const namePart = productName
      .split(' ')
      .map(word => word.substring(0, 2).toUpperCase())
      .join('');

    const categoryPart = category ? category.substring(0, 3).toUpperCase() : 'GEN';

    const attrPart = Object.values(attributes)
      .map(val => val.substring(0, 2).toUpperCase())
      .join('');

    const randomPart = crypto.randomInt(100, 999);

    return `${categoryPart}-${namePart}${attrPart}-${randomPart}`;
  }

  // Truncate text
  truncateText(text, length = 100, suffix = '...') {
    if (text.length <= length) return text;
    return text.substring(0, length - suffix.length) + suffix;
  }

  // Strip HTML
  stripHtml(html) {
    return html.replace(/<[^>]*>?/gm, '');
  }

  // Escape HTML
  escapeHtml(text) {
    const replacements = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return text.replace(/[&<>"']/g, char => replacements[char]);
  }

  // ==================== Number Helpers ====================

  // Format currency
  formatCurrency(amount, currency = 'USD', locale = 'en-US') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  // Format percentage
  formatPercentage(value, decimals = 1) {
    return `${value.toFixed(decimals)}%`;
  }

  // Calculate discount percentage
  calculateDiscount(price, comparePrice) {
    if (!comparePrice || comparePrice <= price) return 0;
    return ((comparePrice - price) / comparePrice) * 100;
  }

  // Calculate tax
  calculateTax(amount, rate) {
    return (amount * rate) / 100;
  }

  // Calculate profit margin
  calculateProfitMargin(price, cost) {
    if (price === 0) return 0;
    return ((price - cost) / price) * 100;
  }

  // Format file size
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // ==================== Date Helpers ====================

  // Format date
  formatDate(date, format = 'YYYY-MM-DD') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day);
  }

  // Get relative time
  getRelativeTime(date) {
    const now = new Date();
    const diff = now - new Date(date);
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  }

  // Add time to date
  addTime(date, amount, unit) {
    const result = new Date(date);
    const units = {
      seconds: () => result.setSeconds(result.getSeconds() + amount),
      minutes: () => result.setMinutes(result.getMinutes() + amount),
      hours: () => result.setHours(result.getHours() + amount),
      days: () => result.setDate(result.getDate() + amount),
      weeks: () => result.setDate(result.getDate() + amount * 7),
      months: () => result.setMonth(result.getMonth() + amount),
      years: () => result.setFullYear(result.getFullYear() + amount)
    };

    if (units[unit]) {
      units[unit]();
    }

    return result;
  }

  // Get date range
  getDateRange(range) {
    const now = new Date();
    const start = new Date(now);
    const end = new Date(now);

    switch (range) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;

      case 'yesterday':
        start.setDate(start.getDate() - 1);
        start.setHours(0, 0, 0, 0);
        end.setDate(end.getDate() - 1);
        end.setHours(23, 59, 59, 999);
        break;

      case 'thisWeek':
        start.setDate(start.getDate() - start.getDay());
        start.setHours(0, 0, 0, 0);
        end.setDate(end.getDate() + (6 - end.getDay()));
        end.setHours(23, 59, 59, 999);
        break;

      case 'thisMonth':
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(end.getMonth() + 1);
        end.setDate(0);
        end.setHours(23, 59, 59, 999);
        break;

      case 'thisYear':
        start.setMonth(0, 1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(11, 31);
        end.setHours(23, 59, 59, 999);
        break;
    }

    return { start, end };
  }

  // ==================== Object Helpers ====================

  // Deep clone
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // Merge objects deeply
  deepMerge(target, source) {
    const output = { ...target };

    for (const key in source) {
      if (source[key] instanceof Object && !Array.isArray(source[key])) {
        if (!output[key]) output[key] = {};
        output[key] = this.deepMerge(output[key], source[key]);
      } else {
        output[key] = source[key];
      }
    }

    return output;
  }

  // Pick object properties
  pick(obj, keys) {
    return keys.reduce((acc, key) => {
      if (obj.hasOwnProperty(key)) {
        acc[key] = obj[key];
      }
      return acc;
    }, {});
  }

  // Omit object properties
  omit(obj, keys) {
    return Object.keys(obj)
      .filter(key => !keys.includes(key))
      .reduce((acc, key) => {
        acc[key] = obj[key];
        return acc;
      }, {});
  }

  // Check if object is empty
  isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  // ==================== Array Helpers ====================

  // Paginate array
  paginate(array, page = 1, limit = 10) {
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      data: array.slice(start, end),
      pagination: {
        page,
        limit,
        total: array.length,
        pages: Math.ceil(array.length / limit)
      }
    };
  }

  // Group array by key
  groupBy(array, key) {
    return array.reduce((acc, item) => {
      const group = item[key];
      if (!acc[group]) acc[group] = [];
      acc[group].push(item);
      return acc;
    }, {});
  }

  // Sort array by key
  sortBy(array, key, order = 'asc') {
    return [...array].sort((a, b) => {
      if (order === 'asc') {
        return a[key] > b[key] ? 1 : -1;
      } else {
        return a[key] < b[key] ? 1 : -1;
      }
    });
  }

  // Get unique values
  unique(array) {
    return [...new Set(array)];
  }

  // Chunk array
  chunk(array, size) {
    return array.reduce((acc, _, i) => {
      if (i % size === 0) acc.push(array.slice(i, i + size));
      return acc;
    }, []);
  }

  // ==================== Validation Helpers ====================

  // Validate email
  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Validate phone
  isValidPhone(phone) {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(phone);
  }

  // Validate URL
  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Validate MongoDB ObjectId
  isValidObjectId(id) {
    const mongoose = require('mongoose');
    return mongoose.Types.ObjectId.isValid(id);
  }

  // ==================== Crypto Helpers ====================

  // Encrypt data
  encrypt(text) {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32);
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return {
      iv: iv.toString('hex'),
      encrypted
    };
  }

  // Decrypt data
  decrypt(encrypted, iv) {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32);
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  // Hash data
  hash(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  // Generate HMAC
  generateHMAC(data, secret) {
    return crypto
      .createHmac('sha256', secret)
      .update(data)
      .digest('hex');
  }

  // ==================== File Helpers ====================

  // Get file extension
  getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  }

  // Get file MIME type
  getMimeType(extension) {
    const mimeTypes = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'csv': 'text/csv',
      'txt': 'text/plain',
      'mp4': 'video/mp4',
      'mp3': 'audio/mpeg',
      'json': 'application/json'
    };

    return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
  }

  // Generate filename
  generateFilename(originalName, prefix = '') {
    const ext = this.getFileExtension(originalName);
    const name = originalName.replace(`.${ext}`, '');
    const slug = this.generateSlug(name);
    const timestamp = Date.now();
    const random = crypto.randomInt(1000, 9999);

    return `${prefix ? prefix + '-' : ''}${slug}-${timestamp}-${random}.${ext}`;
  }

  // ==================== IP Helpers ====================

  // Get client IP
  getClientIP(req) {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? forwarded.split(',')[0] : req.connection.remoteAddress;
    
    return ip === '::1' ? '127.0.0.1' : ip;
  }

  // Get IP location
  async getIPLocation(ip) {
    try {
      const response = await fetch(`http://ip-api.com/json/${ip}`);
      const data = await response.json();

      if (data.status === 'success') {
        return {
          country: data.country,
          countryCode: data.countryCode,
          region: data.regionName,
          city: data.city,
          lat: data.lat,
          lon: data.lon,
          timezone: data.timezone,
          isp: data.isp
        };
      }

      return null;

    } catch (error) {
      console.error('IP location error:', error);
      return null;
    }
  }

  // ==================== User Agent Helpers ====================

  // Parse user agent
  parseUserAgent(userAgent) {
    const ua = userAgent.toLowerCase();

    // Detect browser
    let browser = 'Unknown';
    if (ua.includes('chrome')) browser = 'Chrome';
    else if (ua.includes('firefox')) browser = 'Firefox';
    else if (ua.includes('safari')) browser = 'Safari';
    else if (ua.includes('edge')) browser = 'Edge';
    else if (ua.includes('opera')) browser = 'Opera';

    // Detect OS
    let os = 'Unknown';
    if (ua.includes('windows')) os = 'Windows';
    else if (ua.includes('mac')) os = 'MacOS';
    else if (ua.includes('linux')) os = 'Linux';
    else if (ua.includes('android')) os = 'Android';
    else if (ua.includes('ios')) os = 'iOS';

    // Detect device
    let device = 'Desktop';
    if (ua.includes('mobile')) device = 'Mobile';
    else if (ua.includes('tablet')) device = 'Tablet';

    return { browser, os, device };
  }

  // ==================== Cache Helpers ====================

  // Generate cache key
  generateCacheKey(prefix, ...parts) {
    return [prefix, ...parts.map(p => String(p))].join(':');
  }

  // Parse cache key
  parseCacheKey(key) {
    return key.split(':');
  }

  // ==================== Response Helpers ====================

  // Success response
  success(res, data = null, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date()
    });
  }

  // Error response
  error(res, message = 'Error', statusCode = 500, errors = null) {
    const response = {
      success: false,
      message,
      timestamp: new Date()
    };

    if (errors) response.errors = errors;

    return res.status(statusCode).json(response);
  }

  // Pagination response
  paginate(res, data, pagination, message = 'Success') {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination,
      timestamp: new Date()
    });
  }
}

// Create singleton instance
const helpers = new Helpers();

module.exports = helpers;