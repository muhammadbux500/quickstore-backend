// App constants
const constants = {
  // App information
  APP: {
    NAME: 'QuickStore',
    VERSION: '1.0.0',
    DESCRIPTION: 'AI-Powered E-commerce Platform',
    URL: process.env.APP_URL || 'https://quickstore.com',
    API_URL: process.env.API_URL || 'http://localhost:5000/api',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 5000
  },

  // User roles
  USER_ROLES: {
    CUSTOMER: 'customer',
    STORE_OWNER: 'store_owner',
    AFFILIATE: 'affiliate',
    ADMIN: 'admin'
  },

  // User status
  USER_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended',
    PENDING: 'pending',
    BANNED: 'banned'
  },

  // Store plans
  STORE_PLANS: {
    STARTER: 'starter',
    PROFESSIONAL: 'professional',
    ENTERPRISE: 'enterprise',
    AFFILIATE: 'affiliate',
    CUSTOM: 'custom'
  },

  // Store status
  STORE_STATUS: {
    PENDING: 'pending',
    ACTIVE: 'active',
    SUSPENDED: 'suspended',
    CLOSED: 'closed'
  },

  // Product status
  PRODUCT_STATUS: {
    DRAFT: 'draft',
    ACTIVE: 'active',
    ARCHIVED: 'archived',
    OUT_OF_STOCK: 'out_of_stock'
  },

  // Order status
  ORDER_STATUS: {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded'
  },

  // Payment status
  PAYMENT_STATUS: {
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
    REFUNDED: 'refunded',
    PARTIALLY_REFUNDED: 'partially_refunded'
  },

  // Payment methods
  PAYMENT_METHODS: {
    STRIPE: 'stripe',
    PAYPAL: 'paypal',
    BANK_TRANSFER: 'bank_transfer',
    COD: 'cod'
  },

  // Shipping status
  SHIPPING_STATUS: {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    IN_TRANSIT: 'in_transit',
    OUT_FOR_DELIVERY: 'out_for_delivery',
    DELIVERED: 'delivered',
    RETURNED: 'returned'
  },

  // Affiliate tiers
  AFFILIATE_TIERS: {
    BRONZE: 'bronze',
    SILVER: 'silver',
    GOLD: 'gold',
    PLATINUM: 'platinum'
  },

  // Affiliate status
  AFFILIATE_STATUS: {
    PENDING: 'pending',
    ACTIVE: 'active',
    SUSPENDED: 'suspended',
    BANNED: 'banned'
  },

  // Commission status
  COMMISSION_STATUS: {
    PENDING: 'pending',
    APPROVED: 'approved',
    PAID: 'paid',
    CANCELLED: 'cancelled'
  },

  // Subscription status
  SUBSCRIPTION_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PAST_DUE: 'past_due',
    CANCELLED: 'cancelled',
    EXPIRED: 'expired',
    TRIAL: 'trial'
  },

  // Billing intervals
  BILLING_INTERVALS: {
    MONTHLY: 'monthly',
    QUARTERLY: 'quarterly',
    YEARLY: 'yearly'
  },

  // Theme types
  THEME_TYPES: {
    FREE: 'free',
    PREMIUM: 'premium',
    CUSTOM: 'custom'
  },

  // Theme status
  THEME_STATUS: {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    ARCHIVED: 'archived'
  },

  // Social platforms
  SOCIAL_PLATFORMS: {
    FACEBOOK: 'facebook',
    INSTAGRAM: 'instagram',
    TWITTER: 'twitter',
    PINTEREST: 'pinterest',
    LINKEDIN: 'linkedin',
    YOUTUBE: 'youtube',
    TIKTOK: 'tiktok'
  },

  // Notification types
  NOTIFICATION_TYPES: {
    ORDER: 'order',
    PROMOTION: 'promotion',
    ALERT: 'alert',
    MESSAGE: 'message',
    SYSTEM: 'system'
  },

  // Activity types
  ACTIVITY_TYPES: {
    LOGIN: 'login',
    LOGOUT: 'logout',
    SIGNUP: 'signup',
    ORDER_CREATED: 'order_created',
    ORDER_UPDATED: 'order_updated',
    PRODUCT_CREATED: 'product_created',
    PRODUCT_UPDATED: 'product_updated',
    STORE_CREATED: 'store_created',
    STORE_UPDATED: 'store_updated',
    PAYMENT_RECEIVED: 'payment_received',
    REFUND_PROCESSED: 'refund_processed'
  },

  // Timeframes
  TIMEFRAMES: {
    TODAY: 'today',
    YESTERDAY: 'yesterday',
    THIS_WEEK: 'this_week',
    LAST_WEEK: 'last_week',
    THIS_MONTH: 'this_month',
    LAST_MONTH: 'last_month',
    THIS_QUARTER: 'this_quarter',
    LAST_QUARTER: 'last_quarter',
    THIS_YEAR: 'this_year',
    LAST_YEAR: 'last_year',
    ALL_TIME: 'all_time'
  },

  // Currencies
  CURRENCIES: {
    USD: 'USD',
    EUR: 'EUR',
    GBP: 'GBP',
    CAD: 'CAD',
    AUD: 'AUD',
    JPY: 'JPY',
    CNY: 'CNY',
    INR: 'INR'
  },

  // Currency symbols
  CURRENCY_SYMBOLS: {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$',
    JPY: '¥',
    CNY: '¥',
    INR: '₹'
  },

  // Languages
  LANGUAGES: {
    EN: 'en',
    ES: 'es',
    FR: 'fr',
    DE: 'de',
    IT: 'it',
    PT: 'pt',
    RU: 'ru',
    ZH: 'zh',
    JA: 'ja',
    AR: 'ar'
  },

  // Countries
  COUNTRIES: {
    US: 'US',
    GB: 'GB',
    CA: 'CA',
    AU: 'AU',
    DE: 'DE',
    FR: 'FR',
    IT: 'IT',
    ES: 'ES',
    JP: 'JP',
    CN: 'CN',
    IN: 'IN'
  },

  // Validation rules
  VALIDATION: {
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_MAX_LENGTH: 50,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50,
    STORE_NAME_MIN_LENGTH: 3,
    STORE_NAME_MAX_LENGTH: 50,
    STORE_URL_MIN_LENGTH: 3,
    STORE_URL_MAX_LENGTH: 30,
    SKU_MIN_LENGTH: 3,
    SKU_MAX_LENGTH: 20,
    PHONE_MIN_LENGTH: 10,
    PHONE_MAX_LENGTH: 15,
    ZIP_CODE_MIN_LENGTH: 3,
    ZIP_CODE_MAX_LENGTH: 10,
    DESCRIPTION_MAX_LENGTH: 500,
    PRODUCT_NAME_MAX_LENGTH: 100,
    PRODUCT_DESC_MAX_LENGTH: 2000,
    REVIEW_MAX_LENGTH: 500
  },

  // Regex patterns
  REGEX: {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    STORE_URL: /^[a-z0-9-]{3,30}$/,
    SKU: /^[A-Z0-9-]{3,20}$/,
    ZIP_CODE: /^\d{5}(-\d{4})?$/,
    CREDIT_CARD: /^\d{4}-\d{4}-\d{4}-\d{4}$/,
    HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
    SLUG: /^[a-z0-9-]+$/
  },

  // File upload limits
  UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_FILES: 10,
    ALLOWED_IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    ALLOWED_DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    ALLOWED_VIDEOS: ['video/mp4', 'video/webm', 'video/ogg']
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
  },

  // Cache keys
  CACHE_KEYS: {
    USER: 'user',
    STORE: 'store',
    PRODUCTS: 'products',
    ORDERS: 'orders',
    CATEGORIES: 'categories',
    SETTINGS: 'settings',
    THEME: 'theme',
    SESSION: 'session'
  },

  // Cache TTL (seconds)
  CACHE_TTL: {
    USER: 3600, // 1 hour
    STORE: 1800, // 30 minutes
    PRODUCTS: 300, // 5 minutes
    ORDERS: 600, // 10 minutes
    CATEGORIES: 3600, // 1 hour
    SETTINGS: 86400, // 24 hours
    THEME: 86400, // 24 hours
    SESSION: 7200 // 2 hours
  },

  // Event names
  EVENTS: {
    // Auth events
    USER_REGISTERED: 'user.registered',
    USER_LOGGED_IN: 'user.logged_in',
    USER_LOGGED_OUT: 'user.logged_out',
    PASSWORD_RESET: 'user.password_reset',
    EMAIL_VERIFIED: 'user.email_verified',

    // Store events
    STORE_CREATED: 'store.created',
    STORE_UPDATED: 'store.updated',
    STORE_DELETED: 'store.deleted',

    // Product events
    PRODUCT_CREATED: 'product.created',
    PRODUCT_UPDATED: 'product.updated',
    PRODUCT_DELETED: 'product.deleted',
    PRODUCT_SOLD: 'product.sold',

    // Order events
    ORDER_CREATED: 'order.created',
    ORDER_UPDATED: 'order.updated',
    ORDER_CANCELLED: 'order.cancelled',
    ORDER_REFUNDED: 'order.refunded',
    ORDER_SHIPPED: 'order.shipped',
    ORDER_DELIVERED: 'order.delivered',

    // Payment events
    PAYMENT_RECEIVED: 'payment.received',
    PAYMENT_FAILED: 'payment.failed',
    REFUND_PROCESSED: 'refund.processed',

    // Affiliate events
    AFFILIATE_REGISTERED: 'affiliate.registered',
    COMMISSION_EARNED: 'commission.earned',
    PAYOUT_REQUESTED: 'payout.requested',
    PAYOUT_PROCESSED: 'payout.processed',

    // System events
    SYSTEM_ERROR: 'system.error',
    SYSTEM_WARNING: 'system.warning',
    SYSTEM_INFO: 'system.info',
    BACKUP_COMPLETED: 'backup.completed',
    MIGRATION_COMPLETED: 'migration.completed'
  },

  // Error messages
  ERRORS: {
    // Auth errors
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_ALREADY_EXISTS: 'Email already exists',
    USER_NOT_FOUND: 'User not found',
    INVALID_TOKEN: 'Invalid or expired token',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'You do not have permission to perform this action',
    ACCOUNT_SUSPENDED: 'Your account has been suspended',
    ACCOUNT_INACTIVE: 'Your account is inactive',

    // Validation errors
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_PHONE: 'Please enter a valid phone number',
    INVALID_URL: 'Please enter a valid URL',
    PASSWORD_TOO_SHORT: `Password must be at least ${8} characters`,
    PASSWORD_TOO_LONG: `Password must be less than ${50} characters`,
    PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',

    // Store errors
    STORE_NOT_FOUND: 'Store not found',
    STORE_URL_TAKEN: 'This store URL is already taken',
    STORE_LIMIT_REACHED: 'You have reached the maximum number of stores for your plan',

    // Product errors
    PRODUCT_NOT_FOUND: 'Product not found',
    PRODUCT_LIMIT_REACHED: 'You have reached the maximum number of products for your plan',
    INSUFFICIENT_STOCK: 'Insufficient stock',

    // Order errors
    ORDER_NOT_FOUND: 'Order not found',
    ORDER_CANNOT_BE_CANCELLED: 'Order cannot be cancelled',

    // Payment errors
    PAYMENT_FAILED: 'Payment failed. Please try again',
    INVALID_PAYMENT_METHOD: 'Invalid payment method',
    REFUND_FAILED: 'Refund failed',

    // File upload errors
    FILE_TOO_LARGE: `File size must be less than ${10}MB`,
    INVALID_FILE_TYPE: 'Invalid file type',
    TOO_MANY_FILES: `You can only upload up to ${10} files`,

    // Server errors
    SERVER_ERROR: 'Something went wrong. Please try again later',
    DATABASE_ERROR: 'Database error',
    NETWORK_ERROR: 'Network error. Please check your connection'
  },

  // Success messages
  SUCCESS: {
    // Auth success
    LOGIN_SUCCESS: 'Successfully logged in',
    LOGOUT_SUCCESS: 'Successfully logged out',
    SIGNUP_SUCCESS: 'Account created successfully',
    PROFILE_UPDATED: 'Profile updated successfully',
    PASSWORD_UPDATED: 'Password updated successfully',
    EMAIL_VERIFIED: 'Email verified successfully',
    PASSWORD_RESET_EMAIL_SENT: 'Password reset email sent',
    PASSWORD_RESET_SUCCESS: 'Password reset successfully',

    // Store success
    STORE_CREATED: 'Store created successfully',
    STORE_UPDATED: 'Store updated successfully',
    STORE_DELETED: 'Store deleted successfully',

    // Product success
    PRODUCT_CREATED: 'Product created successfully',
    PRODUCT_UPDATED: 'Product updated successfully',
    PRODUCT_DELETED: 'Product deleted successfully',

    // Order success
    ORDER_CREATED: 'Order created successfully',
    ORDER_UPDATED: 'Order updated successfully',
    ORDER_CANCELLED: 'Order cancelled successfully',

    // Payment success
    PAYMENT_SUCCESS: 'Payment processed successfully',
    REFUND_SUCCESS: 'Refund processed successfully',

    // File upload success
    FILE_UPLOADED: 'File uploaded successfully',

    // AI success
    AI_GENERATION_SUCCESS: 'Content generated successfully'
  },

  // API endpoints
  API_ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      SIGNUP: '/auth/signup',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      VERIFY_EMAIL: '/auth/verify-email',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password'
    },
    USER: {
      PROFILE: '/user/profile',
      UPDATE_PASSWORD: '/user/password',
      AVATAR: '/user/avatar',
      NOTIFICATIONS: '/user/notifications'
    },
    STORE: {
      BASE: '/stores',
      SETTINGS: '/stores/:id/settings',
      ANALYTICS: '/stores/:id/analytics'
    },
    PRODUCT: {
      BASE: '/stores/:storeId/products',
      CATEGORIES: '/stores/:storeId/categories'
    },
    ORDER: {
      BASE: '/stores/:storeId/orders',
      INVOICE: '/stores/:storeId/orders/:id/invoice'
    },
    AFFILIATE: {
      DASHBOARD: '/affiliate/dashboard',
      COMMISSIONS: '/affiliate/commissions',
      LINKS: '/affiliate/links',
      PAYOUTS: '/affiliate/payouts'
    },
    ADMIN: {
      USERS: '/admin/users',
      STORES: '/admin/stores',
      ANALYTICS: '/admin/analytics'
    },
    AI: {
      GENERATE_STORE: '/ai/generate-store',
      GENERATE_DESCRIPTION: '/ai/generate-description',
      GENERATE_SEO: '/ai/generate-seo',
      GENERATE_IMAGE: '/ai/generate-image',
      ANALYZE: '/ai/analyze/:id',
      CHAT: '/ai/chat'
    }
  },

  // Webhook events
  WEBHOOK_EVENTS: {
    ORDER_CREATED: 'order.created',
    ORDER_UPDATED: 'order.updated',
    ORDER_CANCELLED: 'order.cancelled',
    PAYMENT_RECEIVED: 'payment.received',
    PAYMENT_FAILED: 'payment.failed',
    REFUND_PROCESSED: 'refund.processed',
    PRODUCT_CREATED: 'product.created',
    PRODUCT_UPDATED: 'product.updated',
    STORE_CREATED: 'store.created',
    STORE_UPDATED: 'store.updated'
  },

  // Rate limiting
  RATE_LIMIT: {
    PUBLIC: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    },
    AUTH: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5 // limit each IP to 5 login attempts per windowMs
    },
    API: {
      windowMs: 60 * 1000, // 1 minute
      max: 60 // limit each IP to 60 requests per minute
    },
    ADMIN: {
      windowMs: 60 * 1000, // 1 minute
      max: 120 // limit each admin to 120 requests per minute
    }
  },

  // Log levels
  LOG_LEVELS: {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    HTTP: 'http',
    DEBUG: 'debug'
  },

  // Environment
  ENVIRONMENTS: {
    DEVELOPMENT: 'development',
    TESTING: 'testing',
    STAGING: 'staging',
    PRODUCTION: 'production'
  }
};

// Freeze constants to prevent modifications
Object.freeze(constants);

module.exports = constants;