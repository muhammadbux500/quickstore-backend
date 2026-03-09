// ==================== App Constants ====================

// App Information
export const APP_NAME = 'QuickStore';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'AI-Powered E-commerce Platform';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://quickstore.com';
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ==================== User Roles ====================

export const USER_ROLES = {
  ADMIN: 'admin',
  STORE_OWNER: 'store_owner',
  AFFILIATE: 'affiliate',
  CUSTOMER: 'customer',
};

export const USER_ROLES_LABELS = {
  [USER_ROLES.ADMIN]: 'Admin',
  [USER_ROLES.STORE_OWNER]: 'Store Owner',
  [USER_ROLES.AFFILIATE]: 'Affiliate',
  [USER_ROLES.CUSTOMER]: 'Customer',
};

// ==================== Subscription Plans ====================

export const SUBSCRIPTION_PLANS = {
  STARTER: 'starter',
  PROFESSIONAL: 'professional',
  ENTERPRISE: 'enterprise',
  AFFILIATE: 'affiliate',
};

export const PLAN_LIMITS = {
  [SUBSCRIPTION_PLANS.STARTER]: {
    name: 'Starter',
    price: 29,
    currency: 'USD',
    interval: 'month',
    products: 100,
    storage: 5 * 1024 * 1024 * 1024, // 5GB in bytes
    bandwidth: 10 * 1024 * 1024 * 1024, // 10GB in bytes
    teamMembers: 1,
    stores: 1,
    customDomain: false,
    analytics: 'basic',
    support: 'email',
    features: [
      'Up to 100 products',
      '5GB storage',
      '10GB bandwidth',
      '1 team member',
      '1 store',
      'Basic analytics',
      'Email support',
    ],
  },
  [SUBSCRIPTION_PLANS.PROFESSIONAL]: {
    name: 'Professional',
    price: 79,
    currency: 'USD',
    interval: 'month',
    products: 1000,
    storage: 50 * 1024 * 1024 * 1024, // 50GB in bytes
    bandwidth: 100 * 1024 * 1024 * 1024, // 100GB in bytes
    teamMembers: 5,
    stores: 3,
    customDomain: true,
    analytics: 'advanced',
    support: 'priority',
    features: [
      'Up to 1000 products',
      '50GB storage',
      '100GB bandwidth',
      '5 team members',
      '3 stores',
      'Custom domain',
      'Advanced analytics',
      'Priority support',
    ],
  },
  [SUBSCRIPTION_PLANS.ENTERPRISE]: {
    name: 'Enterprise',
    price: 199,
    currency: 'USD',
    interval: 'month',
    products: -1, // Unlimited
    storage: 500 * 1024 * 1024 * 1024, // 500GB in bytes
    bandwidth: 1024 * 1024 * 1024 * 1024, // 1TB in bytes
    teamMembers: -1, // Unlimited
    stores: -1, // Unlimited
    customDomain: true,
    analytics: 'premium',
    support: '24/7',
    features: [
      'Unlimited products',
      '500GB storage',
      '1TB bandwidth',
      'Unlimited team members',
      'Unlimited stores',
      'Custom domain',
      'Premium analytics',
      '24/7 phone & email support',
      'SLA guarantee',
    ],
  },
  [SUBSCRIPTION_PLANS.AFFILIATE]: {
    name: 'Affiliate',
    price: 0,
    currency: 'USD',
    interval: 'month',
    commission: 15, // 15%
    minPayout: 50,
    payoutMethods: ['paypal', 'bank_transfer'],
    features: [
      '15% commission on sales',
      '$50 minimum payout',
      'Real-time tracking',
      'Marketing materials',
      'Dedicated affiliate dashboard',
    ],
  },
};

// ==================== Order Status ====================

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Pending',
  [ORDER_STATUS.PROCESSING]: 'Processing',
  [ORDER_STATUS.SHIPPED]: 'Shipped',
  [ORDER_STATUS.DELIVERED]: 'Delivered',
  [ORDER_STATUS.CANCELLED]: 'Cancelled',
  [ORDER_STATUS.REFUNDED]: 'Refunded',
};

