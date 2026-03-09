import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import Button from '../common/Button';
import Variants from './Variants';

const AddProduct = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: '',
    tags: [],
    price: '',
    comparePrice: '',
    cost: '',
    sku: '',
    barcode: '',
    quantity: '',
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    images: [],
    variants: [],
    seo: {
      title: '',
      description: '',
      slug: ''
    }
  });

  const [currentTag, setCurrentTag] = useState('');

  const tabs = [
    { id: 'general', label: 'General', icon: '📝' },
    { id: 'media', label: 'Media', icon: '🖼️' },
    { id: 'variants', label: 'Variants', icon: '🔄' },
    { id: 'inventory', label: 'Inventory', icon: '📦' },
    { id: 'shipping', label: 'Shipping', icon: '🚚' },
    { id: 'seo', label: 'SEO', icon: '🔍' }
  ];

  const categories = [
    'Electronics',
    'Clothing',
    'Accessories',
    'Footwear',
    'Home & Garden',
    'Beauty',
    'Sports',
    'Toys'
  ];

  const addTag = () => {
    if (currentTag && !product.tags.includes(currentTag)) {
      setProduct({
        ...product,
        tags: [...product.tags, currentTag]
      });
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setProduct({
      ...product,
      tags: product.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleImageUpload = (e) => {
    // Handle image upload
    console.log('Uploading images...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Add New Product
        </h1>
        <div className="flex space-x-3">
          <Button variant="outline">
            Save as Draft
          </Button>
          <Button variant="primary">
            Publish Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tabs */}
          <Card className="p-0 overflow-hidden">
            <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* General Tab */}
              {activeTab === 'general' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={product.name}
                      onChange={(e) => setProduct({...product, name: e.target.value})}
                      placeholder="e.g., Wireless Headphones"
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={product.description}
                      onChange={(e) => setProduct({...product, description: e.target.value})}
                      rows="6"
                      placeholder="Product description..."
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Category
                      </label>
                      <select
                        value={product.category}
                        onChange={(e) => setProduct({...product, category: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <option value="">Select category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tags
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={currentTag}
                          onChange={(e) => setCurrentTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addTag()}
                          placeholder="Add tags"
                          className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                        />
                        <Button variant="primary" onClick={addTag}>Add</Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {product.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm flex items-center"
                          >
                            {tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className="ml-2 text-blue-700 dark:text-blue-400 hover:text-blue-900"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Media Tab */}
              {activeTab === 'media' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
                    <div className="mb-4">
                      <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      Drag and drop images here, or click to select
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      PNG, JPG, GIF up to 10MB
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload">
                      <Button variant="primary" as="span">
                        Upload Images
                      </Button>
                    </label>
                  </div>

                  {/* Image Preview Grid */}
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {[1,2,3].map(i => (
                      <div key={i} className="relative group">
                        <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        <button className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Variants Tab */}
              {activeTab === 'variants' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Variants />
                </motion.div>
              )}

              {/* Inventory Tab */}
              {activeTab === 'inventory' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Price *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={product.price}
                          onChange={(e) => setProduct({...product, price: e.target.value})}
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Compare at Price
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={product.comparePrice}
                          onChange={(e) => setProduct({...product, comparePrice: e.target.value})}
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Cost per item
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={product.cost}
                          onChange={(e) => setProduct({...product, cost: e.target.value})}
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Profit Margin
                      </label>
                      <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400">
                        {product.price && product.cost ? 
                          `$${(product.price - product.cost).toFixed(2)} (${Math.round((product.price - product.cost) / product.price * 100)}%)` 
                          : '-'
                        }
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        SKU
                      </label>
                      <input
                        type="text"
                        value={product.sku}
                        onChange={(e) => setProduct({...product, sku: e.target.value})}
                        placeholder="SKU-001"
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Barcode (ISBN, UPC, GTIN, etc.)
                      </label>
                      <input
                        type="text"
                        value={product.barcode}
                        onChange={(e) => setProduct({...product, barcode: e.target.value})}
                        placeholder="123456789012"
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={product.quantity}
                      onChange={(e) => setProduct({...product, quantity: e.target.value})}
                      placeholder="0"
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="track-inventory"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="track-inventory" className="text-sm text-gray-700 dark:text-gray-300">
                      Track inventory
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="allow-backorders"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="allow-backorders" className="text-sm text-gray-700 dark:text-gray-300">
                      Allow backorders
                    </label>
                  </div>
                </motion.div>
              )}

              {/* Shipping Tab */}
              {activeTab === 'shipping' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={product.weight}
                      onChange={(e) => setProduct({...product, weight: e.target.value})}
                      placeholder="0.00"
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Dimensions (cm)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        value={product.dimensions.length}
                        onChange={(e) => setProduct({
                          ...product, 
                          dimensions: {...product.dimensions, length: e.target.value}
                        })}
                        placeholder="Length"
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                      />
                      <input
                        type="number"
                        value={product.dimensions.width}
                        onChange={(e) => setProduct({
                          ...product, 
                          dimensions: {...product.dimensions, width: e.target.value}
                        })}
                        placeholder="Width"
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                      />
                      <input
                        type="number"
                        value={product.dimensions.height}
                        onChange={(e) => setProduct({
                          ...product, 
                          dimensions: {...product.dimensions, height: e.target.value}
                        })}
                        placeholder="Height"
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Shipping Class
                    </label>
                    <select className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <option>Standard Shipping</option>
                      <option>Express Shipping</option>
                      <option>Free Shipping</option>
                      <option>No Shipping Required</option>
                    </select>
                  </div>
                </motion.div>
              )}

              {/* SEO Tab */}
              {activeTab === 'seo' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      value={product.seo.title}
                      onChange={(e) => setProduct({
                        ...product, 
                        seo: {...product.seo, title: e.target.value}
                      })}
                      placeholder="SEO title (leave empty to auto-generate)"
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Recommended: 50-60 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      SEO Description
                    </label>
                    <textarea
                      value={product.seo.description}
                      onChange={(e) => setProduct({
                        ...product, 
                        seo: {...product.seo, description: e.target.value}
                      })}
                      rows="3"
                      placeholder="SEO meta description"
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Recommended: 150-160 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      URL Slug
                    </label>
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-2">/product/</span>
                      <input
                        type="text"
                        value={product.seo.slug}
                        onChange={(e) => setProduct({
                          ...product, 
                          seo: {...product.seo, slug: e.target.value}
                        })}
                        placeholder="wireless-headphones"
                        className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                      AI-Generated SEO Suggestions
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">
                      Title: Buy Wireless Headphones Online | QuickStore
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      Description: Shop the best wireless headphones at QuickStore. 
                      Free shipping, 30-day returns, and expert support.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Apply Suggestions
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Product Status */}
          <Card>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Product Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                <select className="text-sm bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1">
                  <option>Draft</option>
                  <option>Active</option>
                  <option>Archived</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Visibility</span>
                <select className="text-sm bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1">
                  <option>Public</option>
                  <option>Private</option>
                  <option>Password Protected</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Published on</span>
                <span className="text-sm text-gray-900 dark:text-white">Not published</span>
              </div>
            </div>
          </Card>

          {/* Organization */}
          <Card>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Organization
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Product Type
                </label>
                <input
                  type="text"
                  placeholder="e.g., Physical, Digital"
                  className="w-full px-3 py-1 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Vendor
                </label>
                <input
                  type="text"
                  placeholder="Vendor name"
                  className="w-full px-3 py-1 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Collections
                </label>
                <select className="w-full px-3 py-1 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <option>Summer Collection</option>
                  <option>Winter Collection</option>
                  <option>Best Sellers</option>
                  <option>New Arrivals</option>
                </select>
              </div>
            </div>
          </Card>

          {/* AI Suggestions */}
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <h3 className="text-sm font-medium mb-2">✨ AI Product Assistant</h3>
            <p className="text-sm opacity-90 mb-3">
              Get AI-generated product descriptions, SEO tags, and category suggestions
            </p>
            <Button variant="secondary" size="sm" fullWidth>
              Generate with AI
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;