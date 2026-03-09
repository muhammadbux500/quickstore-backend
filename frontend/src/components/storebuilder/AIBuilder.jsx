import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../common/Card';
import Button from '../common/Button';
import Loader from '../common/Loader';

const AIBuilder = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [generatedStore, setGeneratedStore] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [storeDetails, setStoreDetails] = useState({
    name: '',
    description: '',
    products: '',
    targetAudience: '',
    style: 'modern'
  });

  const industries = [
    { id: 'fashion', name: 'Fashion & Apparel', icon: '👕', description: 'Clothing, accessories, shoes' },
    { id: 'electronics', name: 'Electronics', icon: '📱', description: 'Gadgets, phones, computers' },
    { id: 'home', name: 'Home & Garden', icon: '🏠', description: 'Furniture, decor, gardening' },
    { id: 'beauty', name: 'Beauty & Health', icon: '💄', description: 'Cosmetics, wellness, supplements' },
    { id: 'food', name: 'Food & Beverages', icon: '🍔', description: 'Groceries, drinks, snacks' },
    { id: 'sports', name: 'Sports & Outdoors', icon: '⚽', description: 'Equipment, gear, clothing' },
    { id: 'toys', name: 'Toys & Games', icon: '🎮', description: 'Toys, video games, puzzles' },
    { id: 'jewelry', name: 'Jewelry & Watches', icon: '💎', description: 'Accessories, luxury items' }
  ];

  const styles = [
    { id: 'modern', name: 'Modern', icon: '✨', description: 'Clean, minimal, contemporary' },
    { id: 'classic', name: 'Classic', icon: '🏛️', description: 'Elegant, timeless, traditional' },
    { id: 'bold', name: 'Bold', icon: '⚡', description: 'Vibrant, energetic, standout' },
    { id: 'luxury', name: 'Luxury', icon: '👑', description: 'Premium, sophisticated, exclusive' }
  ];

  const generateStore = async () => {
    setLoading(true);
    
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedStore({
        name: storeDetails.name || `${selectedIndustry} Store`,
        layout: {
          sections: ['hero', 'featured', 'categories', 'products', 'testimonials', 'newsletter']
        },
        colors: {
          primary: '#3B82F6',
          secondary: '#8B5CF6',
          accent: '#EC4899'
        },
        fonts: {
          heading: 'Poppins',
          body: 'Inter'
        },
        products: [
          { name: 'Product 1', price: '$29.99', category: 'Featured' },
          { name: 'Product 2', price: '$49.99', category: 'Featured' },
          { name: 'Product 3', price: '$39.99', category: 'Featured' },
          { name: 'Product 4', price: '$59.99', category: 'Featured' }
        ]
      });
      setLoading(false);
      setStep(3);
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                step >= i 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}>
                {i}
              </div>
              {i < 3 && (
                <div className={`w-24 h-1 mx-2 ${
                  step > i ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}></div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span className="text-gray-600 dark:text-gray-400">Describe Your Store</span>
          <span className="text-gray-600 dark:text-gray-400">AI Generation</span>
          <span className="text-gray-600 dark:text-gray-400">Review & Customize</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Describe Store */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Describe Your Dream Store
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Tell us about your business and our AI will create a custom store for you.
              </p>

              <div className="space-y-6">
                {/* Main Prompt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    What kind of store do you want to create?
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Example: Create a modern fashion store for streetwear with urban style, targeting young adults aged 18-30. Include sections for hoodies, t-shirts, and accessories."
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="text-center">
                  <span className="text-gray-500 dark:text-gray-400">or</span>
                </div>

                {/* Industry Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Select Your Industry
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {industries.map((industry) => (
                      <button
                        key={industry.id}
                        onClick={() => setSelectedIndustry(industry.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedIndustry === industry.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                        }`}
                      >
                        <div className="text-3xl mb-2">{industry.icon}</div>
                        <div className="font-medium text-sm text-gray-900 dark:text-white">
                          {industry.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style Preference */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Preferred Style
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {styles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setStoreDetails({...storeDetails, style: style.id})}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          storeDetails.style === style.id
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                        }`}
                      >
                        <div className="text-3xl mb-2">{style.icon}</div>
                        <div className="font-medium text-sm text-gray-900 dark:text-white">
                          {style.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Store Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={storeDetails.name}
                      onChange={(e) => setStoreDetails({...storeDetails, name: e.target.value})}
                      placeholder="My Awesome Store"
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target Audience
                    </label>
                    <input
                      type="text"
                      value={storeDetails.targetAudience}
                      onChange={(e) => setStoreDetails({...storeDetails, targetAudience: e.target.value})}
                      placeholder="Young professionals, parents, etc."
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                    />
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => setStep(2)}
                  disabled={!prompt && !selectedIndustry}
                >
                  Generate Store with AI →
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 2: AI Generation */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className="p-12 text-center">
              {loading ? (
                <div className="py-12">
                  <Loader size="lg" text="AI is creating your store..." />
                  <p className="text-gray-500 dark:text-gray-400 mt-4">
                    This may take a few seconds
                  </p>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Ready to Generate!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Click the button below to start the AI generation process.
                  </p>
                  <Button variant="primary" size="lg" onClick={generateStore}>
                    Start Generation
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {/* Step 3: Generated Store Preview */}
        {step === 3 && generatedStore && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Your AI-Generated Store
              </h2>

              {/* Store Preview */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
                {/* Preview Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
                  <h3 className="text-xl font-bold text-white">{generatedStore.name}</h3>
                </div>

                {/* Preview Content */}
                <div className="p-6">
                  {/* Color Scheme */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Color Scheme
                    </h4>
                    <div className="flex space-x-3">
                      {Object.entries(generatedStore.colors).map(([name, color]) => (
                        <div key={name} className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: color }}></div>
                          <span className="text-sm capitalize text-gray-600 dark:text-gray-400">{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Layout Preview */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Layout Structure
                    </h4>
                    <div className="space-y-2">
                      {generatedStore.layout.sections.map((section, idx) => (
                        <div
                          key={idx}
                          className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400"
                        >
                          {section.charAt(0).toUpperCase() + section.slice(1)} Section
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Product Preview */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Sample Products
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {generatedStore.products.map((product, idx) => (
                        <div key={idx} className="text-center">
                          <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg mb-2"></div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</p>
                          <p className="text-sm text-blue-600 dark:text-blue-400">{product.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button variant="primary" size="lg" className="flex-1">
                  Use This Store
                </Button>
                <Button variant="outline" size="lg" onClick={() => setStep(1)}>
                  Regenerate
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips Section */}
      {step === 1 && (
        <Card className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">💡 Tips for better results:</h3>
          <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
            <li>• Be specific about your products and target audience</li>
            <li>• Mention your brand's personality (luxury, playful, professional)</li>
            <li>• Include color preferences if you have any</li>
            <li>• Describe your ideal customer</li>
          </ul>
        </Card>
      )}
    </div>
  );
};

export default AIBuilder;