import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import UserManagement from '@/components/admin/UserManagement';
import StoreManagement from '@/components/admin/StoreManagement';
import RevenueAnalytics from '@/components/admin/RevenueAnalytics';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/common/Card';
import Loader from '@/components/common/Loader';

export default function Admin() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('users');

  const tabs = [
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'stores', label: 'Stores', icon: '🏪' },
    { id: 'revenue', label: 'Revenue', icon: '💰' },
    { id: 'subscriptions', label: 'Subscriptions', icon: '📋' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  // Redirect if not authenticated or not admin
  React.useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading admin panel..." />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Panel - QuickStore</title>
        <meta name="description" content="QuickStore administration" />
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Admin Panel
          </h1>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Last updated: {new Date().toLocaleString()}</span>
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
                {activeTab === 'users' && <UserManagement />}
                {activeTab === 'stores' && <StoreManagement />}
                {activeTab === 'revenue' && <RevenueAnalytics />}
                {activeTab === 'subscriptions' && (
                  <div>Subscriptions Management (Coming Soon)</div>
                )}
                {activeTab === 'settings' && (
                  <div>Admin Settings (Coming Soon)</div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </Card>

        {/* System Status */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            System Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">API Server</p>
                <p className="text-xs text-gray-500">99.9% uptime</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Database</p>
                <p className="text-xs text-gray-500">Connected</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Redis Cache</p>
                <p className="text-xs text-gray-500">Operational</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Queue</p>
                <p className="text-xs text-gray-500">Processing: 23 jobs</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

// Admin route middleware
export async function getServerSideProps(context) {
  const { req } = context;
  const token = req.cookies.token;
  const userRole = req.cookies.userRole;

  if (!token || userRole !== 'admin') {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}