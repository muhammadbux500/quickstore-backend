import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import OrderList from '@/components/orders/OrderList';
import OrderDetails from '@/components/orders/OrderDetails';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/common/Loader';

export default function Orders() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { id } = router.query;

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading orders..." />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{id ? `Order ${id}` : 'Orders'} - QuickStore</title>
        <meta name="description" content="Manage your orders" />
      </Head>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {id ? <OrderDetails orderId={id} /> : <OrderList />}
      </motion.div>
    </>
  );
}