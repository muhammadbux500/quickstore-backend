import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add timestamp to prevent caching (optional)
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await api.post('/auth/refresh', {
            refreshToken,
          });
          
          const { token } = response.data;
          localStorage.setItem('token', token);
          
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
      return Promise.reject({ message: 'Network error. Please check your connection.' });
    } else {
      // Something else happened
      console.error('Error:', error.message);
      return Promise.reject({ message: 'An unexpected error occurred.' });
    }
  }
);

// API Methods
export const apiMethods = {
  // Auth endpoints
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    signup: (userData) => api.post('/auth/signup', userData),
    logout: () => api.post('/auth/logout'),
    refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
    verifyEmail: (token) => api.post('/auth/verify-email', { token }),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  },

  // User endpoints
  user: {
    getProfile: () => api.get('/user/profile'),
    updateProfile: (data) => api.put('/user/profile', data),
    updatePassword: (data) => api.put('/user/password', data),
    uploadAvatar: (file) => {
      const formData = new FormData();
      formData.append('avatar', file);
      return api.post('/user/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    getNotifications: () => api.get('/user/notifications'),
    markNotificationRead: (id) => api.put(`/user/notifications/${id}/read`),
  },

  // Store endpoints
  store: {
    getStore: (storeId) => api.get(`/stores/${storeId}`),
    createStore: (data) => api.post('/stores', data),
    updateStore: (storeId, data) => api.put(`/stores/${storeId}`, data),
    deleteStore: (storeId) => api.delete(`/stores/${storeId}`),
    getStoreSettings: (storeId) => api.get(`/stores/${storeId}/settings`),
    updateStoreSettings: (storeId, settings) => api.put(`/stores/${storeId}/settings`, settings),
    getStoreAnalytics: (storeId, timeframe) => api.get(`/stores/${storeId}/analytics`, { params: { timeframe } }),
  },

  // Product endpoints
  product: {
    getProducts: (storeId, params) => api.get(`/stores/${storeId}/products`, { params }),
    getProduct: (storeId, productId) => api.get(`/stores/${storeId}/products/${productId}`),
    createProduct: (storeId, data) => api.post(`/stores/${storeId}/products`, data),
    updateProduct: (storeId, productId, data) => api.put(`/stores/${storeId}/products/${productId}`, data),
    deleteProduct: (storeId, productId) => api.delete(`/stores/${storeId}/products/${productId}`),
    bulkUpdateProducts: (storeId, updates) => api.post(`/stores/${storeId}/products/bulk`, updates),
    getCategories: (storeId) => api.get(`/stores/${storeId}/categories`),
    createCategory: (storeId, data) => api.post(`/stores/${storeId}/categories`, data),
    updateCategory: (storeId, categoryId, data) => api.put(`/stores/${storeId}/categories/${categoryId}`, data),
    deleteCategory: (storeId, categoryId) => api.delete(`/stores/${storeId}/categories/${categoryId}`),
  },

  // Order endpoints
  order: {
    getOrders: (storeId, params) => api.get(`/stores/${storeId}/orders`, { params }),
    getOrder: (storeId, orderId) => api.get(`/stores/${storeId}/orders/${orderId}`),
    updateOrderStatus: (storeId, orderId, status) => api.put(`/stores/${storeId}/orders/${orderId}/status`, { status }),
    updatePaymentStatus: (storeId, orderId, status) => api.put(`/stores/${storeId}/orders/${orderId}/payment`, { status }),
    getOrderInvoice: (storeId, orderId) => api.get(`/stores/${storeId}/orders/${orderId}/invoice`),
    createRefund: (storeId, orderId, data) => api.post(`/stores/${storeId}/orders/${orderId}/refund`, data),
  },

  // Affiliate endpoints
  affiliate: {
    getDashboard: () => api.get('/affiliate/dashboard'),
    getCommissions: (params) => api.get('/affiliate/commissions', { params }),
    getReferralLinks: () => api.get('/affiliate/links'),
    createReferralLink: (data) => api.post('/affiliate/links', data),
    getPayouts: () => api.get('/affiliate/payouts'),
    requestPayout: (data) => api.post('/affiliate/payouts', data),
    getStats: (timeframe) => api.get('/affiliate/stats', { params: { timeframe } }),
  },

  // Admin endpoints
  admin: {
    getUsers: (params) => api.get('/admin/users', { params }),
    getUser: (userId) => api.get(`/admin/users/${userId}`),
    updateUser: (userId, data) => api.put(`/admin/users/${userId}`, data),
    deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
    getStores: (params) => api.get('/admin/stores', { params }),
    getStore: (storeId) => api.get(`/admin/stores/${storeId}`),
    updateStore: (storeId, data) => api.put(`/admin/stores/${storeId}`, data),
    suspendStore: (storeId) => api.post(`/admin/stores/${storeId}/suspend`),
    approveStore: (storeId) => api.post(`/admin/stores/${storeId}/approve`),
    getRevenueAnalytics: (timeframe) => api.get('/admin/analytics/revenue', { params: { timeframe } }),
    getSystemStats: () => api.get('/admin/stats'),
  },

  // Theme endpoints
  theme: {
    getThemes: () => api.get('/themes'),
    getTheme: (themeId) => api.get(`/themes/${themeId}`),
    installTheme: (storeId, themeId) => api.post(`/stores/${storeId}/themes`, { themeId }),
    customizeTheme: (storeId, customizations) => api.put(`/stores/${storeId}/theme`, customizations),
  },

  // AI endpoints
  ai: {
    generateStore: (prompt) => api.post('/ai/generate-store', { prompt }),
    generateProductDescription: (productData) => api.post('/ai/generate-description', productData),
    generateSEOTags: (content) => api.post('/ai/generate-seo', { content }),
    generateImage: (prompt) => api.post('/ai/generate-image', { prompt }),
    analyzeStore: (storeId) => api.post(`/ai/analyze/${storeId}`),
  },

  // Social media endpoints
  social: {
    connectAccount: (platform, data) => api.post('/social/connect', { platform, ...data }),
    disconnectAccount: (platform) => api.delete(`/social/${platform}`),
    getConnectedAccounts: () => api.get('/social/accounts'),
    autoPost: (data) => api.post('/social/auto-post', data),
    schedulePost: (data) => api.post('/social/schedule', data),
    getScheduledPosts: () => api.get('/social/scheduled'),
  },

  // SEO endpoints
  seo: {
    getSEOSettings: (storeId) => api.get(`/stores/${storeId}/seo`),
    updateSEOSettings: (storeId, settings) => api.put(`/stores/${storeId}/seo`, settings),
    generateSitemap: (storeId) => api.post(`/stores/${storeId}/sitemap`),
    analyzeSEO: (storeId) => api.get(`/stores/${storeId}/seo/analyze`),
  },

  // WhatsApp endpoints
  whatsapp: {
    connect: (phoneNumber) => api.post('/whatsapp/connect', { phoneNumber }),
    disconnect: () => api.delete('/whatsapp/disconnect'),
    getSettings: () => api.get('/whatsapp/settings'),
    updateSettings: (settings) => api.put('/whatsapp/settings', settings),
    sendTestMessage: (phoneNumber) => api.post('/whatsapp/test', { phoneNumber }),
  },

  // Analytics endpoints
  analytics: {
    getDashboardStats: (storeId) => api.get(`/analytics/${storeId}/dashboard`),
    getSalesReport: (storeId, params) => api.get(`/analytics/${storeId}/sales`, { params }),
    getTrafficReport: (storeId, params) => api.get(`/analytics/${storeId}/traffic`, { params }),
    getCustomerReport: (storeId, params) => api.get(`/analytics/${storeId}/customers`, { params }),
    exportReport: (storeId, type, format) => api.get(`/analytics/${storeId}/export/${type}`, { 
      params: { format },
      responseType: 'blob',
    }),
  },

  // Payment endpoints
  payment: {
    getPaymentMethods: () => api.get('/payment/methods'),
    connectPayment: (method, data) => api.post('/payment/connect', { method, ...data }),
    disconnectPayment: (method) => api.delete(`/payment/${method}`),
    getTransactions: (params) => api.get('/payment/transactions', { params }),
    getTransaction: (transactionId) => api.get(`/payment/transactions/${transactionId}`),
    createPayout: (data) => api.post('/payment/payouts', data),
  },

  // Subscription endpoints
  subscription: {
    getPlans: () => api.get('/subscription/plans'),
    getCurrentPlan: () => api.get('/subscription/current'),
    changePlan: (planId) => api.post('/subscription/change', { planId }),
    cancelSubscription: () => api.post('/subscription/cancel'),
    reactivateSubscription: () => api.post('/subscription/reactivate'),
    getInvoices: () => api.get('/subscription/invoices'),
    downloadInvoice: (invoiceId) => api.get(`/subscription/invoices/${invoiceId}/download`, {
      responseType: 'blob',
    }),
  },

  // Upload endpoints
  upload: {
    uploadImage: (file, folder) => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);
      return api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    uploadMultipleImages: (files, folder) => {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));
      formData.append('folder', folder);
      return api.post('/upload/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    deleteImage: (url) => api.post('/upload/delete', { url }),
  },

  // Search endpoints
  search: {
    searchProducts: (query, params) => api.get('/search/products', { params: { q: query, ...params } }),
    searchStores: (query) => api.get('/search/stores', { params: { q: query } }),
    getSuggestions: (query) => api.get('/search/suggestions', { params: { q: query } }),
  },
};

// Export API functions
export const apiService = apiMethods;

// Export API hooks
export const useApi = () => {
  return apiService;
};

// Export default
export default api;