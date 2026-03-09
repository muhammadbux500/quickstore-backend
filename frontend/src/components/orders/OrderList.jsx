import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Card from '../common/Card';
import Button from '../common/Button';

const OrderList = () => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('today');

  const orders = [
    {
      id: '#ORD-2024-001',
      customer: {
        name: 'John Smith',
        email: 'john.smith@email.com',
        avatar: 'JS'
      },
      date: '2024-01-15T10:30:00',
      total: 234.50,
      items: 3,
      status: 'delivered',
      payment: 'paid',
      paymentMethod: 'Credit Card',
      shipping: 'delivered',
      fulfillment: 'completed'
    },
    {
      id: '#ORD-2024-002',
      customer: {
        name: 'Emma Wilson',
        email: 'emma.w@email.com',
        avatar: 'EW'
      },
      date: '2024-01-15T14:20:00',
      total: 89.99,
      items: 1,
      status: 'processing',
      payment: 'paid',
      paymentMethod: 'PayPal',
      shipping: 'processing',
      fulfillment: 'pending'
    },
    {
      id: '#ORD-2024-003',
      customer: {
        name: 'Michael Brown',
        email: 'michael.b@email.com',
        avatar: 'MB'
      },
      date: '2024-01-14T09:15:00',
      total: 567.30,
      items: 5,
      status: 'pending',
      payment: 'pending',
      paymentMethod: 'Bank Transfer',
      shipping: 'pending',
      fulfillment: 'pending'
    },
    {
      id: '#ORD-2024-004',
      customer: {
        name: 'Sarah Davis',
        email: 'sarah.d@email.com',
        avatar: 'SD'
      },
      date: '2024-01-14T16:45:00',
      total: 145.00,
      items: 2,
      status: 'shipped',
      payment: 'paid',
      paymentMethod: 'Credit Card',
      shipping: 'shipped',
      fulfillment: 'processing'
    },
    {
      id: '#ORD-2024-005',
      customer: {
        name: 'Robert Johnson',
        email: 'robert.j@email.com',
        avatar: 'RJ'
      },
      date: '2024-01-13T11:30:00',
      total: 789.20,
      items: 4,
      status: 'delivered',
      payment: 'paid',
      paymentMethod: 'PayPal',
      shipping: 'delivered',
      fulfillment: 'completed'
    },
    {
      id: '#ORD-2024-006',
      customer: {
        name: 'Lisa Anderson',
        email: 'lisa.a@email.com',
        avatar: 'LA'
      },
      date: '2024-01-13T13:20:00',
      total: 67.50,
      items: 2,
      status: 'cancelled',
      payment: 'refunded',
      paymentMethod: 'Credit Card',
      shipping: 'cancelled',
      fulfillment: 'cancelled'
    },
    {
      id: '#ORD-2024-007',
      customer: {
        name: 'David Lee',
        email: 'david.lee@email.com',
        avatar: 'DL'
      },
      date: '2024-01-12T10:00:00',
      total: 432.75,
      items: 3,
      status: 'processing',
      payment: 'paid',
      paymentMethod: 'Credit Card',
      shipping: 'processing',
      fulfillment: 'pending'
    },
    {
      id: '#ORD-2024-008',
      customer: {
        name: 'Jennifer Taylor',
        email: 'jennifer.t@email.com',
        avatar: 'JT'
      },
      date: '2024-01-12T15:40:00',
      total: 299.99,
      items: 2,
      status: 'shipped',
      payment: 'paid',
      paymentMethod: 'PayPal',
      shipping: 'shipped',
      fulfillment: 'processing'
    }
  ];

  const filters = [
    { id: 'all', label: 'All Orders', icon: '📦' },
    { id: 'pending', label: 'Pending', icon: '⏳' },
    { id: 'processing', label: 'Processing', icon: '⚙️' },
    { id: 'shipped', label: 'Shipped', icon: '🚚' },
    { id: 'delivered', label: 'Delivered', icon: '✅' },
    { id: 'cancelled', label: 'Cancelled', icon: '❌' }
  ];

  const dateRanges = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'custom', label: 'Custom Range' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      shipped: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      refunded: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
    };
    return colors[status] || colors.pending;
  };

  const getPaymentColor = (status) => {
    return status === 'paid' 
      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
  };

  const filteredOrders = orders.filter(order => {
    if (filter !== 'all' && order.status !== filter) return false;
    if (searchTerm && !order.id.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    revenue: orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)
  };

  const toggleSelectOrder = (id) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter(oId => oId !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  const selectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(o => o.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Orders
        </h1>
        <div className="flex space-x-3">
          <Button variant="outline">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </Button>
          <Button variant="primary">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Order
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Pending</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Processing</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{stats.shipped}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Shipped</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Delivered</p>
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
              placeholder="Search orders by ID or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filters.map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  filter === f.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <span className="mr-2">{f.icon}</span>
                {f.label}
              </button>
            ))}
          </div>

          {/* Date Range */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
          >
            {dateRanges.map(range => (
              <option key={range.id} value={range.id}>{range.label}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-center justify-between"
        >
          <span className="text-sm text-blue-700 dark:text-blue-300">
            {selectedOrders.length} order(s) selected
          </span>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
              Update Status
            </button>
            <button className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
              Print Labels
            </button>
            <button className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">
              Cancel Orders
            </button>
          </div>
        </motion.div>
      )}

      {/* Orders Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 pl-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={selectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Items</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Fulfillment</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredOrders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="py-3 pl-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleSelectOrder(order.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-3">
                      <Link href={`/dashboard/orders/${order.id}`} className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
                        {order.id}
                      </Link>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                          {order.customer.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {order.customer.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.customer.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(order.date).toLocaleDateString()}
                      <br />
                      <span className="text-xs">
                        {new Date(order.date).toLocaleTimeString()}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-900 dark:text-white">
                      {order.items}
                    </td>
                    <td className="py-3">
                      <p className="font-medium text-gray-900 dark:text-white">
                        ${order.total.toFixed(2)}
                      </p>
                    </td>
                    <td className="py-3">
                      <div className="space-y-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${getPaymentColor(order.payment)}`}>
                          {order.payment}
                        </span>
                        <p className="text-xs text-gray-500">{order.paymentMethod}</p>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.fulfillment)}`}>
                        {order.fulfillment}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex space-x-2">
                        <Link href={`/dashboard/orders/${order.id}`}>
                          <button className="p-1 text-blue-600 hover:text-blue-700" title="View">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </Link>
                        <button className="p-1 text-green-600 hover:text-green-700" title="Update Status">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                        <button className="p-1 text-purple-600 hover:text-purple-700" title="Print Invoice">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
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
            Showing 1-8 of 24 orders
          </p>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-500 text-white rounded-lg">1</button>
            <button className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">2</button>
            <button className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">3</button>
            <button className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">
              Next
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OrderList;