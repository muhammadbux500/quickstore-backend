import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../common/Card';
import Button from '../common/Button';

const Variants = () => {
  const [options, setOptions] = useState([
    { id: 1, name: 'Size', values: ['S', 'M', 'L', 'XL'] },
    { id: 2, name: 'Color', values: ['Red', 'Blue', 'Green'] }
  ]);

  const [variants, setVariants] = useState([
    {
      id: 1,
      options: { Size: 'S', Color: 'Red' },
      price: 29.99,
      sku: 'PROD-S-RED',
      quantity: 50,
      image: null
    },
    {
      id: 2,
      options: { Size: 'S', Color: 'Blue' },
      price: 29.99,
      sku: 'PROD-S-BLUE',
      quantity: 45,
      image: null
    },
    {
      id: 3,
      options: { Size: 'M', Color: 'Red' },
      price: 29.99,
      sku: 'PROD-M-RED',
      quantity: 35,
      image: null
    },
    {
      id: 4,
      options: { Size: 'M', Color: 'Blue' },
      price: 29.99,
      sku: 'PROD-M-BLUE',
      quantity: 40,
      image: null
    },
    {
      id: 5,
      options: { Size: 'L', Color: 'Red' },
      price: 29.99,
      sku: 'PROD-L-RED',
      quantity: 25,
      image: null
    },
    {
      id: 6,
      options: { Size: 'L', Color: 'Blue' },
      price: 29.99,
      sku: 'PROD-L-BLUE',
      quantity: 30,
      image: null
    }
  ]);

  const [newOption, setNewOption] = useState({ name: '', values: '' });
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [bulkPrice, setBulkPrice] = useState('');
  const [bulkQuantity, setBulkQuantity] = useState('');

  const addOption = () => {
    if (newOption.name && newOption.values) {
      const values = newOption.values.split(',').map(v => v.trim());
      setOptions([
        ...options,
        {
          id: options.length + 1,
          name: newOption.name,
          values
        }
      ]);
      setNewOption({ name: '', values: '' });
      
      // Generate new variants based on all options
      generateVariants();
    }
  };

  const removeOption = (optionId) => {
    setOptions(options.filter(opt => opt.id !== optionId));
    // Regenerate variants
    generateVariants();
  };

  const generateVariants = () => {
    // This would generate all possible combinations
    console.log('Generating variants...');
  };

  const updateVariant = (id, field, value) => {
    setVariants(variants.map(v => 
      v.id === id ? { ...v, [field]: value } : v
    ));
  };

  const applyBulkEdit = () => {
    setVariants(variants.map(v => ({
      ...v,
      price: bulkPrice ? parseFloat(bulkPrice) : v.price,
      quantity: bulkQuantity ? parseInt(bulkQuantity) : v.quantity
    })));
    setBulkEditMode(false);
  };

  return (
    <div className="space-y-6">
      {/* Options Configuration */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Product Options
        </h3>

        {/* Existing Options */}
        <div className="space-y-4 mb-4">
          {options.map(option => (
            <div key={option.id} className="flex items-start space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Option Name
                </label>
                <input
                  type="text"
                  value={option.name}
                  onChange={(e) => {
                    const updatedOptions = options.map(opt =>
                      opt.id === option.id ? { ...opt, name: e.target.value } : opt
                    );
                    setOptions(updatedOptions);
                  }}
                  className="w-full px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded"
                />
              </div>
              <div className="flex-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Values (comma separated)
                </label>
                <input
                  type="text"
                  value={option.values.join(', ')}
                  onChange={(e) => {
                    const values = e.target.value.split(',').map(v => v.trim());
                    const updatedOptions = options.map(opt =>
                      opt.id === option.id ? { ...opt, values } : opt
                    );
                    setOptions(updatedOptions);
                  }}
                  className="w-full px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded"
                />
              </div>
              <button
                onClick={() => removeOption(option.id)}
                className="mt-6 p-1 text-red-600 hover:text-red-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Add New Option */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Add New Option
          </h4>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Option name (e.g., Size)"
              value={newOption.name}
              onChange={(e) => setNewOption({...newOption, name: e.target.value})}
              className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
            />
            <input
              type="text"
              placeholder="Values (e.g., S,M,L)"
              value={newOption.values}
              onChange={(e) => setNewOption({...newOption, values: e.target.value})}
              className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
            />
            <Button variant="primary" onClick={addOption}>
              Add
            </Button>
          </div>
        </div>
      </Card>

      {/* Variants Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Variants
          </h3>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBulkEditMode(!bulkEditMode)}
            >
              Bulk Edit
            </Button>
            <Button variant="primary" size="sm">
              Generate Variants
            </Button>
          </div>
        </div>

        {/* Bulk Edit Panel */}
        <AnimatePresence>
          {bulkEditMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
            >
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-3">
                Bulk Edit All Variants
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-blue-700 dark:text-blue-400 mb-1">
                    Set Price
                  </label>
                  <input
                    type="number"
                    value={bulkPrice}
                    onChange={(e) => setBulkPrice(e.target.value)}
                    placeholder="New price"
                    className="w-full px-3 py-1 text-sm bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs text-blue-700 dark:text-blue-400 mb-1">
                    Set Quantity
                  </label>
                  <input
                    type="number"
                    value={bulkQuantity}
                    onChange={(e) => setBulkQuantity(e.target.value)}
                    placeholder="New quantity"
                    className="w-full px-3 py-1 text-sm bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 rounded"
                  />
                </div>
              </div>
              <div className="flex space-x-2 mt-3">
                <Button size="sm" onClick={applyBulkEdit}>
                  Apply to All
                </Button>
                <Button size="sm" variant="outline" onClick={() => setBulkEditMode(false)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Variants Grid */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3">Variant</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">SKU</th>
                <th className="pb-3">Quantity</th>
                <th className="pb-3">Image</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {variants.map((variant) => (
                <tr key={variant.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {Object.entries(variant.options).map(([key, value]) => (
                        <span key={key} className="mr-2">
                          {key}: {value}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3">
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) => updateVariant(variant.id, 'price', e.target.value)}
                      className="w-20 px-2 py-1 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded"
                    />
                  </td>
                  <td className="py-3">
                    <input
                      type="text"
                      value={variant.sku}
                      onChange={(e) => updateVariant(variant.id, 'sku', e.target.value)}
                      className="w-24 px-2 py-1 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded"
                    />
                  </td>
                  <td className="py-3">
                    <input
                      type="number"
                      value={variant.quantity}
                      onChange={(e) => updateVariant(variant.id, 'quantity', e.target.value)}
                      className="w-16 px-2 py-1 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded"
                    />
                  </td>
                  <td className="py-3">
                    <button className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">
                      Upload
                    </button>
                  </td>
                  <td className="py-3">
                    <button className="text-red-600 hover:text-red-700">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Variants Summary */}
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {variants.length}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Total Variants
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {variants.reduce((sum, v) => sum + v.quantity, 0)}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Total Stock
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${variants.reduce((sum, v) => sum + (v.price * v.quantity), 0).toFixed(2)}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Inventory Value
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Variants;