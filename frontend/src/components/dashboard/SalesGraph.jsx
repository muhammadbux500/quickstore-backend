import React from 'react';
import { motion } from 'framer-motion';

const SalesGraph = () => {
  // Sample data for the graph
  const data = [
    { day: 'Mon', sales: 1200 },
    { day: 'Tue', sales: 1900 },
    { day: 'Wed', sales: 1500 },
    { day: 'Thu', sales: 2200 },
    { day: 'Fri', sales: 2800 },
    { day: 'Sat', sales: 3500 },
    { day: 'Sun', sales: 3100 }
  ];

  const maxSales = Math.max(...data.map(d => d.sales));

  return (
    <div className="w-full">
      {/* Graph Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">This Week</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Last Week</span>
          </div>
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          $19,800
        </div>
      </div>

      {/* Graph Container */}
      <div className="relative h-64 flex items-end space-x-2">
        {/* Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="w-full h-px bg-gray-200 dark:bg-gray-700"></div>
          ))}
        </div>

        {/* Bars */}
        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ height: 0 }}
            animate={{ height: `${(item.sales / maxSales) * 100}%` }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="flex-1 flex flex-col items-center group"
          >
            {/* Bar */}
            <div className="relative w-full h-full flex items-end">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="absolute bottom-0 left-1 right-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg group-hover:from-blue-600 group-hover:to-blue-500 transition-all duration-300"
                style={{ height: `${(item.sales / maxSales) * 100}%` }}
              >
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  ${item.sales}
                </div>
              </motion.div>
              
              {/* Comparison Line (Last Week) */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${((item.sales * 0.9) / maxSales) * 100}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 bg-gray-300 dark:bg-gray-600 rounded-t"
                style={{ height: `${((item.sales * 0.9) / maxSales) * 100}%` }}
              />
            </div>
            
            {/* Day Label */}
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              {item.day}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600 dark:text-gray-400">
            Total Sales: <span className="font-bold text-gray-900 dark:text-white">$19,800</span>
          </div>
          <div className="text-green-600 dark:text-green-400 font-medium">
            ↑ 12.5% vs last week
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesGraph;