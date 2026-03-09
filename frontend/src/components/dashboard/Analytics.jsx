import React from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';

const Analytics = () => {
  const metrics = [
    { label: 'Page Views', value: '45,678', change: '+12%', icon: '👁️' },
    { label: 'Unique Visitors', value: '23,456', change: '+8%', icon: '👥' },
    { label: 'Bounce Rate', value: '34.5%', change: '-2%', icon: '📉' },
    { label: 'Avg. Session', value: '4m 23s', change: '+15s', icon: '⏱️' }
  ];

  const topProducts = [
    { name: 'Wireless Headphones', sales: 234, revenue: '$23,400', trend: 'up' },
    { name: 'Smart Watch', sales: 189, revenue: '$37,800', trend: 'up' },
    { name: 'Laptop Stand', sales: 156, revenue: '$7,800', trend: 'down' },
    { name: 'USB-C Hub', sales: 145, revenue: '$5,075', trend: 'up' },
    { name: 'Phone Case', sales: 134, revenue: '$2,680', trend: 'up' }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                  <p className={`text-sm mt-2 ${
                    metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change} vs last period
                  </p>
                </div>
                <span className="text-3xl">{metric.icon}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Traffic Sources
          </h2>
          <div className="space-y-4">
            {[
              { source: 'Direct', percentage: 35, color: 'blue' },
              { source: 'Search', percentage: 28, color: 'purple' },
              { source: 'Social', percentage: 22, color: 'green' },
              { source: 'Email', percentage: 10, color: 'orange' },
              { source: 'Referral', percentage: 5, color: 'pink' }
            ].map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">{item.source}</span>
                  <span className="text-gray-900 dark:text-white font-medium">{item.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-${item.color}-500 rounded-full`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Device Breakdown
          </h2>
          <div className="space-y-4">
            {[
              { device: 'Mobile', percentage: 55, icon: '📱' },
              { device: 'Desktop', percentage: 35, icon: '💻' },
              { device: 'Tablet', percentage: 10, icon: '📟' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.device}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.percentage}% of traffic</p>
                  </div>
                </div>
                <div className="w-16 h-16">
                  <svg viewBox="0 0 36 36" className="w-full h-full">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={index === 0 ? '#3B82F6' : index === 1 ? '#8B5CF6' : '#10B981'}
                      strokeWidth="3"
                      strokeDasharray={`${item.percentage}, 100`}
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Selling Products
          </h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3">Product</th>
                <th className="pb-3">Sales</th>
                <th className="pb-3">Revenue</th>
                <th className="pb-3">Trend</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 text-gray-900 dark:text-white font-medium">{product.name}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">{product.sales}</td>
                  <td className="py-3 text-gray-900 dark:text-white font-medium">{product.revenue}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.trend === 'up' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {product.trend === 'up' ? '↑' : '↓'} {product.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;