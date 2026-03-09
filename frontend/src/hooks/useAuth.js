import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '@/context/AuthContext';
import { auth } from '@/utils/auth';
import { apiService } from '@/utils/api';

export const useAuth = () => {
  const context = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, setUser, isAuthenticated, setIsAuthenticated } = context;

  // Login
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await auth.login(email, password);
      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        setError(response.error);
        return { success: false, error: response.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Signup
  const signup = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await auth.signup(userData);
      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        setError(response.error);
        return { success: false, error: response.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    
    try {
      await auth.logout();
      setUser(null);
      setIsAuthenticated(false);
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await auth.updateProfile(data);
      if (response.success) {
        setUser(response.user);
        return { success: true, user: response.user };
      } else {
        setError(response.error);
        return { success: false, error: response.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const updatePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await auth.updatePassword(currentPassword, newPassword);
      if (response.success) {
        return { success: true };
      } else {
        setError(response.error);
        return { success: false, error: response.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Upload avatar
  const uploadAvatar = async (file) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await auth.uploadAvatar(file);
      if (response.success) {
        setUser(prev => ({ ...prev, avatar: response.avatarUrl }));
        return { success: true, avatarUrl: response.avatarUrl };
      } else {
        setError(response.error);
        return { success: false, error: response.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await auth.forgotPassword(email);
      if (response.success) {
        return { success: true };
      } else {
        setError(response.error);
        return { success: false, error: response.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await auth.resetPassword(token, password);
      if (response.success) {
        return { success: true };
      } else {
        setError(response.error);
        return { success: false, error: response.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Refresh token
  const refreshToken = async () => {
    try {
      const response = await auth.refreshToken();
      return response.success;
    } catch (err) {
      console.error('Token refresh error:', err);
      return false;
    }
  };

  // Check if user has role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user has permission
  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || user?.role === 'admin';
  };

  // Get user role
  const getUserRole = () => {
    return user?.role || 'guest';
  };

  // Get user permissions
  const getUserPermissions = () => {
    return user?.permissions || [];
  };

  // Get auth token
  const getToken = () => {
    return auth.getToken();
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const response = await apiService.user.getProfile();
      if (response.data) {
        setUser(response.data.user);
        auth.setUser(response.data.user);
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  return {
    // State
    user,
    loading,
    error,
    isAuthenticated,
    
    // Auth methods
    login,
    signup,
    logout,
    updateProfile,
    updatePassword,
    uploadAvatar,
    forgotPassword,
    resetPassword,
    refreshToken,
    refreshUser,
    
    // Permissions
    hasRole,
    hasPermission,
    getUserRole,
    getUserPermissions,
    
    // Token
    getToken,
  };
};

// Hook for protected routes
export const useRequireAuth = (redirectUrl = '/login') => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, loading, router, redirectUrl]);

  return { isAuthenticated, loading };
};

// Hook for role-based access
export const useRequireRole = (requiredRole, redirectUrl = '/dashboard') => {
  const { user, hasRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !hasRole(requiredRole))) {
      router.push(redirectUrl);
    }
  }, [user, loading, hasRole, requiredRole, router, redirectUrl]);

  return { user, hasRole: hasRole(requiredRole), loading };
};

// Hook for permission-based access
export const useRequirePermission = (requiredPermission, redirectUrl = '/dashboard') => {
  const { user, hasPermission, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !hasPermission(requiredPermission))) {
      router.push(redirectUrl);
    }
  }, [user, loading, hasPermission, requiredPermission, router, redirectUrl]);

  return { user, hasPermission: hasPermission(requiredPermission), loading };
};

export default useAuth;