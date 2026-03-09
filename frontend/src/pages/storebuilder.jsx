import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import DragDropBuilder from '@/components/storebuilder/DragDropBuilder';
import ThemeSelector from '@/components/storebuilder/ThemeSelector';
import ColorCustomizer from '@/components/storebuilder/ColorCustomizer';
import AIBuilder from '@/components/storebuilder/AIBuilder';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

export default function StoreBuilder() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('builder');
  const [storeData, setStoreData] = useState({
    name: '',
    theme: 'modern',
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      accent: '#EC4899'
    },
    sections: []
  });

  const tabs = [
    { id: 'builder', label: 'Drag & Drop Builder', icon: '🖱️' },
    { id: 'themes', label: 'Themes', icon: '🎨' },
    { id: 'colors', label: 'Colors', icon: '🌈' },
    { id: 'ai', label: 'AI Builder', icon: '🤖' }
  ];

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading store builder..." />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Store Builder - QuickStore</title>
        <meta name="description" content="Build your store with QuickStore's powerful builder" />
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Store Builder
          </h1>
          <div className="flex space-x-3">
            <Button variant="outline">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </Button>
            <Button variant="primary">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Publish
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Card className="p-0 overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-all ${
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
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'builder' && <DragDropBuilder />}
                {activeTab === 'themes' && <ThemeSelector />}
                {activeTab === 'colors' && <ColorCustomizer />}
                {activeTab === 'ai' && <AIBuilder />}
              </motion.div>
            </AnimatePresence>
          </div>
        </Card>

        {/* Auto-save indicator */}
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-sm">Auto-saved</span>
        </div>
      </div>
    </>
  );
}