export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: 'warning',
  [ORDER_STATUS.PROCESSING]: 'info',
  [ORDER_STATUS.SHIPPED]: 'primary',
  [ORDER_STATUS.DELIVERED]: 'success',
  [ORDER_STATUS.CANCELLED]: 'error',
  [ORDER_STATUS.REFUNDED]: 'error',
};

// ==================== Payment Status ====================

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded',
};

export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.PENDING]: 'Pending',
  [PAYMENT_STATUS.PAID]: 'Paid',
  [PAYMENT_STATUS.FAILED]: 'Failed',
  [PAYMENT_STATUS.REFUNDED]: 'Refunded',
  [PAYMENT_STATUS.PARTIALLY_REFUNDED]: 'Partially Refunded',
};

export const PAYMENT_STATUS_COLORS = {
  [PAYMENT_STATUS.PENDING]: 'warning',
  [PAYMENT_STATUS.PAID]: 'success',
  [PAYMENT_STATUS.FAILED]: 'error',
  [PAYMENT_STATUS.REFUNDED]: 'error',
  [PAYMENT_STATUS.PARTIALLY_REFUNDED]: 'warning',
};

// ==================== Payment Methods ====================

export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  PAYPAL: 'paypal',
  BANK_TRANSFER: 'bank_transfer',
  STRIPE: 'stripe',
};

export const PAYMENT_METHODS_LABELS = {
  [PAYMENT_METHODS.CREDIT_CARD]: 'Credit Card',
  [PAYMENT_METHODS.PAYPAL]: 'PayPal',
  [PAYMENT_METHODS.BANK_TRANSFER]: 'Bank Transfer',
  [PAYMENT_METHODS.STRIPE]: 'Stripe',
};

// ==================== Shipping Status ====================

export const SHIPPING_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  IN_TRANSIT: 'in_transit',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  RETURNED: 'returned',
};

export const SHIPPING_STATUS_LABELS = {
  [SHIPPING_STATUS.PENDING]: 'Pending',
  [SHIPPING_STATUS.PROCESSING]: 'Processing',
  [SHIPPING_STATUS.SHIPPED]: 'Shipped',
  [SHIPPING_STATUS.IN_TRANSIT]: 'In Transit',
  [SHIPPING_STATUS.OUT_FOR_DELIVERY]: 'Out for Delivery',
  [SHIPPING_STATUS.DELIVERED]: 'Delivered',
  [SHIPPING_STATUS.RETURNED]: 'Returned',
};

// ==================== Product Status ====================

export const PRODUCT_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  ARCHIVED: 'archived',
  OUT_OF_STOCK: 'out_of_stock',
};

export const PRODUCT_STATUS_LABELS = {
  [PRODUCT_STATUS.DRAFT]: 'Draft',
  [PRODUCT_STATUS.ACTIVE]: 'Active',
  [PRODUCT_STATUS.ARCHIVED]: 'Archived',
  [PRODUCT_STATUS.OUT_OF_STOCK]: 'Out of Stock',
};

// ==================== Store Status ====================

export const STORE_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  CLOSED: 'closed',
};

export const STORE_STATUS_LABELS = {
  [STORE_STATUS.PENDING]: 'Pending',
  [STORE_STATUS.ACTIVE]: 'Active',
  [STORE_STATUS.SUSPENDED]: 'Suspended',
  [STORE_STATUS.CLOSED]: 'Closed',
};

// ==================== Affiliate Status ====================

export const AFFILIATE_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  BANNED: 'banned',
};

export const AFFILIATE_TIERS = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
};

export const AFFILIATE_TIERS_LABELS = {
  [AFFILIATE_TIERS.BRONZE]: 'Bronze',
  [AFFILIATE_TIERS.SILVER]: 'Silver',
  [AFFILIATE_TIERS.GOLD]: 'Gold',
  [AFFILIATE_TIERS.PLATINUM]: 'Platinum',
};

export const AFFILIATE_TIERS_COMMISSION = {
  [AFFILIATE_TIERS.BRONZE]: 10,
  [AFFILIATE_TIERS.SILVER]: 12,
  [AFFILIATE_TIERS.GOLD]: 15,
  [AFFILIATE_TIERS.PLATINUM]: 20,
};

// ==================== Timeframes ====================

