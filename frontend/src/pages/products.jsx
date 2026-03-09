import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import ProductList from '@/components/products/ProductList';
import AddProduct from '@/components/products/AddProduct';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/common/Card';
import Button from '@/components/common/Loader';

export default function Products() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [view, setView] = useState('list'); // 'list' or 'add'

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading products..." />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Products - QuickStore</title>
        <meta name="description" content="Manage your products" />
      </Head>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {view === 'list' ? (
          <ProductList onAddNew={() => setView('add')} />
        ) : (
          <AddProduct onBack={() => setView('list')} />
        )}
      </motion.div>
    </>
  );
}