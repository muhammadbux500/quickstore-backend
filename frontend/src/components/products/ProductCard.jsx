import React from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';

const ProductCard = ({ product, isSelected, onSelect }) => {
  const profit = product.price - (product.cost || 0);
  const profitMargin = product.price ? ((profit / product.price) * 100).toFixed(1) : 0;

  return (
    <Card className="relative group overflow-hidden">
      {/* Selection Checkbox */}
      <div className="absolute top-2 left-2 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </div>

      {/* Status Badge */}
      <div className="absolute top-2 right-2 z-10">
        <span className={`px-2 py-1 text-xs rounded-full ${
          product.status === 'active' 
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
        }`}>
          {product.status}
        </span>
      </div>

      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 overflow-hidden group-hover:scale-105 transition-transform duration-300">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
          <button className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors">
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors">
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors">
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400">
          SKU: {product.sku}
        </p>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            ${product.price}
          </span>
          {product.comparePrice > product.price && (
            <>
              <span className="text-sm text-gray-400 line-through">
                ${product.comparePrice}
              </span>
              <span className="text-xs text-green-600 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded">
                Save ${(product.comparePrice - product.price).toFixed(2)}
              </span>
            </>
          )}
        </div>

        {/* Stock Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${
              product.quantity > 100 ? 'bg-green-500' :
              product.quantity > 50 ? 'bg-yellow-500' :
              product.quantity > 0 ? 'bg-orange-500' : 'bg-red-500'
            }`}></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {product.quantity} in stock
            </span>
          </div>
          {product.variants > 1 && (
            <span className="text-xs text-gray-500">
              {product.variants} variants
            </span>
          )}
        </div>

        {/* Sales Stats */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
          <div>
            <p className="text-xs text-gray-500">Sales</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {product.sales} units
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Revenue</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              ${product.revenue?.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>

        {/* Profit Margin (if cost is available) */}
        {product.cost > 0 && (
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Profit Margin</span>
              <span className={`font-medium ${
                profitMargin > 40 ? 'text-green-600' :
                profitMargin > 20 ? 'text-yellow-600' : 'text-orange-600'
              }`}>
                {profitMargin}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  profitMargin > 40 ? 'bg-green-500' :
                  profitMargin > 20 ? 'bg-yellow-500' : 'bg-orange-500'
                }`}
                style={{ width: `${Math.min(profitMargin, 100)}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProductCard;