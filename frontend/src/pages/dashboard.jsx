import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Overview from '@/components/dashboard/Overview';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/common/Loader';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - QuickStore</title>
        <meta name="description" content="Your QuickStore dashboard" />
      </Head>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Overview />
      </motion.div>
    </>
  );
}

// Protected route middleware
export async function getServerSideProps(context) {
  // Check authentication on server side
  const { req } = context;
  const token = req.cookies.token;

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {}, // Will be passed to the page component as props
  };
}