import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import Button from '../common/Button';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small businesses just getting started',
      monthlyPrice: 29,
      annualPrice: 19,
      features: [
        'Up to 100 products',
        'AI Store Builder',
        'Basic analytics',
        'WhatsApp integration',
        'Email support',
        'Custom domain'
      ],
      limitations: [
        'No affiliate system',
        'No auto social posting'
      ],
      color: 'from-blue-500 to-blue-600',
      popular: false
    },
    {
      name: 'Professional',
      description: 'For growing businesses that need more power',
      monthlyPrice: 79,
      annualPrice: 59,
      features: [
        'Unlimited products',
        'Advanced AI features',
        'Real-time analytics',
        'Affiliate system',
        'Auto social posting',
        'Priority support',
        'Multi-store (up to 3)'
      ],
      limitations: [],
      color: 'from-purple-500 to-pink-600',
      popular: true
    },
    {
      name: 'Enterprise',
      description: 'For large businesses with custom needs',
      monthlyPrice: 199,
      annualPrice: 159,
      features: [
        'Everything in Professional',
        'Unlimited stores',
        'Custom AI training',
        'Dedicated account manager',
        'API access',
        'SLA guarantee',
        'White label option'
      ],
      limitations: [],
      color: 'from-orange-500 to-red-600',
      popular: false
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section id="pricing" className="py-20 bg-white dark:bg-gray-900">
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
              Simple, Transparent Pricing
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Choose the perfect plan for your business. No hidden fees.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-lg ${!isAnnual ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-colors duration-300"
            >
              <div className={`absolute w-6 h-6 bg-white dark:bg-gray-900 rounded-full shadow-md transform transition-transform duration-300 ${isAnnual ? 'translate-x-8' : 'translate-x-0'}`}></div>
            </button>
            <span className={`text-lg ${isAnnual ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-500'}`}>
              Annual <span className="text-sm text-green-500">Save 20%</span>
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {plans.map((plan, index) => (
            <motion.div key={index} variants={item} className="relative">
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}

              <Card
                hover={true}
                className={`relative h-full ${plan.popular ? 'border-2 border-purple-500 dark:border-purple-400' : ''}`}
              >
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">
                      /mo
                    </span>
                  </div>
                  {isAnnual && (
                    <p className="text-sm text-green-500 mt-2">
                      Billed annually (${plan.annualPrice * 12}/year)
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="mb-8">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation, i) => (
                      <li key={i} className="flex items-start opacity-50">
                        <svg className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-500 dark:text-gray-500">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <Button
                  variant={plan.popular ? 'primary' : 'outline'}
                  size="lg"
                  fullWidth
                  className="relative"
                >
                  Get Started
                </Button>

                {/* Money Back Guarantee */}
                {index === 1 && (
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                    30-day money-back guarantee
                  </p>
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Enterprise Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Need a Custom Plan?
            </h3>
            <p className="text-lg mb-8 opacity-90">
              Contact us for custom pricing, dedicated support, and tailored solutions.
            </p>
            <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Contact Sales
            </Button>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;