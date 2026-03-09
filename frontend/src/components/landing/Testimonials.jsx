import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../common/Card';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Fashion Store Owner',
      image: '/images/avatars/avatar1.jpg',
      content: 'QuickStore transformed my business completely. The AI store builder created a beautiful store for my fashion brand in seconds. I was selling within hours, not weeks!',
      rating: 5,
      store: 'FashionHub',
      revenue: '+250%'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Electronics Retailer',
      image: '/images/avatars/avatar2.jpg',
      content: 'The WhatsApp integration is a game-changer. My customers love the one-click ordering, and I\'ve seen a 40% increase in conversions. Best decision I made for my business.',
      rating: 5,
      store: 'TechGadgets',
      revenue: '+180%'
    },
    {
      id: 3,
      name: 'Priya Patel',
      role: 'Handicrafts Seller',
      image: '/images/avatars/avatar3.jpg',
      content: 'As someone with limited technical knowledge, I was worried about setting up an online store. QuickStore made it incredibly easy. The support team is amazing too!',
      rating: 5,
      store: 'ArtisanCrafts',
      revenue: '+300%'
    },
    {
      id: 4,
      name: 'David Williams',
      role: 'Multi-Store Owner',
      image: '/images/avatars/avatar4.jpg',
      content: 'Managing 5 stores used to be a nightmare. Now with QuickStore\'s multi-store feature, I handle everything from one dashboard. The analytics are top-notch.',
      rating: 5,
      store: 'Williams Group',
      revenue: '+400%'
    }
  ];

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Loved by Thousands of Store Owners
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Don't just take our word for it. Here's what real merchants have to say.
          </p>
        </motion.div>

        {/* Main Testimonial */}
        <div className="relative max-w-5xl mx-auto">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-3xl"></div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="p-8 md:p-12">
                  <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column - User Info */}
                    <div className="md:col-span-1">
                      <div className="text-center md:text-left">
                        {/* Avatar Placeholder (since we don't have actual images) */}
                        <div className="w-24 h-24 mx-auto md:mx-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold mb-4">
                          {testimonials[activeIndex].name.charAt(0)}
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {testimonials[activeIndex].name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                          {testimonials[activeIndex].role}
                        </p>
                        <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                          {testimonials[activeIndex].store}
                        </p>

                        {/* Revenue Increase */}
                        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Revenue Increase</p>
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {testimonials[activeIndex].revenue}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Testimonial Content */}
                    <div className="md:col-span-2">
                      {/* Rating Stars */}
                      <div className="flex mb-4">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-6 h-6 ${i < testimonials[activeIndex].rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>

                      {/* Quote Icon */}
                      <svg className="w-12 h-12 text-blue-600/20 dark:text-blue-400/20 mb-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>

                      <p className="text-xl text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                        "{testimonials[activeIndex].content}"
                      </p>

                      {/* Store Metrics */}
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2h6v4H7V4zm8 8H7v4h6v-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-gray-600 dark:text-gray-400">Verified Store</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-gray-600 dark:text-gray-400">Verified Purchase</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
            >
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
            >
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? 'w-8 bg-blue-600'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-2">10K+</div>
                <div className="text-sm opacity-90">Active Stores</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-2">1M+</div>
                <div className="text-sm opacity-90">Products Sold</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-2">4.9/5</div>
                <div className="text-sm opacity-90">Customer Rating</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-2">150+</div>
                <div className="text-sm opacity-90">Countries</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;