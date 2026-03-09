import React from 'react';
import Head from 'next/head';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Pricing from '@/components/landing/Pricing';
import Testimonials from '@/components/landing/Testimonials';
import CTA from '@/components/landing/CTA';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <>
      <Head>
        <title>QuickStore - AI-Powered E-commerce Platform</title>
        <meta name="description" content="Create your dream store in minutes with AI. QuickStore is the most advanced e-commerce platform with built-in AI features." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph */}
        <meta property="og:title" content="QuickStore - AI-Powered E-commerce Platform" />
        <meta property="og:description" content="Create your dream store in minutes with AI. QuickStore is the most advanced e-commerce platform with built-in AI features." />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:url" content="https://quickstore.com" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="QuickStore - AI-Powered E-commerce Platform" />
        <meta name="twitter:description" content="Create your dream store in minutes with AI. QuickStore is the most advanced e-commerce platform with built-in AI features." />
        <meta name="twitter:image" content="/twitter-image.jpg" />
      </Head>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Section */}
        <Hero />

        {/* Features Section */}
        <Features />

        {/* Pricing Section */}
        <Pricing />

        {/* Testimonials Section */}
        <Testimonials />

        {/* Call to Action */}
        <CTA />

        {/* Schema Markup for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "QuickStore",
              "applicationCategory": "E-commerce Platform",
              "description": "AI-powered e-commerce platform for creating online stores",
              "offers": {
                "@type": "Offer",
                "price": "29",
                "priceCurrency": "USD"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "1250"
              }
            })
          }}
        />
      </motion.div>
    </>
  );
}

// Server Side Props for SEO
export async function getStaticProps() {
  return {
    props: {
      // Add any necessary props
    },
    revalidate: 3600 // Revalidate every hour
  };
}