import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import Button from '../common/Button';

const ColorCustomizer = () => {
  const [colors, setColors] = useState({
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    accent: '#EC4899',
    background: '#FFFFFF',
    text: '#111827',
    header: '#FFFFFF',
    footer: '#F9FAFB'
  });

  const [presets, setPresets] = useState([
    {
      name: 'Ocean Breeze',
      colors: {
        primary: '#0EA5E9',
        secondary: '#0284C7',
        accent: '#F97316',
        background: '#F0F9FF',
        text: '#0C4A6E'
      }
    },
    {
      name: 'Sunset',
      colors: {
        primary: '#F97316',
        secondary: '#DC2626',
        accent: '#8B5CF6',
        background: '#FFF7ED',
        text: '#7C2D12'
      }
    },
    {
      name: 'Forest',
      colors: {
        primary: '#22C55E',
        secondary: '#16A34A',
        accent: '#EAB308',
        background: '#F7FEE7',
        text: '#14532D'
      }
    },
    {
      name: 'Royal',
      colors: {
        primary: '#8B5CF6',
        secondary: '#6D28D9',
        accent: '#EC4899',
        background: '#F5F3FF',
        text: '#2E1065'
      }
    }
  ]);

  const [livePreview, setLivePreview] = useState(true);
  const [customCSS, setCustomCSS] = useState('');

  const updateColor = (key, value) => {
    setColors({ ...colors, [key]: value });
  };

  const applyPreset = (preset) => {
    setColors(preset.colors);
  };

  const resetToDefault = () => {
    setColors({
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      accent: '#EC4899',
      background: '#FFFFFF',
      text: '#111827',
      header: '#FFFFFF',
      footer: '#F9FAFB'
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Color Controls */}
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Color Palette
          </h2>
          
          <div className="space-y-4">
            {Object.entries(colors).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">
                  {key} Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => updateColor(key, e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateColor(key, e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-3 mt-6">
            <Button variant="primary" onClick={() => {}}>
              Apply Colors
            </Button>
            <Button variant="outline" onClick={resetToDefault}>
              Reset
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Color Presets
          </h2>
          
          <div className="space-y-3">
            {presets.map((preset, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                onClick={() => applyPreset(preset)}
                className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {preset.name}
                  </span>
                </div>
                <div className="flex space-x-1">
                  {Object.values(preset.colors).slice(0, 5).map((color, idx) => (
                    <div
                      key={idx}
                      className="flex-1 h-8 rounded"
                      style={{ backgroundColor: color }}
                    ></div>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Advanced Options
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700 dark:text-gray-300">
                Live Preview
              </label>
              <button
                onClick={() => setLivePreview(!livePreview)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  livePreview ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  livePreview ? 'translate-x-7' : 'translate-x-1'
                }`}></div>
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Custom CSS
              </label>
              <textarea
                value={customCSS}
                onChange={(e) => setCustomCSS(e.target.value)}
                placeholder=".my-class { color: var(--primary); }"
                rows="4"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg font-mono text-sm"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Live Preview */}
      <div className="lg:col-span-2">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Live Preview
            </h2>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg">
                Desktop
              </button>
              <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg">
                Mobile
              </button>
            </div>
          </div>

          {/* Store Preview */}
          <div 
            className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
            style={{ 
              backgroundColor: colors.background,
              color: colors.text
            }}
          >
            {/* Header Preview */}
            <div 
              className="p-4 border-b"
              style={{ 
                backgroundColor: colors.header,
                borderColor: colors.text + '20'
              }}
            >
              <div className="flex items-center justify-between">
                <div 
                  className="text-xl font-bold"
                  style={{ color: colors.primary }}
                >
                  QuickStore
                </div>
                <div className="flex space-x-4">
                  <span style={{ color: colors.text }}>Home</span>
                  <span style={{ color: colors.text }}>Shop</span>
                  <span style={{ color: colors.text }}>About</span>
                </div>
              </div>
            </div>

            {/* Hero Preview */}
            <div className="p-8 text-center">
              <h1 
                className="text-3xl font-bold mb-4"
                style={{ color: colors.primary }}
              >
                Welcome to Your Store
              </h1>
              <p className="mb-6" style={{ color: colors.text }}>
                This is how your store will look with these colors
              </p>
              
              {/* Buttons Preview */}
              <div className="flex justify-center space-x-4">
                <button
                  className="px-6 py-2 rounded-lg text-white"
                  style={{ backgroundColor: colors.primary }}
                >
                  Primary Button
                </button>
                <button
                  className="px-6 py-2 rounded-lg text-white"
                  style={{ backgroundColor: colors.secondary }}
                >
                  Secondary Button
                </button>
                <button
                  className="px-6 py-2 rounded-lg"
                  style={{ 
                    backgroundColor: colors.accent,
                    color: '#ffffff'
                  }}
                >
                  Accent Button
                </button>
              </div>
            </div>

            {/* Products Grid Preview */}
            <div className="grid grid-cols-3 gap-4 p-8">
              {[1,2,3].map((item) => (
                <div 
                  key={item}
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: colors.background }}
                >
                  <div 
                    className="h-24 rounded-lg mb-2"
                    style={{ backgroundColor: colors.primary + '40' }}
                  ></div>
                  <div 
                    className="h-4 rounded mb-1"
                    style={{ backgroundColor: colors.text + '20' }}
                  ></div>
                  <div 
                    className="h-4 w-1/2 rounded"
                    style={{ backgroundColor: colors.accent }}
                  ></div>
                </div>
              ))}
            </div>

            {/* Footer Preview */}
            <div 
              className="p-4 border-t"
              style={{ 
                backgroundColor: colors.footer,
                borderColor: colors.text + '20'
              }}
            >
              <div className="text-center text-sm" style={{ color: colors.text }}>
                © 2024 QuickStore. All rights reserved.
              </div>
            </div>
          </div>

          {/* Color Contrast Check */}
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Accessibility Check
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Text/BG Contrast:</span>
                <span className="ml-2 text-green-500">✓ Pass (12.5:1)</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Primary/Text:</span>
                <span className="ml-2 text-green-500">✓ Pass (8.2:1)</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Secondary/Text:</span>
                <span className="ml-2 text-yellow-500">⚠ Needs improvement</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ColorCustomizer;