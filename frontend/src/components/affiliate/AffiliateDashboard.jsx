import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import Button from '../common/Button';

const AffiliateDashboard = () => {
  const [timeframe, setTimeframe] = useState('month');
  const [showReferralLink, setShowReferralLink] = useState(false);

  const affiliate = {
    id: 'AFF-12345',
    name: 'John Doe',
    email: 'john.doe@email.com',
    status: 'active',
    tier: 'Gold',
    commissionRate: 15,
    joinDate: '2023-06-15',
    totalEarned: 3456.78,
    pendingCommissions: 456.50,
    paidCommissions: 3000.28,
    clicks: 12345,
    conversions: 1234,
    conversionRate: 10,
    averageOrderValue: 78.50,
    topProducts: [
      { name: 'Wireless Headphones', sales: 45, commission: 675.00 },
      { name: 'Smart Watch', sales: 32, commission: 640.00 },
      { name: 'Leather Wallet', sales: 28, commission: 420.00 }
    ],
    recentActivities: [
      { type: 'click', date: '2024-01-15T10:30:00', description: 'Clicked on product link' },
      { type: 'conversion', date: '2024-01-15T09:15:00', description: 'Sale completed - $89.99' },
      { type: 'commission', date: '2024-01-14T16:45:00', description: 'Commission earned: $13.50' }
    ],
    referralLinks: {
      main: 'https://quickstore.com/ref/AFF-12345',
      facebook: 'https://quickstore.com/ref/AFF-12345?source=facebook',
      instagram: 'https://quickstore.com/ref/AFF-12345?source=instagram',
      twitter: 'https://quickstore.com/ref/AFF-12345?source=twitter',
      email: 'https://quickstore.com/ref/AFF-12345?source=email'
    }
  };

  const stats = [
    {
      title: 'Total Earned',
      value: `$${affiliate.totalEarned}`,
      change: '+15.3%',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Pending',
      value: `$${affiliate.pendingCommissions}`,
      change: '+5.2%',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      title: 'Clicks',
      value: affiliate.clicks.toLocaleString(),
      change: '+22.1%',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Conversions',
      value: affiliate.conversions,
      change: '+8.7%',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const performanceMetrics = [
    { label: 'Conversion Rate', value: `${affiliate.conversionRate}%`, target: '12%', status: 'below' },
    { label: 'Average Order Value', value: `$${affiliate.averageOrderValue}`, target: '$85', status: 'above' },
    { label: 'Click-through Rate', value: '3.2%', target: '3.5%', status: 'below' },
    { label: 'Commission Rate', value: `${affiliate.commissionRate}%`, target: '15%', status: 'on-target' }
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Show toast notification
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Affiliate Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {affiliate.name}! Track your earnings and performance.
          </p>
        </div>
        <div className="flex space-x-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
          <Button variant="primary" onClick={() => setShowReferralLink(true)}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Get Referral Links
          </Button>
        </div>
      </div>

      {/* Affiliate Status Card */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">Your Affiliate ID</p>
            <p className="text-2xl font-bold mb-2">{affiliate.id}</p>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm ${
                affiliate.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
              }`}>
                {affiliate.status}
              </span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                {affiliate.tier} Tier
              </span>
              <span className="text-sm">
                {affiliate.commissionRate}% Commission
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90 mb-1">Member Since</p>
            <p className="text-xl font-bold">{new Date(affiliate.joinDate).toLocaleDateString()}</p>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-2">{stat.change}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Performance & Top Products */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Metrics */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Performance Metrics
            </h2>
            <div className="space-y-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {metric.value}
                      </span>
                      <span className="text-xs text-gray-500">Target: {metric.target}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        metric.status === 'above' ? 'bg-green-100 text-green-700' :
                        metric.status === 'below' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {metric.status}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        metric.status === 'above' ? 'bg-green-500' :
                        metric.status === 'below' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(parseFloat(metric.value) / parseFloat(metric.target) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Performing Products */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Top Performing Products
            </h2>
            <div className="space-y-3">
              {affiliate.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">${product.commission}</p>
                    <p className="text-xs text-gray-500">Commission</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Recent Activity & Quick Links */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {affiliate.recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.type === 'conversion' ? 'bg-green-100 text-green-600' :
                    activity.type === 'click' ? 'bg-blue-100 text-blue-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {activity.type === 'conversion' ? '💰' :
                     activity.type === 'click' ? '👆' : '💵'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">{activity.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.date).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" fullWidth className="mt-4">
              View All Activity
            </Button>
          </Card>

          {/* Quick Links */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h2>
            <div className="space-y-2">
              <Button variant="outline" fullWidth className="justify-start">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Marketing Materials
              </Button>
              <Button variant="outline" fullWidth className="justify-start">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                Promo Codes
              </Button>
              <Button variant="outline" fullWidth className="justify-start">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Payout History
              </Button>
              <Button variant="outline" fullWidth className="justify-start">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Referral Links Modal */}
      {showReferralLink && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => setShowReferralLink(false)}
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
                Your Referral Links
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Share these links to earn commissions. Each link is tagged to track your referrals.
              </p>

              <div className="space-y-4">
                {Object.entries(affiliate.referralLinks).map(([source, link]) => (
                  <div key={source} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {source} Link
                      </span>
                      <button
                        onClick={() => copyToClipboard(link)}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{link}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex space-x-3">
                <Button variant="primary" fullWidth onClick={() => copyToClipboard(affiliate.referralLinks.main)}>
                  Copy Main Link
                </Button>
                <Button variant="outline" fullWidth onClick={() => setShowReferralLink(false)}>
                  Close
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AffiliateDashboard;