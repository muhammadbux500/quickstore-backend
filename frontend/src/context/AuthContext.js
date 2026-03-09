import React, { createContext, useState, useEffect, useCallback } from 'react';
import { auth } from '@/utils/auth';
import { apiService } from '@/utils/api';
import { useRouter } from 'next/router';

// Create context
export const AuthContext = createContext();

// Initial state
const initialState = {
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
};

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  const router = useRouter();

  // Initialize auth state
  const initAuth = useCallback(async () => {
    try {
      // Check if user is authenticated
      const token = auth.getToken();
      
      if (!token) {
        setState(prev => ({ ...prev, loading: false }));
        return;
      }

      // Check if token is expired
      if (auth.isTokenExpired(token)) {
        // Try to refresh token
        const refreshed = await auth.refreshToken();
        if (!refreshed) {
          auth.clearAuth();
          setState(prev => ({ ...prev, loading: false }));
          return;
        }
      }

      // Get user from storage
      const user = auth.getUser();
      
      if (user) {
        setState({
          user,
          loading: false,
          error: null,
          isAuthenticated: true,
        });
      } else {
        // Fetch user from API
        const response = await apiService.user.getProfile();
        if (response.data) {
          const userData = response.data.user;
          auth.setUser(userData);
          setState({
            user: userData,
            loading: false,
            error: null,
            isAuthenticated: true,
          });
        } else {
          setState(prev => ({ ...prev, loading: false }));
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      auth.clearAuth();
      setState({
        user: null,
        loading: false,
        error: error.message,
        isAuthenticated: false,
      });
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Set user
  const setUser = useCallback((userData) => {
    setState(prev => ({
      ...prev,
      user: userData,
      isAuthenticated: !!userData,
    }));
  }, []);

  // Login
  const login = useCallback(async (email, password) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await auth.login(email, password);
      
      if (response.success) {
        setState({
          user: response.user,
          loading: false,
          error: null,
          isAuthenticated: true,
        });
        return { success: true };
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error,
        }));
        return { success: false, error: response.error };
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      return { success: false, error: error.message };
    }
  }, []);

  // Signup
  const signup = useCallback(async (userData) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await auth.signup(userData);
      
      if (response.success) {
        setState({
          user: response.user,
          loading: false,
          error: null,
          isAuthenticated: true,
        });
        return { success: true };
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error,
        }));
        return { success: false, error: response.error };
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      return { success: false, error: error.message };
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      await auth.logout();
      
      setState({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      });
      
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if API call fails
      auth.clearAuth();
      setState({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      });
      router.push('/login');
    }
  }, [router]);

  // Update user
  const updateUser = useCallback(async (userData) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await auth.updateProfile(userData);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          user: response.user,
          loading: false,
        }));
        return { success: true, user: response.user };
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error,
        }));
        return { success: false, error: response.error };
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      return { success: false, error: error.message };
    }
  }, []);

  // Update password
  const updatePassword = useCallback(async (currentPassword, newPassword) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await auth.updatePassword(currentPassword, newPassword);
      
      if (response.success) {
        setState(prev => ({ ...prev, loading: false }));
        return { success: true };
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error,
        }));
        return { success: false, error: response.error };
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      return { success: false, error: error.message };
    }
  }, []);

  // Upload avatar
  const uploadAvatar = useCallback(async (file) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await auth.uploadAvatar(file);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          user: { ...prev.user, avatar: response.avatarUrl },
          loading: false,
        }));
        return { success: true, avatarUrl: response.avatarUrl };
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error,
        }));
        return { success: false, error: response.error };
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      return { success: false, error: error.message };
    }
  }, []);

  // Forgot password
  const forgotPassword = useCallback(async (email) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await auth.forgotPassword(email);
      
      if (response.success) {
        setState(prev => ({ ...prev, loading: false }));
        return { success: true };
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error,
        }));
        return { success: false, error: response.error };
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      return { success: false, error: error.message };
    }
  }, []);

  // Reset password
  const resetPassword = useCallback(async (token, password) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await auth.resetPassword(token, password);
      
      if (response.success) {
        setState(prev => ({ ...prev, loading: false }));
        return { success: true };
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error,
        }));
        return { success: false, error: response.error };
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      return { success: false, error: error.message };
    }
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const response = await apiService.user.getProfile();
      if (response.data) {
        const userData = response.data.user;
        auth.setUser(userData);
        setState(prev => ({
          ...prev,
          user: userData,
        }));
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, []);

  // Check if user has role
  const hasRole = useCallback((role) => {
    return state.user?.role === role;
  }, [state.user]);

  // Check if user has permission
  const hasPermission = useCallback((permission) => {
    return state.user?.permissions?.includes(permission) || state.user?.role === 'admin';
  }, [state.user]);

  // Get user role
  const getUserRole = useCallback(() => {
    return state.user?.role || 'guest';
  }, [state.user]);

  // Get user permissions
  const getUserPermissions = useCallback(() => {
    return state.user?.permissions || [];
  }, [state.user]);

  // Get auth token
  const getToken = useCallback(() => {
    return auth.getToken();
  }, []);

  // Listen for storage events (for multi-tab synchronization)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        initAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [initAuth]);

  // Context value
  const value = {
    // State
    user: state.user,
    loading: state.loading,
    error: state.error,
    isAuthenticated: state.isAuthenticated,
    
    // Auth methods
    login,
    signup,
    logout,
    updateUser,
    updatePassword,
    uploadAvatar,
    forgotPassword,
    resetPassword,
    refreshUser,
    
    // Permissions
    hasRole,
    hasPermission,
    getUserRole,
    getUserPermissions,
    
    // Token
    getToken,
    
    // Setters (for internal use)
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;