export const TIMEFRAMES = {
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
  ALL_TIME: 'all_time',
};

export const TIMEFRAMES_LABELS = {
  [TIMEFRAMES.TODAY]: 'Today',
  [TIMEFRAMES.YESTERDAY]: 'Yesterday',
  [TIMEFRAMES.THIS_WEEK]: 'This Week',
  [TIMEFRAMES.LAST_WEEK]: 'Last Week',
  [TIMEFRAMES.THIS_MONTH]: 'This Month',
  [TIMEFRAMES.LAST_MONTH]: 'Last Month',
  [TIMEFRAMES.THIS_QUARTER]: 'This Quarter',
  [TIMEFRAMES.LAST_QUARTER]: 'Last Quarter',
  [TIMEFRAMES.THIS_YEAR]: 'This Year',
  [TIMEFRAMES.LAST_YEAR]: 'Last Year',
  [TIMEFRAMES.ALL_TIME]: 'All Time',
};

// ==================== Currencies ====================

export const CURRENCIES = {
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
  CAD: 'CAD',
  AUD: 'AUD',
  JPY: 'JPY',
  CNY: 'CNY',
  INR: 'INR',
};

export const CURRENCIES_SYMBOLS = {
  [CURRENCIES.USD]: '$',
  [CURRENCIES.EUR]: '€',
  [CURRENCIES.GBP]: '£',
  [CURRENCIES.CAD]: 'C$',
  [CURRENCIES.AUD]: 'A$',
  [CURRENCIES.JPY]: '¥',
  [CURRENCIES.CNY]: '¥',
  [CURRENCIES.INR]: '₹',
};

// ==================== Languages ====================

export const LANGUAGES = {
  EN: 'en',
  ES: 'es',
  FR: 'fr',
  DE: 'de',
  IT: 'it',
  PT: 'pt',
  RU: 'ru',
  ZH: 'zh',
  JA: 'ja',
  AR: 'ar',
};

export const LANGUAGES_LABELS = {
  [LANGUAGES.EN]: 'English',
  [LANGUAGES.ES]: 'Español',
  [LANGUAGES.FR]: 'Français',
  [LANGUAGES.DE]: 'Deutsch',
  [LANGUAGES.IT]: 'Italiano',
  [LANGUAGES.PT]: 'Português',
  [LANGUAGES.RU]: 'Русский',
  [LANGUAGES.ZH]: '中文',
  [LANGUAGES.JA]: '日本語',
  [LANGUAGES.AR]: 'العربية',
};

// ==================== Countries ====================

export const COUNTRIES = {
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
  IN: 'IN',
  BR: 'BR',
  MX: 'MX',
  AE: 'AE',
  SA: 'SA',
};

export const COUNTRIES_LABELS = {
  [COUNTRIES.US]: 'United States',
  [COUNTRIES.GB]: 'United Kingdom',
  [COUNTRIES.CA]: 'Canada',
  [COUNTRIES.AU]: 'Australia',
  [COUNTRIES.DE]: 'Germany',
  [COUNTRIES.FR]: 'France',
  [COUNTRIES.IT]: 'Italy',
  [COUNTRIES.ES]: 'Spain',
  [COUNTRIES.JP]: 'Japan',
  [COUNTRIES.CN]: 'China',
  [COUNTRIES.IN]: 'India',
  [COUNTRIES.BR]: 'Brazil',
  [COUNTRIES.MX]: 'Mexico',
  [COUNTRIES.AE]: 'United Arab Emirates',
  [COUNTRIES.SA]: 'Saudi Arabia',
};

// ==================== Validation Rules ====================

export const VALIDATION_RULES = {
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
};

// ==================== Regex Patterns ====================

export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
  URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  STORE_URL: /^[a-z0-9-]{3,30}$/,
  SKU: /^[A-Z0-9-]{3,20}$/,
  ZIP_CODE: /^\d{5}(-\d{4})?$/,
  CREDIT_CARD: /^\d{4}-\d{4}-\d{4}-\d{4}$/,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  SLUG: /^[a-z0-9-]+$/,
};

// ==================== File Upload ====================

export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  ALLOWED_DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ALLOWED_VIDEOS: ['video/mp4', 'video/webm', 'video/ogg'],
  MAX_FILES: 10,
};

