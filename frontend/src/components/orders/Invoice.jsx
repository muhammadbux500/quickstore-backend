import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import Button from '../common/Button';

const Invoice = ({ order, onClose }) => {
  const invoiceRef = useRef();

  const handlePrint = () => {
    const printContent = invoiceRef.current;
    const originalContent = document.body.innerHTML;
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${order.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .invoice { max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 30px; }
            .company-info { margin-bottom: 30px; }
            .customer-info { margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f8f9fa; }
            .total { text-align: right; font-size: 18px; font-weight: bold; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          ${printContent.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    console.log('Downloading invoice...');
  };

  const handleEmail = () => {
    // In a real app, this would open email client
    console.log('Emailing invoice...');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="p-8">
          {/* Invoice Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Invoice
            </h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </Button>
              <Button variant="outline" size="sm" onClick={handleEmail}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                ✕
              </Button>
            </div>
          </div>

          {/* Invoice Content */}
          <div ref={invoiceRef} className="bg-white dark:bg-gray-800 p-8 rounded-lg">
            {/* Company Info */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  QuickStore
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  123 Business Ave<br />
                  Suite 100<br />
                  San Francisco, CA 94105<br />
                  United States
                </p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  INVOICE
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  <strong>Invoice #:</strong> {order.id}<br />
                  <strong>Date:</strong> {new Date(order.date).toLocaleDateString()}<br />
                  <strong>Due Date:</strong> {new Date(new Date(order.date).setDate(new Date(order.date).getDate() + 30)).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 uppercase tracking-wider">
                  Bill To:
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {order.customer.name}<br />
                  {order.customer.email}<br />
                  {order.customer.phone}<br />
                  {order.billingAddress.address}<br />
                  {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}<br />
                  {order.billingAddress.country}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 uppercase tracking-wider">
                  Ship To:
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {order.customer.name}<br />
                  {order.shippingAddress.address}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                  {order.shippingAddress.country}
                </p>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full mb-8">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <th className="py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Item</th>
                  <th className="py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">SKU</th>
                  <th className="py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Price</th>
                  <th className="py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Qty</th>
                  <th className="py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3">
                      <p className="text-sm text-gray-900 dark:text-white">{item.name}</p>
                      {item.variant && (
                        <p className="text-xs text-gray-500">{item.variant}</p>
                      )}
                    </td>
                    <td className="py-3 text-sm text-gray-600 dark:text-gray-400">{item.sku}</td>
                    <td className="py-3 text-sm text-right text-gray-900 dark:text-white">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="py-3 text-sm text-right text-gray-900 dark:text-white">{item.quantity}</td>
                    <td className="py-3 text-sm text-right font-medium text-gray-900 dark:text-white">
                      ${item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary */}
            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="text-sm text-gray-900 dark:text-white">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Shipping:</span>
                  <span className="text-sm text-gray-900 dark:text-white">${order.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tax:</span>
                  <span className="text-sm text-gray-900 dark:text-white">${order.tax.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Discount:</span>
                    <span className="text-sm text-green-600">-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between py-3 border-t-2 border-gray-200 dark:border-gray-700 font-bold">
                  <span className="text-base text-gray-900 dark:text-white">Total:</span>
                  <span className="text-base text-gray-900 dark:text-white">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Payment Method:</strong> {order.paymentMethod}<br />
                <strong>Payment Status:</strong> {order.paymentStatus}<br />
                <strong>Order Status:</strong> {order.status}
              </p>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Notes:</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{order.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-sm text-gray-500">
                Thank you for your business!<br />
                For questions about this invoice, please contact billing@quickstore.com
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Invoice;