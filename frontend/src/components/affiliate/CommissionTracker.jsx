import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import Button from '../common/Button';

const CommissionTracker = () => {
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('month');

  const commissions = {
    summary: {
      totalEarned: 3456.78,
      pending: 456.50,
      paid: 3000.28,
      projected: 523.75,
      nextPayout: 456.50,
      payoutDate: '2024-02-01'
    },
    tiers: [
      { name: 'Bronze', rate: 10, minEarnings: 0, maxEarnings: 1000, color: 'from-amber-600 to-amber-700' },
      { name: 'Silver', rate: 12, minEarnings: 1000, maxEarnings: 5000, color: 'from-gray-400 to-gray-500' },
      { name: 'Gold', rate: 15, minEarnings: 5000, maxEarnings: 10000, color: 'from-yellow-500 to-yellow-600' },
      { name: 'Platinum', rate: 20, minEarnings: 10000, maxEarnings: null, color: 'from-blue-500 to-purple-600' }
    ],
    transactions: [
      {
        id: 'TRX-001',
        date: '2024-01-15T10:30:00',
        type: 'commission',
        description: 'Sale: Wireless Headphones',
        amount: 14.99,
        status: 'pending',
        orderId: '#ORD-2024-001',
        customer: 'John Smith'
      },
      {
        id: 'TRX-002',
        date: '2024-01-15T09:15:00',
        type: 'commission',
        description: 'Sale: Smart Watch',
        amount: 29.99,
        status: 'pending',
        orderId: '#ORD-2024-002',
        customer: 'Emma Wilson'
      },
      {
        id: 'TRX-003',
        date: '2024-01-14T16:45:00',
        type: 'commission',
        description: 'Sale: Leather Wallet',
        amount: 7.49,
        status: 'paid',
        orderId: '#ORD-2024-003',
        customer: 'Michael Brown'
      },
      {
        id: 'TRX-004',
        date: '2024-01-14T14:20:00',
        type: 'bonus',
        description: 'Monthly Performance Bonus',
        amount: 50.00,
        status: 'paid',
        orderId: null,
        customer: null
      },
      {
        id: 'TRX-005',
        date: '2024-01-13T11:30:00',
        type: 'commission',
        description: 'Sale: Running Shoes',
        amount: 11.99,
        status: 'paid',
        orderId: '#ORD-2024-004',
        customer: 'Sarah Davis'
      },
      {
        id: 'TRX-006',
        date: '2024-01-13T10:00:00',
        type: 'commission',
        description: 'Sale: Backpack',
        amount: 8.99,
        status: 'paid',
        orderId: '#ORD-2024-005',
        customer: 'Robert Johnson'
      },
      {
        id: 'TRX-007',
        date: '2024-01-12T15:40:00',
        type: 'withdrawal',
        description: 'Payout to Bank Account',
        amount: -500.00,
        status: 'completed',
        orderId: null,
        customer: null
      },
      {
        id: 'TRX-008',
        date: '2024-01-12T09:30:00',
        type: 'commission',
        description: 'Sale: Phone Case',
        amount: 3.74,
        status: 'paid',
        orderId: '#ORD-2024-006',
        customer: 'Lisa Anderson'
      }
    ],
    monthlyHistory: [
      { month: 'Jan', earnings: 456.50 },
      { month: 'Feb', earnings: 523.75 },
      { month: 'Mar', earnings: 489.20 },
      { month: 'Apr', earnings: 612.80 },
      { month: 'May', earnings: 578.30 },
      { month: 'Jun', earnings: 654.90 },
      { month: 'Jul', earnings: 589.40 },
      { month: 'Aug', earnings: 623.70 },
      { month: 'Sep', earnings: 567.80 },
      { month: 'Oct', earnings: 598.60 },
      { month: 'Nov', earnings: 645.30 },
      { month: 'Dec', earnings: 789.50 }
    ]
  };

  const filters = [
    { id: 'all', label: 'All Transactions' },
    { id: 'commission', label: 'Commissions' },
    { id: 'bonus', label: 'Bonuses' },
    { id: 'withdrawal', label: 'Withdrawals' },
    { id: 'pending', label: 'Pending' },
    { id: 'paid', label: 'Paid' }
  ];

  const dateRanges = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' },
    { id: 'year', label: 'This Year' },
    { id: 'all', label: 'All Time' }
  ];

  const filteredTransactions = commissions.transactions.filter(trx => {
    if (filter === 'all') return true;
    if (filter === 'pending' || filter === 'paid') return trx.status === filter;
    return trx.type === filter;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid':
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'commission':
        return '💰';
      case 'bonus':
        return '🎁';
      case 'withdrawal':
        return '💳';
      default:
        return '📝';
    }
  };

  const calculateTier = (earnings) => {
    for (let i = commissions.tiers.length - 1; i >= 0; i--) {
      const tier = commissions.tiers[i];
      if (!tier.maxEarnings || earnings >= tier.minEarnings) {
        return tier;
      }
    }
    return commissions.tiers[0];
  };

  const currentTier = calculateTier(commissions.summary.totalEarned);
  const nextTier = commissions.tiers[commissions.tiers.indexOf(currentTier) + 1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Commission Tracker
        </h1>
        <Button variant="primary">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Request Payout
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <p className="text-sm opacity-90 mb-1">Total Earned</p>
          <p className="text-3xl font-bold">${commissions.summary.totalEarned}</p>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <p className="text-sm opacity-90 mb-1">Pending</p>
          <p className="text-3xl font-bold">${commissions.summary.pending}</p>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <p className="text-sm opacity-90 mb-1">Paid</p>
          <p className="text-3xl font-bold">${commissions.summary.paid}</p>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <p className="text-sm opacity-90 mb-1">Projected</p>
          <p className="text-3xl font-bold">${commissions.summary.projected}</p>
        </Card>
      </div>

      {/* Next Payout & Tier Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Payout */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Next Payout
          </h2>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                ${commissions.summary.nextPayout}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Estimated payout date: {new Date(commissions.summary.payoutDate).toLocaleDateString()}
              </p>
            </div>
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="primary" size="sm" className="flex-1">
              Request Early Payout
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              Payout Settings
            </Button>
          </div>
        </Card>

        {/* Tier Progress */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tier Progress
          </h2>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${currentTier.color} text-white`}>
                {currentTier.name} Tier ({currentTier.rate}% Commission)
              </span>
            </div>
            {nextTier && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Next: {nextTier.name} ({nextTier.rate}%)
              </p>
            )}
          </div>
          
          {nextTier && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Progress to {nextTier.name}</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  ${commissions.summary.totalEarned} / ${nextTier.minEarnings}
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r ${currentTier.color}`}
                  style={{ width: `${(commissions.summary.totalEarned / nextTier.minEarnings) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">
                Need ${(nextTier.minEarnings - commissions.summary.totalEarned).toFixed(2)} more to reach {nextTier.name} tier
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Monthly Earnings Chart */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Monthly Earnings
          </h2>
          <select className="px-3 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
            <option>2024</option>
            <option>2023</option>
            <option>2022</option>
          </select>
        </div>
        <div className="h-48 flex items-end space-x-2">
          {commissions.monthlyHistory.map((month, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(month.earnings / 1000) * 100}%` }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="w-full bg-gradient-to-t from-blue-500 to-purple-600 rounded-t-lg relative group"
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  ${month.earnings}
                </div>
              </motion.div>
              <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">{month.month}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Transactions Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Transaction History
          </h2>
          <div className="flex space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
            >
              {filters.map(f => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
            >
              {dateRanges.map(range => (
                <option key={range.id} value={range.id}>{range.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3">Date</th>
                <th className="pb-3">Description</th>
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(transaction.date).toLocaleDateString()}
                    <br />
                    <span className="text-xs">
                      {new Date(transaction.date).toLocaleTimeString()}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{getTypeIcon(transaction.type)}</span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {transaction.description}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                    {transaction.orderId || '-'}
                  </td>
                  <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                    {transaction.customer || '-'}
                  </td>
                  <td className="py-3">
                    <span className="text-xs capitalize px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                      {transaction.type}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`text-sm font-medium ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing 1-8 of 24 transactions
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

      {/* Commission Rules */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-3">
          Commission Rules
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium text-blue-800 dark:text-blue-300">Standard Commission</p>
            <p className="text-blue-700 dark:text-blue-400">15% on all products</p>
          </div>
          <div>
            <p className="font-medium text-blue-800 dark:text-blue-300">Cookie Duration</p>
            <p className="text-blue-700 dark:text-blue-400">30 days</p>
          </div>
          <div>
            <p className="font-medium text-blue-800 dark:text-blue-300">Minimum Payout</p>
            <p className="text-blue-700 dark:text-blue-400">$50</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CommissionTracker;