// ==================== Pagination ====================

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMIT_OPTIONS: [10, 25, 50, 100],
  MAX_LIMIT: 100,
};

// ==================== Cache Keys ====================

export const CACHE_KEYS = {
  USER: 'user',
  STORE: 'store',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  CATEGORIES: 'categories',
  SETTINGS: 'settings',
  THEME: 'theme',
};

// ==================== Event Names ====================

export const EVENTS = {
  // Auth events
  LOGIN: 'auth:login',
  LOGOUT: 'auth:logout',
  SIGNUP: 'auth:signup',
  PROFILE_UPDATED: 'auth:profile_updated',
  
  // Store events
  STORE_CREATED: 'store:created',
  STORE_UPDATED: 'store:updated',
  STORE_DELETED: 'store:deleted',
  
  // Product events
  PRODUCT_CREATED: 'product:created',
  PRODUCT_UPDATED: 'product:updated',
  PRODUCT_DELETED: 'product:deleted',
  
  // Order events
  ORDER_CREATED: 'order:created',
  ORDER_UPDATED: 'order:updated',
  ORDER_STATUS_CHANGED: 'order:status_changed',
  
  // Notification events
  NOTIFICATION_RECEIVED: 'notification:received',
  NOTIFICATION_READ: 'notification:read',
};

// ==================== Error Messages ====================

