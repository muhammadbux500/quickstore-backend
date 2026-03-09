import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarMenu = ({ isOpen = true, onClose, isMobile = false }) => {
  const router = useRouter();
  const [expandedMenus, setExpandedMenus] = useState({});

  const menuSections = [
    {
      title: 'MAIN',
      items: [
        {
          title: 'Dashboard',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          ),
          path: '/dashboard',
          badge: null
        },
        {
          title: 'Analytics',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          ),
          path: '/dashboard/analytics',
          badge: 'Live',
          badgeColor: 'bg-green-500'
        }
      ]
    },
    {
      title: 'STORE',
      items: [
        {
          title: 'Store Builder',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
          ),
          path: '/dashboard/store-builder',
          badge: 'AI',
          badgeColor: 'bg-purple-500',
          submenu: [
            { title: 'Themes', path: '/dashboard/store-builder/themes' },
            { title: 'Pages', path: '/dashboard/store-builder/pages' },
            { title: 'AI Builder', path: '/dashboard/store-builder/ai', badge: 'New' }
          ]
        },
        {
          title: 'Products',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          ),
          path: '/dashboard/products',
          badge: '24',
          badgeColor: 'bg-blue-500',
          submenu: [
            { title: 'All Products', path: '/dashboard/products' },
            { title: 'Add New', path: '/dashboard/products/add' },
            { title: 'Categories', path: '/dashboard/products/categories' },
            { title: 'Inventory', path: '/dashboard/products/inventory' }
          ]
        },
        {
          title: 'Orders',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          ),
          path: '/dashboard/orders',
          badge: '12',
          badgeColor: 'bg-orange-500',
          submenu: [
            { title: 'All Orders', path: '/dashboard/orders' },
            { title: 'Pending', path: '/dashboard/orders/pending', badge: '5' },
            { title: 'Processing', path: '/dashboard/orders/processing', badge: '4' },
            { title: 'Completed', path: '/dashboard/orders/completed', badge: '3' }
          ]
        }
      ]
    },
    {
      title: 'MARKETING',
      items: [
        {
          title: 'Affiliates',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          ),
          path: '/dashboard/affiliates',
          badge: null,
          submenu: [
            { title: 'Dashboard', path: '/dashboard/affiliates' },
            { title: 'Commissions', path: '/dashboard/affiliates/commissions' },
            { title: 'Payouts', path: '/dashboard/affiliates/payouts' }
          ]
        },
        {
          title: 'Social Media',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          ),
          path: '/dashboard/social',
          badge: null,
          submenu: [
            { title: 'Auto Posting', path: '/dashboard/social/auto-posting' },
            { title: 'Connected Accounts', path: '/dashboard/social/accounts' },
            { title: 'Schedule', path: '/dashboard/social/schedule' }
          ]
        },
        {
          title: 'SEO',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          ),
          path: '/dashboard/seo',
          badge: 'Auto',
          badgeColor: 'bg-teal-500'
        }
      ]
    },
    {
      title: 'SETTINGS',
      items: [
        {
          title: 'Store Settings',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
          path: '/dashboard/settings/store'
        },
        {
          title: 'Team',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ),
          path: '/dashboard/settings/team'
        },
        {
          title: 'Billing',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          ),
          path: '/dashboard/settings/billing',
          badge: 'Pro',
          badgeColor: 'bg-gradient-to-r from-blue-500 to-purple-500'
        }
      ]
    }
  ];

  const toggleSubmenu = (title) => {
    setExpandedMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const isActive = (path) => {
    return router.pathname === path || router.pathname.startsWith(path + '/');
  };

  const MobileSidebar = () => (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}
      
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 25 }}
        className="fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto"
      >
        <SidebarContent />
      </motion.div>
    </>
  );

  const DesktopSidebar = () => (
    <div className="h-screen sticky top-0 bg-white dark:bg-gray-900 shadow-xl w-64 overflow-y-auto">
      <SidebarContent />
    </div>
  );

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg rotate-45"></div>
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            QuickStore
          </span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search menu..."
            className="w-full px-4 py-2 pl-10 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg className="w-4 h-4 absolute left-3 top-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="flex-1 px-4">
        {menuSections.map((section, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item, itemIdx) => (
                <div key={itemIdx}>
                  {/* Menu Item */}
                  {item.submenu ? (
                    <button
                      onClick={() => toggleSubmenu(item.title)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 ${
                        isActive(item.path)
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-3">{item.icon}</span>
                        <span className="text-sm font-medium">{item.title}</span>
                      </div>
                      <div className="flex items-center">
                        {item.badge && (
                          <span className={`px-2 py-0.5 text-xs rounded-full text-white mr-2 ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        )}
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${
                            expandedMenus[item.title] ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                  ) : (
                    <Link
                      href={item.path}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 ${
                        isActive(item.path)
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-3">{item.icon}</span>
                        <span className="text-sm font-medium">{item.title}</span>
                      </div>
                      {item.badge && (
                        <span className={`px-2 py-0.5 text-xs rounded-full text-white ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )}

                  {/* Submenu */}
                  <AnimatePresence>
                    {item.submenu && expandedMenus[item.title] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-8 mt-1 space-y-1 overflow-hidden"
                      >
                        {item.submenu.map((subItem, subIdx) => (
                          <Link
                            key={subIdx}
                            href={subItem.path}
                            className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                              router.pathname === subItem.path
                                ? 'text-blue-600 dark:text-blue-400 font-medium'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                          >
                            <span>{subItem.title}</span>
                            {subItem.badge && (
                              <span className="px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">
                                {subItem.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 mt-auto">
        <div className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              John Doe
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              john@quickstore.com
            </p>
          </div>
          <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return isMobile ? <MobileSidebar /> : <DesktopSidebar />;
};

export default SidebarMenu;