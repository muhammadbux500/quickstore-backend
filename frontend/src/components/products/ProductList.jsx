import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../common/Card';
import Button from '../common/Button';
import ProductCard from './ProductCard';

const ProductList = () => {
  const [view, setView] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 99.99,
      comparePrice: 129.99,
      cost: 45,
      quantity: 150,
      sku: 'WH-001',
      category: 'Electronics',
      image: '/products/headphones.jpg',
      status: 'active',
      variants: 3,
      sales: 234,
      revenue: 23376.66,
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Cotton T-Shirt',
      price: 24.99,
      comparePrice: 34.99,
      cost: 8,
      quantity: 500,
      sku: 'TS-002',
      category: 'Clothing',
      image: '/products/tshirt.jpg',
      status: 'active',
      variants: 6,
      sales: 567,
      revenue: 14166.33,
      createdAt: '2024-01-14'
    },
    {
      id: 3,
      name: 'Leather Wallet',
      price: 49.99,
      comparePrice: 69.99,
      cost: 20,
      quantity: 75,
      sku: 'WL-003',
      category: 'Accessories',
      image: '/products/wallet.jpg',
      status: 'active',
      variants: 2,
      sales: 89,
      revenue: 4449.11,
      createdAt: '2024-01-13'
    },
    {
      id: 4,
      name: 'Smart Watch',
      price: 199.99,
      comparePrice: 249.99,
      cost: 120,
      quantity: 45,
      sku: 'SW-004',
      category: 'Electronics',
      image: '/products/watch.jpg',
      status: 'draft',
      variants: 2,
      sales: 0,
      revenue: 0,
      createdAt: '2024-01-12'
    },
    {
      id: 5,
      name: 'Running Shoes',
      price: 79.99,
      comparePrice: 99.99,
      cost: 35,
      quantity: 200,
      sku: 'RS-005',
      category: 'Footwear',
      image: '/products/shoes.jpg',
      status: 'active',
      variants: 8,
      sales: 156,
      revenue: 12478.44,
      createdAt: '2024-01-11'
    },
    {
      id: 6,
      name: 'Backpack',
      price: 59.99,
      comparePrice: 79.99,
      cost: 25,
      quantity: 120,
      sku: 'BP-006',
      category: 'Accessories',
      image: '/products/backpack.jpg',
      status: 'active',
      variants: 3,
      sales: 67,
      revenue: 4019.33,
      createdAt: '2024-01-10'
    }
  ]);

  const categories = ['all', 'Electronics', 'Clothing', 'Accessories', 'Footwear'];
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'name', label: 'Name' },
    { value: 'sales', label: 'Best Selling' }
  ];

  const filteredProducts = products
    .filter(product => 
      (selectedCategory === 'all' || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch(sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'price-high':
          return b.price - a.price;
        case 'price-low':
          return a.price - b.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'sales':
          return b.sales - a.sales;
        default:
          return 0;
      }
    });

  const toggleSelectProduct = (id) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(pId => pId !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const selectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const bulkActions = [
    { label: 'Delete Selected', action: 'delete', color: 'red' },
    { label: 'Change Status', action: 'status', color: 'blue' },
    { label: 'Update Inventory', action: 'inventory', color: 'green' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Products
        </h1>
        <Button variant="primary" href="/dashboard/products/add">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Product
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <svg className="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setView('grid')}
                className={`p-2 ${view === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-600'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 ${view === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-600'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-between"
          >
            <span className="text-sm text-blue-700 dark:text-blue-300">
              {selectedProducts.length} product(s) selected
            </span>
            <div className="flex gap-2">
              {bulkActions.map(action => (
                <button
                  key={action.label}
                  className={`px-3 py-1 text-sm rounded-lg bg-${action.color}-100 text-${action.color}-700 dark:bg-${action.color}-900/30 dark:text-${action.color}-400`}
                >
                  {action.label}
                </button>
              ))}
              <button
                onClick={() => setSelectedProducts([])}
                className="px-3 py-1 text-sm rounded-lg bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </Card>

      {/* Products Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredProducts.length} of {products.length} products
        </p>
        {view === 'grid' && (
          <button
            onClick={selectAll}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            {selectedProducts.length === filteredProducts.length ? 'Deselect All' : 'Select All'}
          </button>
        )}
      </div>

      {/* Products Grid/List */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <ProductCard
                  product={product}
                  isSelected={selectedProducts.includes(product.id)}
                  onSelect={() => toggleSelectProduct(product.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-3 pl-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={selectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="pb-3">Product</th>
                  <th className="pb-3">SKU</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Stock</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 pl-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleSelectProduct(product.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                          <p className="text-xs text-gray-500">ID: {product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-gray-600 dark:text-gray-400">{product.sku}</td>
                    <td className="py-3 text-sm text-gray-600 dark:text-gray-400">{product.category}</td>
                    <td className="py-3">
                      <p className="font-medium text-gray-900 dark:text-white">${product.price}</p>
                      {product.comparePrice > product.price && (
                        <p className="text-xs text-gray-500 line-through">${product.comparePrice}</p>
                      )}
                    </td>
                    <td className="py-3">
                      <span className={`text-sm ${
                        product.quantity > 100 ? 'text-green-600' :
                        product.quantity > 50 ? 'text-yellow-600' :
                        product.quantity > 0 ? 'text-orange-600' : 'text-red-600'
                      }`}>
                        {product.quantity} units
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.status === 'active' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex space-x-2">
                        <button className="p-1 text-blue-600 hover:text-blue-700">
                          ✏️
                        </button>
                        <button className="p-1 text-red-600 hover:text-red-700">
                          🗑️
                        </button>
                        <button className="p-1 text-gray-600 hover:text-gray-700">
                          ⋮
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Page 1 of 3
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
    </div>
  );
};

export default ProductList;