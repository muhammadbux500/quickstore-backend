import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../common/Card';
import Button from '../common/Button';

const UserManagement = () => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const users = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      role: 'store_owner',
      status: 'active',
      stores: 2,
      plan: 'professional',
      joined: '2024-01-15',
      lastActive: '2024-01-20T10:30:00',
      revenue: 3456.78,
      avatar: 'JS',
      subscription: {
        plan: 'Professional',
        amount: 79,
        billing: 'monthly',
        nextBilling: '2024-02-15'
      }
    },
    {
      id: 2,
      name: 'Emma Wilson',
      email: 'emma.w@email.com',
      role: 'store_owner',
      status: 'active',
      stores: 1,
      plan: 'starter',
      joined: '2024-01-10',
      lastActive: '2024-01-19T15:45:00',
      revenue: 1234.50,
      avatar: 'EW',
      subscription: {
        plan: 'Starter',
        amount: 29,
        billing: 'monthly',
        nextBilling: '2024-02-10'
      }
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael.b@email.com',
      role: 'store_owner',
      status: 'suspended',
      stores: 1,
      plan: 'starter',
      joined: '2024-01-05',
      lastActive: '2024-01-18T09:15:00',
      revenue: 567.30,
      avatar: 'MB',
      subscription: {
        plan: 'Starter',
        amount: 29,
        billing: 'monthly',
        nextBilling: '2024-02-05'
      }
    },
    {
      id: 4,
      name: 'Sarah Davis',
      email: 'sarah.d@email.com',
      role: 'store_owner',
      status: 'active',
      stores: 3,
      plan: 'enterprise',
      joined: '2024-01-01',
      lastActive: '2024-01-20T11:20:00',
      revenue: 7890.45,
      avatar: 'SD',
      subscription: {
        plan: 'Enterprise',
        amount: 199,
        billing: 'annual',
        nextBilling: '2025-01-01'
      }
    },
    {
      id: 5,
      name: 'Robert Johnson',
      email: 'robert.j@email.com',
      role: 'affiliate',
      status: 'active',
      stores: 0,
      plan: 'affiliate',
      joined: '2024-01-12',
      lastActive: '2024-01-19T14:30:00',
      revenue: 2345.67,
      avatar: 'RJ',
      commission: 15,
      earnings: 345.67
    },
    {
      id: 6,
      name: 'Lisa Anderson',
      email: 'lisa.a@email.com',
      role: 'admin',
      status: 'active',
      stores: 0,
      plan: 'internal',
      joined: '2023-12-01',
      lastActive: '2024-01-20T09:45:00',
      revenue: 0,
      avatar: 'LA',
      permissions: ['full_access']
    },
    {
      id: 7,
      name: 'David Lee',
      email: 'david.lee@email.com',
      role: 'store_owner',
      status: 'pending',
      stores: 1,
      plan: 'starter',
      joined: '2024-01-19',
      lastActive: '2024-01-19T16:20:00',
      revenue: 0,
      avatar: 'DL',
      subscription: null
    },
    {
      id: 8,
      name: 'Jennifer Taylor',
      email: 'jennifer.t@email.com',
      role: 'store_owner',
      status: 'active',
      stores: 2,
      plan: 'professional',
      joined: '2024-01-08',
      lastActive: '2024-01-20T08:15:00',
      revenue: 2345.89,
      avatar: 'JT',
      subscription: {
        plan: 'Professional',
        amount: 79,
        billing: 'monthly',
        nextBilling: '2024-02-08'
      }
    }
  ];

  const roles = [
    { id: 'all', label: 'All Roles' },
    { id: 'store_owner', label: 'Store Owners' },
    { id: 'affiliate', label: 'Affiliates' },
    { id: 'admin', label: 'Admins' }
  ];

  const statuses = [
    { id: 'all', label: 'All Status' },
    { id: 'active', label: 'Active' },
    { id: 'pending', label: 'Pending' },
    { id: 'suspended', label: 'Suspended' }
  ];

  const plans = [
    { id: 'all', label: 'All Plans' },
    { id: 'starter', label: 'Starter' },
    { id: 'professional', label: 'Professional' },
    { id: 'enterprise', label: 'Enterprise' },
    { id: 'affiliate', label: 'Affiliate' }
  ];

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    pending: users.filter(u => u.status === 'pending').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    storeOwners: users.filter(u => u.role === 'store_owner').length,
    affiliates: users.filter(u => u.role === 'affiliate').length,
    revenue: users.reduce((sum, u) => sum + (u.revenue || 0), 0).toFixed(2)
  };

  const filteredUsers = users.filter(user => {
    if (filter !== 'all' && user.role !== filter && user.status !== filter) return false;
    if (searchTerm && !user.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !user.email.toLowerCase().includes(searchTerm.toLowerCase())) return false;
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

  const getRoleBadge = (role) => {
    switch(role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'store_owner':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'affiliate':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const toggleSelectUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(uId => uId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const selectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          User Management
        </h1>
        <div className="flex space-x-3">
          <Button variant="outline">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Users
          </Button>
          <Button variant="primary" onClick={() => setShowUserModal(true)}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Total Users</p>
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
          <p className="text-2xl font-bold text-blue-600">{stats.storeOwners}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Store Owners</p>
        </Card>
        <Card className="p-4 text-center bg-gradient-to-r from-blue-500 to-purple-600">
          <p className="text-2xl font-bold text-white">${stats.revenue}</p>
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
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
            />
          </div>

          {/* Role Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
          >
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.label}</option>
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

          {/* Plan Filter */}
          <select
            className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
          >
            {plans.map(plan => (
              <option key={plan.id} value={plan.id}>{plan.label}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-center justify-between"
        >
          <span className="text-sm text-blue-700 dark:text-blue-300">
            {selectedUsers.length} user(s) selected
          </span>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
              Update Role
            </button>
            <button className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
              Send Email
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

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 pl-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={selectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="pb-3">User</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Plan</th>
                <th className="pb-3">Stores</th>
                <th className="pb-3">Revenue</th>
                <th className="pb-3">Joined</th>
                <th className="pb-3">Last Active</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-3 pl-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleSelectUser(user.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                          {user.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${getRoleBadge(user.role)}`}>
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {user.plan}
                      </p>
                      {user.subscription && (
                        <p className="text-xs text-gray-500">
                          ${user.subscription.amount}/{user.subscription.billing}
                        </p>
                      )}
                    </td>
                    <td className="py-3 text-sm text-gray-900 dark:text-white">
                      {user.stores}
                    </td>
                    <td className="py-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        ${user.revenue?.toFixed(2) || '0.00'}
                      </p>
                      {user.role === 'affiliate' && (
                        <p className="text-xs text-green-600">Commission: ${user.earnings}</p>
                      )}
                    </td>
                    <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(user.joined).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(user.lastActive).toLocaleDateString()}
                      <br />
                      <span className="text-xs">
                        {new Date(user.lastActive).toLocaleTimeString()}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                          className="p-1 text-blue-600 hover:text-blue-700"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button className="p-1 text-green-600 hover:text-green-700" title="Impersonate">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </button>
                        <button className="p-1 text-red-600 hover:text-red-700" title="Delete">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
            Showing 1-8 of 24 users
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

      {/* User Modal */}
      {showUserModal && (
        <UserModal
          user={selectedUser}
          onClose={() => {
            setShowUserModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

// User Modal Component
const UserModal = ({ user, onClose }) => {
  const [formData, setFormData] = useState(user || {
    name: '',
    email: '',
    role: 'store_owner',
    status: 'active',
    plan: 'starter'
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Card>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {user ? 'Edit User' : 'Add New User'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
              />
            </div>

            {!user && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <option value="store_owner">Store Owner</option>
                  <option value="affiliate">Affiliate</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            {formData.role === 'store_owner' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subscription Plan
                </label>
                <select
                  value={formData.plan}
                  onChange={(e) => setFormData({...formData, plan: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <option value="starter">Starter ($29/mo)</option>
                  <option value="professional">Professional ($79/mo)</option>
                  <option value="enterprise">Enterprise ($199/mo)</option>
                </select>
              </div>
            )}

            {formData.role === 'affiliate' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Commission Rate (%)
                </label>
                <input
                  type="number"
                  value={formData.commission || 15}
                  onChange={(e) => setFormData({...formData, commission: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                />
              </div>
            )}
          </div>

          <div className="flex space-x-3 mt-6">
            <Button variant="primary" fullWidth>
              {user ? 'Update User' : 'Create User'}
            </Button>
            <Button variant="outline" fullWidth onClick={onClose}>
              Cancel
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default UserManagement;