export const ERROR_MESSAGES = {
  // Auth errors
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  USER_NOT_FOUND: 'User not found',
  INVALID_TOKEN: 'Invalid or expired token',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'You do not have permission to perform this action',
  
  // Validation errors
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_URL: 'Please enter a valid URL',
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`,
  PASSWORD_TOO_LONG: `Password must be less than ${VALIDATION_RULES.PASSWORD_MAX_LENGTH} characters`,
  PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
  
  // Store errors
  STORE_NOT_FOUND: 'Store not found',
  STORE_URL_TAKEN: 'This store URL is already taken',
  STORE_LIMIT_REACHED: 'You have reached the maximum number of stores for your plan',
  
  // Product errors
  PRODUCT_NOT_FOUND: 'Product not found',
  PRODUCT_LIMIT_REACHED: 'You have reached the maximum number of products for your plan',
  
  // Order errors
  ORDER_NOT_FOUND: 'Order not found',
  
  // File upload errors
  FILE_TOO_LARGE: `File size must be less than ${FILE_UPLOAD.MAX_SIZE / (1024 * 1024)}MB`,
  INVALID_FILE_TYPE: 'Invalid file type',
  TOO_MANY_FILES: `You can only upload up to ${FILE_UPLOAD.MAX_FILES} files`,
  
  // Payment errors
  PAYMENT_FAILED: 'Payment failed. Please try again',
  INVALID_PAYMENT_METHOD: 'Invalid payment method',
  
  // Server errors
  SERVER_ERROR: 'Something went wrong. Please try again later',
  NETWORK_ERROR: 'Network error. Please check your connection',
};

// ==================== Success Messages ====================

export const SUCCESS_MESSAGES = {
  // Auth success
  LOGIN_SUCCESS: 'Successfully logged in',
  LOGOUT_SUCCESS: 'Successfully logged out',
  SIGNUP_SUCCESS: 'Account created successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_UPDATED: 'Password updated successfully',
  AVATAR_UPLOADED: 'Avatar uploaded successfully',
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
  ORDER_UPDATED: 'Order updated successfully',
  
  // File upload success
  FILE_UPLOADED: 'File uploaded successfully',
};

// ==================== Local Storage Keys ====================

export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
  CART: 'cart',
  SETTINGS: 'settings',
};

// ==================== Cookie Names ====================

export const COOKIE_NAMES = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
};

// ==================== API Endpoints ====================

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // User endpoints
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PASSWORD: '/user/password',
    AVATAR: '/user/avatar',
    NOTIFICATIONS: '/user/notifications',
  },
  
  // Store endpoints
  STORE: {
    BASE: '/stores',
    SETTINGS: '/stores/:id/settings',
    ANALYTICS: '/stores/:id/analytics',
  },
  
  // Product endpoints
  PRODUCT: {
    BASE: '/stores/:storeId/products',
    CATEGORIES: '/stores/:storeId/categories',
  },
  
  // Order endpoints
  ORDER: {
    BASE: '/stores/:storeId/orders',
    INVOICE: '/stores/:storeId/orders/:id/invoice',
  },
  
  // Affiliate endpoints
  AFFILIATE: {
    DASHBOARD: '/affiliate/dashboard',
    COMMISSIONS: '/affiliate/commissions',
    LINKS: '/affiliate/links',
    PAYOUTS: '/affiliate/payouts',
  },
  
  // Admin endpoints
  ADMIN: {
    USERS: '/admin/users',
    STORES: '/admin/stores',
    ANALYTICS: '/admin/analytics',
    STATS: '/admin/stats',
  },
  
  // AI endpoints
  AI: {
    GENERATE_STORE: '/ai/generate-store',
    GENERATE_DESCRIPTION: '/ai/generate-description',
    GENERATE_SEO: '/ai/generate-seo',
    GENERATE_IMAGE: '/ai/generate-image',
    ANALYZE: '/ai/analyze/:id',
  },
};

// ==================== Social Platforms ====================

export const SOCIAL_PLATFORMS = {
  FACEBOOK: 'facebook',
  INSTAGRAM: 'instagram',
  TWITTER: 'twitter',
  PINTEREST: 'pinterest',
  LINKEDIN: 'linkedin',
  YOUTUBE: 'youtube',
  TIKTOK: 'tiktok',
};

export const SOCIAL_PLATFORMS_LABELS = {
  [SOCIAL_PLATFORMS.FACEBOOK]: 'Facebook',
  [SOCIAL_PLATFORMS.INSTAGRAM]: 'Instagram',
  [SOCIAL_PLATFORMS.TWITTER]: 'Twitter',
  [SOCIAL_PLATFORMS.PINTEREST]: 'Pinterest',
  [SOCIAL_PLATFORMS.LINKEDIN]: 'LinkedIn',
  [SOCIAL_PLATFORMS.YOUTUBE]: 'YouTube',
  [SOCIAL_PLATFORMS.TIKTOK]: 'TikTok',
};

// ==================== Analytics Events ====================

export const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'page_view',
  PRODUCT_VIEW: 'product_view',
  PRODUCT_CLICK: 'product_click',
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  BEGIN_CHECKOUT: 'begin_checkout',
  PURCHASE: 'purchase',
  SEARCH: 'search',
  SIGNUP: 'signup',
  LOGIN: 'login',
  SHARE: 'share',
};

// Export all constants
export default {
  APP_NAME,
  APP_VERSION,
  APP_DESCRIPTION,
  APP_URL,
  API_URL,
  
  USER_ROLES,
  USER_ROLES_LABELS,
  
  SUBSCRIPTION_PLANS,
  PLAN_LIMITS,
  
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  
  PAYMENT_STATUS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
  
  PAYMENT_METHODS,
  PAYMENT_METHODS_LABELS,
  
  SHIPPING_STATUS,
  SHIPPING_STATUS_LABELS,
  
  PRODUCT_STATUS,
  PRODUCT_STATUS_LABELS,
  
  STORE_STATUS,
  STORE_STATUS_LABELS,
  
  AFFILIATE_STATUS,
  AFFILIATE_TIERS,
  AFFILIATE_TIERS_LABELS,
  AFFILIATE_TIERS_COMMISSION,
  
  TIMEFRAMES,
  TIMEFRAMES_LABELS,
  
  CURRENCIES,
  CURRENCIES_SYMBOLS,
  
  LANGUAGES,
  LANGUAGES_LABELS,
  
  COUNTRIES,
  COUNTRIES_LABELS,
  
  VALIDATION_RULES,
  REGEX_PATTERNS,
  
  FILE_UPLOAD,
  PAGINATION,
  
  CACHE_KEYS,
  EVENTS,
  
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  
  STORAGE_KEYS,
  COOKIE_NAMES,
  
  API_ENDPOINTS,
  
  SOCIAL_PLATFORMS,
  SOCIAL_PLATFORMS_LABELS,
  
  ANALYTICS_EVENTS,
};