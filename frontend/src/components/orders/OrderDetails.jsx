import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import Button from '../common/Button';
import Invoice from './Invoice';

const OrderDetails = ({ orderId }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [showInvoice, setShowInvoice] = useState(false);

  // Mock order data
  const order = {
    id: '#ORD-2024-001',
    date: '2024-01-15T10:30:00',
    status: 'processing',
    paymentStatus: 'paid',
    fulfillmentStatus: 'pending',
    customer: {
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      avatar: 'JS',
      totalOrders: 5,
      totalSpent: 1245.80
    },
    shippingAddress: {
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    },
    billingAddress: {
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    },
    shippingMethod: 'Express Shipping',
    paymentMethod: 'Credit Card (Visa ending in 4242)',
    items: [
      {
        id: 1,
        name: 'Wireless Headphones',
        sku: 'WH-001',
        price: 99.99,
        quantity: 1,
        total: 99.99,
        image: null,
        variant: 'Black'
      },
      {
        id: 2,
        name: 'Cotton T-Shirt',
        sku: 'TS-002',
        price: 24.99,
        quantity: 2,
        total: 49.98,
        image: null,
        variant: 'Large / Blue'
      },
      {
        id: 3,
        name: 'Leather Wallet',
        sku: 'WL-003',
        price: 49.99,
        quantity: 1,
        total: 49.99,
        image: null,
        variant: 'Brown'
      }
    ],
    subtotal: 199.96,
    shipping: 15.00,
    tax: 19.54,
    discount: 0,
    total: 234.50,
    notes: 'Please leave package at the front door. Customer requested gift wrapping.',
    timeline: [
      { status: 'order_placed', date: '2024-01-15T10:30:00', note: 'Order placed by customer' },
      { status: 'payment_received', date: '2024-01-15T10:31:00', note: 'Payment confirmed' },
      { status: 'processing', date: '2024-01-15T11:00:00', note: 'Order is being processed' }
    ]
  };

  const tabs = [
    { id: 'details', label: 'Order Details', icon: '📋' },
    { id: 'timeline', label: 'Timeline', icon: '⏱️' },
    { id: 'customer', label: 'Customer', icon: '👤' },
    { id: 'notes', label: 'Notes', icon: '📝' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      shipped: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      refunded: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
    };
    return colors[status] || colors.pending;
  };

  const updateStatus = (newStatus) => {
    console.log('Updating status to:', newStatus);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Order {order.id}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Placed on {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => setShowInvoice(true)}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Invoice
          </Button>
          <Button variant="primary">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Update Status
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Order Status</p>
              <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Payment Status</p>
              <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(order.paymentStatus)}`}>
                {order.paymentStatus}
              </span>
            </div>
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Fulfillment Status</p>
              <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(order.fulfillmentStatus)}`}>
                {order.fulfillmentStatus}
              </span>
            </div>
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Items and Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <Card className="p-0 overflow-hidden">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
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
              {/* Order Details Tab */}
              {activeTab === 'details' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* Order Items */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Order Items
                    </h3>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                              <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                              {item.variant && (
                                <p className="text-xs text-gray-500">Variant: {item.variant}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900 dark:text-white">
                              ${item.price.toFixed(2)} x {item.quantity}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Total: ${item.total.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Order Summary
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                        <span className="text-gray-900 dark:text-white">${order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Shipping:</span>
                        <span className="text-gray-900 dark:text-white">${order.shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                        <span className="text-gray-900 dark:text-white">${order.tax.toFixed(2)}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Discount:</span>
                          <span className="text-green-600">-${order.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-gray-900 dark:text-white">Total:</span>
                        <span className="text-gray-900 dark:text-white">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Shipping & Payment Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Shipping Address
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.shippingAddress.address}<br />
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                        {order.shippingAddress.country}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Billing Address
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.billingAddress.address}<br />
                        {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}<br />
                        {order.billingAddress.country}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Shipping Method
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{order.shippingMethod}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Payment Method
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{order.paymentMethod}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Timeline Tab */}
              {activeTab === 'timeline' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {order.timeline.map((event, index) => (
                    <div key={index} className="flex space-x-3">
                      <div className="relative">
                        <div className="w-3 h-3 mt-1.5 bg-blue-500 rounded-full"></div>
                        {index < order.timeline.length - 1 && (
                          <div className="absolute top-4 left-1.5 w-0.5 h-full bg-gray-200 dark:bg-gray-700"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {event.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </p>
                        <p className="text-xs text-gray-500">{event.note}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(event.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Customer Tab */}
              {activeTab === 'customer' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                      {order.customer.avatar}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {order.customer.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">{order.customer.email}</p>
                      <p className="text-gray-600 dark:text-gray-400">{order.customer.phone}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {order.customer.totalOrders}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${order.customer.totalSpent}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button variant="outline" fullWidth>
                      View Customer Profile
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Notes Tab */}
              {activeTab === 'notes' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Add Note
                    </label>
                    <textarea
                      rows="4"
                      placeholder="Add a note about this order..."
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                    ></textarea>
                    <Button variant="primary" className="mt-2">
                      Add Note
                    </Button>
                  </div>

                  <div className="pt-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      Order Notes
                    </h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {order.notes}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Added on {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-6">
          {/* Update Status */}
          <Card>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Update Order Status
            </h3>
            <div className="space-y-2">
              <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
                <option>Pending</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
              <Button variant="primary" fullWidth size="sm">
                Update Status
              </Button>
            </div>
          </Card>

          {/* Fulfillment */}
          <Card>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Fulfillment
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Tracking Number</span>
                <span className="text-sm text-gray-900 dark:text-white">Not added</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Carrier</span>
                <span className="text-sm text-gray-900 dark:text-white">-</span>
              </div>
              <Button variant="outline" fullWidth size="sm">
                Add Tracking
              </Button>
            </div>
          </Card>

          {/* Payment */}
          <Card>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Payment
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Payment Status</span>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Payment Method</span>
                <span className="text-sm text-gray-900 dark:text-white">{order.paymentMethod}</span>
              </div>
              {order.paymentStatus === 'paid' && (
                <Button variant="outline" fullWidth size="sm">
                  Refund Payment
                </Button>
              )}
            </div>
          </Card>

          {/* Customer Actions */}
          <Card>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Customer
            </h3>
            <div className="space-y-2">
              <Button variant="outline" fullWidth size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Customer
              </Button>
              <Button variant="outline" fullWidth size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Customer
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoice && (
        <Invoice
          order={order}
          onClose={() => setShowInvoice(false)}
        />
      )}
    </div>
  );
};

export default OrderDetails;