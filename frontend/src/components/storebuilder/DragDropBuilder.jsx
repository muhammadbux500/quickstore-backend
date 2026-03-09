import React, { useState } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import Card from '../common/Card';
import Button from '../common/Button';

const DragDropBuilder = () => {
  const [sections, setSections] = useState([
    { id: 'header', type: 'header', name: 'Header', enabled: true },
    { id: 'hero', type: 'hero', name: 'Hero Section', enabled: true },
    { id: 'features', type: 'features', name: 'Features', enabled: true },
    { id: 'products', type: 'products', name: 'Products Grid', enabled: true },
    { id: 'about', type: 'about', name: 'About Us', enabled: true },
    { id: 'testimonials', type: 'testimonials', name: 'Testimonials', enabled: true },
    { id: 'footer', type: 'footer', name: 'Footer', enabled: true }
  ]);

  const [selectedSection, setSelectedSection] = useState(null);
  const [previewMode, setPreviewMode] = useState('desktop');

  const sectionTemplates = [
    {
      type: 'hero',
      name: 'Hero Section',
      icon: '🎯',
      variants: [
        { name: 'Centered Hero', image: '/templates/hero-centered.jpg' },
        { name: 'Split Hero', image: '/templates/hero-split.jpg' },
        { name: 'Video Hero', image: '/templates/hero-video.jpg' }
      ]
    },
    {
      type: 'features',
      name: 'Features',
      icon: '✨',
      variants: [
        { name: 'Grid Layout', image: '/templates/features-grid.jpg' },
        { name: 'List Layout', image: '/templates/features-list.jpg' },
        { name: 'Card Layout', image: '/templates/features-cards.jpg' }
      ]
    },
    {
      type: 'products',
      name: 'Products',
      icon: '🛍️',
      variants: [
        { name: 'Grid View', image: '/templates/products-grid.jpg' },
        { name: 'List View', image: '/templates/products-list.jpg' },
        { name: 'Carousel', image: '/templates/products-carousel.jpg' }
      ]
    },
    {
      type: 'testimonials',
      name: 'Testimonials',
      icon: '💬',
      variants: [
        { name: 'Cards', image: '/templates/testimonials-cards.jpg' },
        { name: 'Carousel', image: '/templates/testimonials-carousel.jpg' },
        { name: 'Masonry', image: '/templates/testimonials-masonry.jpg' }
      ]
    }
  ];

  const addSection = (type) => {
    const newSection = {
      id: `${type}-${Date.now()}`,
      type,
      name: type.charAt(0).toUpperCase() + type.slice(1),
      enabled: true
    };
    setSections([...sections, newSection]);
  };

  const removeSection = (id) => {
    setSections(sections.filter(section => section.id !== id));
  };

  const toggleSection = (id) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, enabled: !section.enabled } : section
    ));
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left Sidebar - Components Library */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Add Sections
          </h2>
          
          <div className="space-y-4">
            {sectionTemplates.map((template) => (
              <Card key={template.type} className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{template.icon}</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {template.name}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => addSection(template.type)}
                  >
                    Add
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-1 mt-2">
                  {template.variants.map((variant, idx) => (
                    <div
                      key={idx}
                      className="aspect-video bg-gray-100 dark:bg-gray-700 rounded cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                      title={variant.name}
                    >
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                        {variant.name.split(' ')[0]}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Main Builder Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`p-2 rounded-lg ${
                  previewMode === 'desktop' 
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                onClick={() => setPreviewMode('tablet')}
                className={`p-2 rounded-lg ${
                  previewMode === 'tablet' 
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`p-2 rounded-lg ${
                  previewMode === 'mobile' 
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                Save Draft
              </Button>
              <Button variant="primary" size="sm">
                Publish
              </Button>
            </div>
          </div>
        </div>

        {/* Builder Canvas */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className={`mx-auto transition-all duration-300 ${
            previewMode === 'desktop' ? 'max-w-6xl' :
            previewMode === 'tablet' ? 'max-w-3xl' : 'max-w-md'
          }`}>
            <Reorder.Group axis="y" values={sections} onReorder={setSections}>
              <AnimatePresence>
                {sections.map((section) => (
                  <Reorder.Item
                    key={section.id}
                    value={section}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4"
                  >
                    <Card className={`relative group ${
                      !section.enabled ? 'opacity-50' : ''
                    }`}>
                      {/* Section Controls */}
                      <div className="absolute -top-3 right-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button
                          onClick={() => toggleSection(section.id)}
                          className={`p-1 rounded ${
                            section.enabled
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-500 text-white'
                          }`}
                        >
                          {section.enabled ? '👁️' : '👁️‍🗨️'}
                        </button>
                        <button
                          onClick={() => setSelectedSection(section)}
                          className="p-1 bg-blue-500 text-white rounded"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => removeSection(section.id)}
                          className="p-1 bg-red-500 text-white rounded"
                        >
                          🗑️
                        </button>
                        <span className="text-gray-400 cursor-move">⋮⋮</span>
                      </div>

                      {/* Section Preview */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {section.name}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {section.type}
                          </span>
                        </div>

                        {/* Section Content Preview */}
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 flex items-center justify-center">
                          {section.type === 'header' && (
                            <div className="w-full">
                              <div className="flex justify-between items-center">
                                <div className="w-24 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                <div className="flex space-x-4">
                                  <div className="w-16 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                  <div className="w-16 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                  <div className="w-16 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                </div>
                              </div>
                            </div>
                          )}

                          {section.type === 'hero' && (
                            <div className="text-center">
                              <div className="w-48 h-8 bg-gray-300 dark:bg-gray-600 rounded mx-auto mb-4"></div>
                              <div className="w-64 h-4 bg-gray-300 dark:bg-gray-600 rounded mx-auto"></div>
                            </div>
                          )}

                          {section.type === 'features' && (
                            <div className="grid grid-cols-3 gap-4 w-full">
                              {[1,2,3].map(i => (
                                <div key={i} className="h-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
                              ))}
                            </div>
                          )}

                          {section.type === 'products' && (
                            <div className="grid grid-cols-4 gap-4 w-full">
                              {[1,2,3,4].map(i => (
                                <div key={i} className="h-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Reorder.Item>
                ))}
              </AnimatePresence>
            </Reorder.Group>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Section Settings */}
      {selectedSection && (
        <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Section Settings
              </h2>
              <button
                onClick={() => setSelectedSection(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Section Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Section Type
                </label>
                <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <option>Hero Section</option>
                  <option>Features</option>
                  <option>Products</option>
                  <option>Testimonials</option>
                </select>
              </div>

              {/* Layout Variant */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Layout
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[1,2,3,4].map(i => (
                    <div
                      key={i}
                      className="p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded cursor-pointer hover:border-blue-500"
                    >
                      <div className="aspect-video bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
                      <span className="text-xs">Variant {i}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spacing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Padding
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Top"
                    className="w-16 px-2 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Right"
                    className="w-16 px-2 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Bottom"
                    className="w-16 px-2 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Left"
                    className="w-16 px-2 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm"
                  />
                </div>
              </div>

              {/* Background */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Background Color
                </label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    className="w-10 h-10 rounded cursor-pointer"
                    defaultValue="#ffffff"
                  />
                  <input
                    type="text"
                    placeholder="#ffffff"
                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded"
                  />
                </div>
              </div>

              {/* Animation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Animation
                </label>
                <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <option>Fade In</option>
                  <option>Slide Up</option>
                  <option>Slide In</option>
                  <option>Zoom In</option>
                  <option>None</option>
                </select>
              </div>

              <Button variant="primary" fullWidth>
                Apply Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DragDropBuilder;