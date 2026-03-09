import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/utils/api';
import { useAuth } from './useAuth';
import { useRouter } from 'next/router';

export const useStore = (storeId = null) => {
  const { user, getToken } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [store, setStore] = useState(null);
  const [stores, setStores] = useState([]);
  const [settings, setSettings] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  // Fetch store by ID
  const fetchStore = useCallback(async (id) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.store.getStore(id);
      setStore(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user's stores
  const fetchUserStores = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.store.getUserStores(user.id);
      setStores(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create store
  const createStore = async (storeData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.store.createStore(storeData);
      const newStore = response.data;
      
      setStores(prev => [...prev, newStore]);
      setStore(newStore);
      
      return { success: true, store: newStore };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Update store
  const updateStore = async (id, storeData) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.store.updateStore(id, storeData);
      const updatedStore = response.data;
      
      setStore(updatedStore);
      setStores(prev => prev.map(s => s.id === id ? updatedStore : s));
      
      return { success: true, store: updatedStore };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete store
  const deleteStore = async (id) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await apiService.store.deleteStore(id);
      
      setStores(prev => prev.filter(s => s.id !== id));
      if (store?.id === id) {
        setStore(null);
        router.push('/dashboard');
      }
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Fetch store settings
  const fetchSettings = useCallback(async (id) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.store.getStoreSettings(id);
      setSettings(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update store settings
  const updateSettings = async (id, settingsData) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.store.updateStoreSettings(id, settingsData);
      setSettings(response.data);
      return { success: true, settings: response.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Fetch store analytics
  const fetchAnalytics = useCallback(async (id, timeframe = 'month') => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.store.getStoreAnalytics(id, { timeframe });
      setAnalytics(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get store URL
  const getStoreUrl = (store) => {
    if (!store) return '';
    return store.customDomain || `${store.slug}.quickstore.com`;
  };

  // Check if store is active
  const isStoreActive = (store) => {
    return store?.status === 'active';
  };

  // Check if store is suspended
  const isStoreSuspended = (store) => {
    return store?.status === 'suspended';
  };

  // Check if store is pending
  const isStorePending = (store) => {
    return store?.status === 'pending';
  };

  // Get store plan
  const getStorePlan = (store) => {
    return store?.plan || 'starter';
  };

  // Get store features based on plan
  const getStoreFeatures = (store) => {
    const plan = getStorePlan(store);
    
    const features = {
      starter: {
        products: 100,
        storage: '5GB',
        bandwidth: '10GB',
        teamMembers: 1,
        customDomain: false,
        analytics: 'basic',
      },
      professional: {
        products: 1000,
        storage: '50GB',
        bandwidth: '100GB',
        teamMembers: 5,
        customDomain: true,
        analytics: 'advanced',
      },
      enterprise: {
        products: 'unlimited',
        storage: '500GB',
        bandwidth: '1TB',
        teamMembers: 'unlimited',
        customDomain: true,
        analytics: 'premium',
      },
    };
    
    return features[plan] || features.starter;
  };

  // Get store usage
  const getStoreUsage = (store) => {
    if (!store) return null;
    
    const features = getStoreFeatures(store);
    
    return {
      products: {
        used: store.products || 0,
        total: features.products === 'unlimited' ? '∞' : features.products,
        percentage: features.products !== 'unlimited' 
          ? (store.products / features.products) * 100 
          : 0,
      },
      storage: {
        used: store.storageUsed || '0GB',
        total: features.storage,
        percentage: 0, // Calculate based on actual storage
      },
    };
  };

  // Initialize
  useEffect(() => {
    if (storeId) {
      fetchStore(storeId);
      fetchSettings(storeId);
      fetchAnalytics(storeId);
    } else if (user) {
      fetchUserStores();
    }
  }, [storeId, user, fetchStore, fetchSettings, fetchAnalytics, fetchUserStores]);

  return {
    // State
    store,
    stores,
    settings,
    analytics,
    loading,
    error,
    
    // Actions
    fetchStore,
    fetchUserStores,
    createStore,
    updateStore,
    deleteStore,
    fetchSettings,
    updateSettings,
    fetchAnalytics,
    
    // Utilities
    getStoreUrl,
    isStoreActive,
    isStoreSuspended,
    isStorePending,
    getStorePlan,
    getStoreFeatures,
    getStoreUsage,
    
    // Current store helpers
    currentStoreUrl: store ? getStoreUrl(store) : '',
    currentStoreActive: store ? isStoreActive(store) : false,
    currentStorePlan: store ? getStorePlan(store) : 'starter',
    currentStoreFeatures: store ? getStoreFeatures(store) : null,
    currentStoreUsage: store ? getStoreUsage(store) : null,
  };
};

// Hook for store products
export const useStoreProducts = (storeId) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });

  const fetchProducts = useCallback(async (params = {}) => {
    if (!storeId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.product.getProducts(storeId, params);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
      return response.data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  const createProduct = async (productData) => {
    if (!storeId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.product.createProduct(storeId, productData);
      setProducts(prev => [response.data, ...prev]);
      return { success: true, product: response.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId, productData) => {
    if (!storeId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.product.updateProduct(storeId, productId, productData);
      setProducts(prev => prev.map(p => p.id === productId ? response.data : p));
      return { success: true, product: response.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (!storeId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await apiService.product.deleteProduct(storeId, productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};

// Hook for store orders
export const useStoreOrders = (storeId) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });

  const fetchOrders = useCallback(async (params = {}) => {
    if (!storeId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.order.getOrders(storeId, params);
      setOrders(response.data.orders);
      setPagination(response.data.pagination);
      return response.data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  const updateOrderStatus = async (orderId, status) => {
    if (!storeId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.order.updateOrderStatus(storeId, orderId, status);
      setOrders(prev => prev.map(o => o.id === orderId ? response.data : o));
      return { success: true, order: response.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    orders,
    loading,
    error,
    pagination,
    fetchOrders,
    updateOrderStatus,
  };
};

export default useStore;