import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const RecentOrders = () => {
  const orders = [
    {
      id: '#ORD-001',
      customer: 'John Smith',
      date: '2024-01-15',
      total: '$234.50',
      status: 'delivered',
      items: 3,
      payment: 'paid'
    },
    {
      id: '#ORD-002',
      customer: 'Emma Wilson',
      date: '2024-01-15',
      total: '$89.99',
      status: 'processing',
      items: 1,
      payment: 'paid'
    },
    {
      id: '#ORD-003',
      customer: 'Michael Brown',
      date: '2024-01-14',
      total: '$567.30',
      status: 'pending',
      items: 5,
      payment: 'pending'
    },
    {
      id: '#ORD-004',
      customer: 'Sarah Davis',
      date: '2024-01-14',
      total: '$145.00',
      status: 'shipped',
      items: 2,
      payment: 'paid'
    },
    {
      id: '#ORD-005',
      customer: 'Robert Johnson',
      date: '2024-01-13',
      total: '$789.20',
      status: 'delivered',
      items: 4,
      payment: 'paid'
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'processing':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'shipped':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Orders
        </h2>
        <Link 
          href="/dashboard/orders"
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center"
        >
          View All Orders
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              <th className="pb-3 font-medium">Order ID</th>
              <th className="pb-3 font-medium">Customer</th>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Items</th>
              <th className="pb-3 font-medium">Total</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Payment</th>
              <th className="pb-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="py-3 text-sm font-medium text-gray-900 dark:text-white">
                  {order.id}
                </td>
                <td className="py-3 text-sm text-gray-700 dark:text-gray-300">
                  {order.customer}
                </td>
                <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                  {new Date(order.date).toLocaleDateString()}
                </td>
                <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                  {order.items} items
                </td>
                <td className="py-3 text-sm font-medium text-gray-900 dark:text-white">
                  {order.total}
                </td>
                <td className="py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td className="py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    order.payment === 'paid' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {order.payment.charAt(0).toUpperCase() + order.payment.slice(1)}
                  </span>
                </td>
                <td className="py-3">
                  <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium">
                    View
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Total Orders</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">$3,456</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Revenue</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Pending</p>
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;