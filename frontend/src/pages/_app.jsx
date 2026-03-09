import React, { useEffect, useState } from 'react';
import '@/styles/globals.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Sidebar from '@/components/common/Sidebar';
import Loader from '@/components/common/Loader';

// Context Providers
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { CartProvider } from '@/context/CartContext';
import { NotificationProvider } from '@/context/NotificationContext';

function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if current route is dashboard or admin
  const isDashboard = router.pathname.startsWith('/dashboard') || 
                      router.pathname.startsWith('/admin') ||
                      router.pathname.startsWith('/storebuilder') ||
                      router.pathname.startsWith('/products') ||
                      router.pathname.startsWith('/orders') ||
                      router.pathname.startsWith('/affiliate');

  // Show loader on route change
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <NotificationProvider>
            <div className="min-h-screen bg-white dark:bg-gray-900">
              {/* Global Loader */}
              {loading && (
                <div className="fixed top-0 left-0 right-0 z-50">
                  <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 animate-loading"></div>
                </div>
              )}

              {/* Header - only show on non-dashboard pages */}
              {!isDashboard && <Header />}

              {/* Dashboard Layout */}
              {isDashboard ? (
                <div className="flex">
                  <Sidebar 
                    isOpen={sidebarOpen} 
                    onClose={() => setSidebarOpen(false)}
                  />
                  <div className="flex-1 lg:ml-64">
                    {/* Mobile Menu Button */}
                    <button
                      onClick={() => setSidebarOpen(true)}
                      className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
                    >
                      <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>

                    {/* Main Content */}
                    <main className="min-h-screen p-4 md:p-6 lg:p-8">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={router.pathname}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Component {...pageProps} />
                        </motion.div>
                      </AnimatePresence>
                    </main>
                  </div>
                </div>
              ) : (
                /* Landing Page Layout */
                <>
                  <main>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={router.pathname}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Component {...pageProps} />
                      </motion.div>
                    </AnimatePresence>
                  </main>
                  <Footer />
                </>
              )}

              {/* Toast Notifications Container */}
              <div id="toast-container" className="fixed bottom-4 right-4 z-50 space-y-2"></div>
            </div>
          </NotificationProvider>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;