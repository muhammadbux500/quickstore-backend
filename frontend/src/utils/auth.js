import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';

// Token keys
const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

// Cookie options
const cookieOptions = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
};

// Auth utilities
export const auth = {
  // Set tokens
  setTokens: (token, refreshToken) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      Cookies.set(TOKEN_KEY, token, cookieOptions);
    }
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      Cookies.set(REFRESH_TOKEN_KEY, refreshToken, cookieOptions);
    }
  },

  // Get token
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY) || Cookies.get(TOKEN_KEY);
  },

  // Get refresh token
  getRefreshToken: () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY) || Cookies.get(REFRESH_TOKEN_KEY);
  },

  // Set user
  setUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    Cookies.set(USER_KEY, JSON.stringify(user), cookieOptions);
  },

  // Get user
  getUser: () => {
    const userStr = localStorage.getItem(USER_KEY) || Cookies.get(USER_KEY);
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  // Update user
  updateUser: (updates) => {
    const currentUser = auth.getUser();
    const updatedUser = { ...currentUser, ...updates };
    auth.setUser(updatedUser);
    return updatedUser;
  },

  // Check if token is expired
  isTokenExpired: (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp < Date.now() / 1000;
    } catch {
      return true;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = auth.getToken();
    return token && !auth.isTokenExpired(token);
  },

  // Check if user has role
  hasRole: (role) => {
    const user = auth.getUser();
    return user?.role === role;
  },

  // Check if user has permission
  hasPermission: (permission) => {
    const user = auth.getUser();
    return user?.permissions?.includes(permission) || user?.role === 'admin';
  },

  // Get user role
  getUserRole: () => {
    const user = auth.getUser();
    return user?.role || 'guest';
  },

  // Get user permissions
  getUserPermissions: () => {
    const user = auth.getUser();
    return user?.permissions || [];
  },

  // Login
  login: async (email, password) => {
    try {
      const response = await apiService.auth.login({ email, password });
      const { token, refreshToken, user } = response.data;
      
      auth.setTokens(token, refreshToken);
      auth.setUser(user);
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Signup
  signup: async (userData) => {
    try {
      const response = await apiService.auth.signup(userData);
      const { token, refreshToken, user } = response.data;
      
      auth.setTokens(token, refreshToken);
      auth.setUser(user);
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Logout
  logout: async () => {
    try {
      await apiService.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      auth.clearAuth();
    }
  },

  // Clear auth data
  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    
    Cookies.remove(TOKEN_KEY, { path: '/' });
    Cookies.remove(REFRESH_TOKEN_KEY, { path: '/' });
    Cookies.remove(USER_KEY, { path: '/' });
  },

  // Refresh token
  refreshToken: async () => {
    const refreshToken = auth.getRefreshToken();
    if (!refreshToken) {
      return { success: false };
    }

    try {
      const response = await apiService.auth.refresh(refreshToken);
      const { token, refreshToken: newRefreshToken } = response.data;
      
      auth.setTokens(token, newRefreshToken);
      
      return { success: true, token };
    } catch (error) {
      auth.clearAuth();
      return { success: false, error: error.message };
    }
  },

  // Verify email
  verifyEmail: async (token) => {
    try {
      const response = await apiService.auth.verifyEmail(token);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      await apiService.auth.forgotPassword(email);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Reset password
  resetPassword: async (token, password) => {
    try {
      await apiService.auth.resetPassword(token, password);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update profile
  updateProfile: async (data) => {
    try {
      const response = await apiService.user.updateProfile(data);
      const { user } = response.data;
      
      auth.updateUser(user);
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update password
  updatePassword: async (currentPassword, newPassword) => {
    try {
      await apiService.user.updatePassword({ currentPassword, newPassword });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Upload avatar
  uploadAvatar: async (file) => {
    try {
      const response = await apiService.user.uploadAvatar(file);
      const { avatarUrl } = response.data;
      
      auth.updateUser({ avatar: avatarUrl });
      
      return { success: true, avatarUrl };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get auth headers
  getAuthHeaders: () => {
    const token = auth.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  // Get token info
  getTokenInfo: () => {
    const token = auth.getToken();
    if (!token) return null;
    
    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  },

  // Initialize auth from cookies
  initAuth: () => {
    const token = Cookies.get(TOKEN_KEY);
    const refreshToken = Cookies.get(REFRESH_TOKEN_KEY);
    const userStr = Cookies.get(USER_KEY);

    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } catch (e) {
        console.error('Failed to parse user from cookie');
      }
    }
  },

  // Check auth status
  checkAuth: () => {
    const token = auth.getToken();
    if (!token) return false;
    
    if (auth.isTokenExpired(token)) {
      auth.refreshToken();
      return false;
    }
    
    return true;
  },
};

// Auth middleware for Next.js
export const authMiddleware = (context) => {
  const { req, res } = context;
  
  // Get token from cookie
  const token = req.cookies[TOKEN_KEY];
  
  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp < Date.now() / 1000) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
  } catch {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return { props: {} };
};

// Admin middleware
export const adminMiddleware = (context) => {
  const { req } = context;
  
  const token = req.cookies[TOKEN_KEY];
  const userStr = req.cookies[USER_KEY];

  if (!token || !userStr) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    const user = JSON.parse(userStr);
    if (user.role !== 'admin') {
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false,
        },
      };
    }
  } catch {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return { props: {} };
};

// Export auth hooks
export const useAuth = () => {
  return auth;
};

// Export default
export default auth;