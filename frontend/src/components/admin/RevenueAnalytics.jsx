import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../common/Card';
import Button from '../common/Button';

const StoreManagement = () => {
  const [selectedStores, setSelectedStores] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showStoreModal, setShowStoreModal] = useState(false);

  const stores = [
    {
      id: 1,
      name: 'Fashion Hub',
      owner: 'John Smith',
      ownerEmail: 'john.smith@email.com',
      domain: 'fashionhub.quickstore.com',
      customDomain: 'www.fashionhub.com',
      plan: 'professional',
      status: 'active',
      products: 156,
      orders: 234,
      revenue: 34567.89,
      joined: '2024-01-15',
      lastActive: '2024-01-20T10:30:00',
      theme: 'Fashion Pro',
      category: 'fashion'
    },
    {
      id: 2,
      name: 'Tech Gadgets',
      owner: 'Emma Wilson',
      ownerEmail: 'emma.w@email.com',
      domain: 'techgadgets.quickstore.com',
      customDomain: 'www.techgadgets.com',
      plan: 'starter',
      status: 'active',
      products: 89,
      orders: 156,
      revenue: 23456.78,
      joined: '2024-01-10',
      lastActive: '2024-01-19T15:45:00',
      theme: 'Electro',
      category: 'electronics'
    },
    {
      id: 3,
      name: 'Artisan Crafts',
      owner: 'Michael Brown',
      ownerEmail: 'michael.b@email.com',
      domain: 'artisancrafts.quickstore.com',
      customDomain: null,
      plan: 'starter',
      status: 'suspended',
      products: 45,
      orders: 67,
      revenue: 5678.90,
      joined: '2024-01-05',
      lastActive: '2024-01-18T09:15:00',
      theme: 'Handmade',
      category: 'handicrafts'
    },
    {
      id: 4,
      name: 'Home Decor',
      owner: 'Sarah Davis',
      ownerEmail: 'sarah.d@email.com',
      domain: 'homedecor.quickstore.com',
      customDomain: 'www.homedecor.com',
      plan: 'enterprise',
      status: 'active',
      products: 234,
      orders: 456,
      revenue: 67890.12,
      joined: '2024-01-01',
      lastActive: '2024-01-20T11:20:00',
      theme: 'Home Style',
      category: 'home'
    },
    {
      id: 5,
      name: 'Sports Gear',
      owner: 'Robert Johnson',
      ownerEmail: 'robert.j@email.com',
      domain: 'sportsgear.quickstore.com',
      customDomain: 'www.sportsgear.com',
      plan: 'professional',
      status: 'active',
      products: 123,
      orders: 189,
      revenue: 23456.78,
      joined: '2024-01-12',
      lastActive: '2024-01-19T14:30:00',
      theme: 'Sport Pro',
      category: 'sports'
    },
    {
      id: 6,
      name: 'Organic Market',
      owner: 'Lisa Anderson',
      ownerEmail: 'lisa.a@email.com',
      domain: 'organicmarket.quickstore.com',
      customDomain: null,
      plan: 'starter',
      status: 'pending',
      products: 34,
      orders: 12,
      revenue: 1234.56,
      joined: '2024-01-19',
      lastActive: '2024-01-19T16:20:00',
      theme: 'Organic',
      category: 'food'
    },
    {
      id: 7,
      name: 'Luxury Watches',
      owner: 'David Lee',
      ownerEmail: 'david.lee@email.com',
      domain: 'luxurywatches.quickstore.com',
      customDomain: 'www.luxurywatches.com',
      plan: 'enterprise',
      status: 'active',
      products: 67,
      orders: 89,
      revenue: 34567.89,
      joined: '2024-01-08',
      lastActive: '2024-01-20T08:15:00',
      theme: 'Luxury',
      category: 'jewelry'
    },
    {
      id: 8,
      name: 'Pet Supplies',
      owner: 'Jennifer Taylor',
      ownerEmail: 'jennifer.t@email.com',
      domain: 'petsupplies.quickstore.com',
      customDomain: null,
      plan: 'professional',
      status: 'active',
      products: 178,
      orders: 234,
      revenue: 12345.67,
      joined: '2024-01-09',
      lastActive: '2024-01-20T09:45:00',
      theme: 'Pets',
      category: 'pets'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'fashion', label: 'Fashion' },
    { id: 'electronics', label: 'Electronics' },
    { id: 'home', label: 'Home & Garden' },
    { id: 'sports', label: 'Sports' },
    { id: 'food', label: 'Food' },
    { id: 'jewelry', label: 'Jewelry' },
    { id: 'pets', label: 'Pets' }
  ];

  const plans = [
    { id: 'all', label: 'All Plans' },
    { id: 'starter', label: 'Starter' },
    { id: 'professional', label: 'Professional' },
    { id: 'enterprise', label: 'Enterprise' }
  ];

  const statuses = [
    { id: 'all', label: 'All Status' },
    { id: 'active', label: 'Active' },
    { id: 'pending', label: 'Pending' },
    { id: 'suspended', label: 'Suspended' }
  ];

  const stats = {
    total: stores.length,
    active: stores.filter(s => s.status === 'active').length,
    pending: stores.filter(s => s.status === 'pending').length,
    suspended: stores.filter(s => s.status === 'suspended').length,
    totalProducts: stores.reduce((sum, s) => sum + s.products, 0),
    totalOrders: stores.reduce((sum, s) => sum + s.orders, 0),
    totalRevenue: stores.reduce((sum, s) => sum + s.revenue, 0).toFixed(2)
  };

  const filteredStores = stores.filter(store => {
    if (filter !== 'all' && store.status !== filter && store.plan !== filter && store.category !== filter) return false;
    if (searchTerm && !store.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !store.owner.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'suspended':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getPlanBadge = (plan) => {
    switch(plan) {
      case 'enterprise':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'professional':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'starter':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const toggleSelectStore = (id) => {
    if (selectedStores.includes(id)) {
      setSelectedStores(selectedStores.filter(sId => sId !== id));
    } else {
      setSelectedStores([...selectedStores, id]);
    }
  };

  const selectAll = () => {
    if (selectedStores.length === filteredStores.length) {
      setSelectedStores([]);
    } else {
      setSelectedStores(filteredStores.map(s => s.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Store Management
        </h1>
        <div className="flex space-x-3">
          <Button variant="outline">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Stores
          </Button>
          <Button variant="primary" onClick={() => setShowStoreModal(true)}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Store
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Total Stores</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Active</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Pending</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{stats.suspended}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Suspended</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.totalProducts}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Products</p>
        </Card>
        <Card className="p-4 text-center bg-gradient-to-r from-blue-500 to-purple-600">
          <p className="text-2xl font-bold text-white">${stats.totalRevenue}</p>
          <p className="text-xs text-white opacity-90">Revenue</p>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <svg className="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search stores by name or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>

          {/* Plan Filter */}
          <select
            className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
          >
            {plans.map(plan => (
              <option key={plan.id} value={plan.id}>{plan.label}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
          >
            {statuses.map(status => (
              <option key={status.id} value={status.id}>{status.label}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedStores.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-center justify-between"
        >
          <span className="text-sm text-blue-700 dark:text-blue-300">
            {selectedStores.length} store(s) selected
          </span>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
              Update Plan
            </button>
            <button className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
              Send Notification
            </button>
            <button className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700">
              Change Status
            </button>
            <button className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">
              Suspend
            </button>
          </div>
        </motion.div>
      )}

      {/* Stores Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 pl-4">
                  <input
                    type="checkbox"
                    checked={selectedStores.length === filteredStores.length && filteredStores.length > 0}
                    onChange={selectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="pb-3">Store</th>
                <th className="pb-3">Owner</th>
                <th className="pb-3">Domain</th>
                <th className="pb-3">Plan</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Products</th>
                <th className="pb-3">Orders</th>
                <th className="pb-3">Revenue</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredStores.map((store, index) => (
                  <motion.tr
                    key={store.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-3 pl-4">
                      <input
                        type="checkbox"
                        checked={selectedStores.includes(store.id)}
                        onChange={() => toggleSelectStore(store.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {store.name}
                        </p>
                        <p className="text-xs text-gray-500">{store.category}</p>
                      </div>
                    </td>
                    <td className="py-3">
                      <p className="text-sm text-gray-900 dark:text-white">{store.owner}</p>
                      <p className="text-xs text-gray-500">{store.ownerEmail}</p>
                    </td>
                    <td className="py-3">
                      <p className="text-sm text-blue-600">{store.domain}</p>
                      {store.customDomain && (
                        <p className="text-xs text-gray-500">{store.customDomain}</p>
                      )}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${getPlanBadge(store.plan)}`}>
                        {store.plan}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(store.status)}`}>
                        {store.status}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-900 dark:text-white">
                      {store.products}
                    </td>
                    <td className="py-3 text-sm text-gray-900 dark:text-white">
                      {store.orders}
                    </td>
                    <td className="py-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        ${store.revenue.toFixed(2)}
                      </p>
                    </td>
                    <td className="py-3">
                      <div className="flex space-x-2">
                        <button className="p-1 text-blue-600 hover:text-blue-700" title="View Store">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button className="p-1 text-green-600 hover:text-green-700" title="Edit">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button className="p-1 text-purple-600 hover:text-purple-700" title="Analytics">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing 1-8 of 24 stores
          </p>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm">
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm">1</button>
            <button className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm">2</button>
            <button className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm">3</button>
            <button className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm">
              Next
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StoreManagement;