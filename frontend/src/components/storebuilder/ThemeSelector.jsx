import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import Button from '../common/Button';

const ThemeSelector = () => {
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [filter, setFilter] = useState('all');

  const themes = {
    popular: [
      {
        id: 1,
        name: 'Minimal Store',
        category: 'minimal',
        image: '/themes/minimal.jpg',
        price: 'free',
        downloads: '10k+',
        rating: 4.8,
        colors: ['#ffffff', '#000000', '#f3f4f6'],
        features: ['Mobile Optimized', 'Fast Loading', 'SEO Ready']
      },
      {
        id: 2,
        name: 'Fashion Hub',
        category: 'fashion',
        image: '/themes/fashion.jpg',
        price: '$49',
        downloads: '5k+',
        rating: 4.9,
        colors: ['#000000', '#ffffff', '#e11d48'],
        features: ['Lookbook', 'Size Guide', 'Quick View']
      },
      {
        id: 3,
        name: 'Electro Store',
        category: 'electronics',
        image: '/themes/electro.jpg',
        price: '$79',
        downloads: '3k+',
        rating: 4.7,
        colors: ['#1e293b', '#3b82f6', '#ffffff'],
        features: ['Product Compare', 'Specs Table', 'Reviews']
      }
    ],
    all: [
      {
        id: 4,
        name: 'Organic Food',
        category: 'food',
        image: '/themes/organic.jpg',
        price: '$59',
        downloads: '2k+',
        rating: 4.6,
        colors: ['#22c55e', '#ffffff', '#f97316']
      },
      {
        id: 5,
        name: 'Furniture Store',
        category: 'furniture',
        image: '/themes/furniture.jpg',
        price: '$89',
        downloads: '1.5k+',
        rating: 4.8,
        colors: ['#854d0e', '#fef9c3', '#ffffff']
      },
      {
        id: 6,
        name: 'Book Shop',
        category: 'books',
        image: '/themes/books.jpg',
        price: '$39',
        downloads: '4k+',
        rating: 4.9,
        colors: ['#7c3aed', '#f5f3ff', '#ffffff']
      },
      {
        id: 7,
        name: 'Sports Gear',
        category: 'sports',
        image: '/themes/sports.jpg',
        price: '$69',
        downloads: '2.5k+',
        rating: 4.7,
        colors: ['#dc2626', '#ffffff', '#000000']
      },
      {
        id: 8,
        name: 'Jewelry Store',
        category: 'jewelry',
        image: '/themes/jewelry.jpg',
        price: '$99',
        downloads: '1k+',
        rating: 4.9,
        colors: ['#fbbf24', '#ffffff', '#000000']
      },
      {
        id: 9,
        name: 'Pet Supplies',
        category: 'pets',
        image: '/themes/pets.jpg',
        price: '$49',
        downloads: '3k+',
        rating: 4.8,
        colors: ['#f97316', '#ffffff', '#22c55e']
      }
    ]
  };

  const categories = [
    'all',
    'minimal',
    'fashion',
    'electronics',
    'food',
    'furniture',
    'books',
    'sports',
    'jewelry',
    'pets'
  ];

  const filteredThemes = filter === 'all' 
    ? [...themes.popular, ...themes.all]
    : [...themes.popular, ...themes.all].filter(theme => theme.category === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Choose Your Theme
        </h1>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            Upload Theme
          </Button>
          <Button variant="primary" size="sm">
            Preview Selected
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === cat
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Popular Themes Section */}
      {filter === 'all' && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Popular Themes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {themes.popular.map((theme) => (
              <motion.div
                key={theme.id}
                whileHover={{ y: -5 }}
                className="cursor-pointer"
                onClick={() => setSelectedTheme(theme.id)}
              >
                <Card className={`overflow-hidden ${
                  selectedTheme === theme.id ? 'ring-2 ring-blue-500' : ''
                }`}>
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative group">
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity"></div>
                    <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-900 px-4 py-2 rounded-lg font-medium">
                      Preview
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {theme.name}
                      </h3>
                      <span className={`text-sm font-semibold ${
                        theme.price === 'free' ? 'text-green-500' : 'text-blue-500'
                      }`}>
                        {theme.price}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">★</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {theme.rating}
                        </span>
                      </div>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {theme.downloads} downloads
                      </span>
                    </div>
                    
                    <div className="flex space-x-1 mb-3">
                      {theme.colors.map((color, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800"
                          style={{ backgroundColor: color }}
                        ></div>
                      ))}
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {theme.features?.map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* All Themes Grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {filter === 'all' ? 'All Themes' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Themes`}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredThemes.map((theme) => (
            <motion.div
              key={theme.id}
              whileHover={{ y: -5 }}
              className="cursor-pointer"
              onClick={() => setSelectedTheme(theme.id)}
            >
              <Card className={`overflow-hidden ${
                selectedTheme === theme.id ? 'ring-2 ring-blue-500' : ''
              }`}>
                <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-600 relative group">
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity"></div>
                  <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-900 px-4 py-2 rounded-lg font-medium">
                    Preview
                  </button>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {theme.name}
                    </h3>
                    <span className={`text-sm font-semibold ${
                      theme.price === 'free' ? 'text-green-500' : 'text-blue-500'
                    }`}>
                      {theme.price}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {theme.rating}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {theme.downloads} downloads
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Theme Preview Modal would go here */}
    </div>
  );
};

export default ThemeSelector;