const Payment = require('../models/Payment');
const Order = require('../models/Order');
const Store = require('../models/Store');
const User = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paypal = require('paypal-rest-sdk');
const { validationResult } = require('express-validator');
const { sendEmail } = require('../services/emailService');

// Configure PayPal
paypal.configure({
  mode: process.env.PAYPAL_MODE || 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET
});

// @desc    Process payment with Stripe
// @route   POST /api/payment/stripe
// @access  Public
exports.processStripePayment = async (req, res) => {
  try {
    const { orderId, paymentMethodId } = req.body;

    // Get order details
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100), // Convert to cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
      metadata: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber
      }
    });

    // Save payment record
    const payment = await Payment.create({
      order: order._id,
      store: order.store,
      amount: order.total,
      currency: 'usd',
      method: 'stripe',
      transactionId: paymentIntent.id,
      status: paymentIntent.status === 'succeeded' ? 'completed' : 'pending',
      metadata: paymentIntent
    });

    // Update order payment status
    if (paymentIntent.status === 'succeeded') {
      order.paymentStatus = 'paid';
      order.status = 'processing';
      await order.save();

      // Send confirmation email
      const store = await Store.findById(order.store);
      await sendEmail({
        to: order.customer.email,
        subject: `Payment Confirmed for Order #${order.orderNumber}`,
        template: 'payment-confirmed',
        data: {
          orderNumber: order.orderNumber,
          customerName: order.customer.name,
          amount: order.total,
          storeName: store.name
        }
      });
    }

    res.json({
      success: true,
      data: {
        payment,
        clientSecret: paymentIntent.client_secret,
        requiresAction: paymentIntent.status === 'requires_action'
      }
    });

  } catch (error) {
    console.error('Stripe payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Payment processing failed'
    });
  }
};

// @desc    Confirm Stripe payment
// @route   POST /api/payment/stripe/confirm
// @access  Public
exports.confirmStripePayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);

    const payment = await Payment.findOne({ transactionId: paymentIntentId });
    if (payment) {
      payment.status = paymentIntent.status === 'succeeded' ? 'completed' : 'failed';
      await payment.save();

      if (paymentIntent.status === 'succeeded') {
        await Order.findByIdAndUpdate(payment.order, {
          paymentStatus: 'paid',
          status: 'processing'
        });
      }
    }

    res.json({
      success: true,
      data: paymentIntent
    });

  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Process payment with PayPal
// @route   POST /api/payment/paypal
// @access  Public
exports.processPayPalPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Create PayPal payment
    const create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      redirect_urls: {
        return_url: `${process.env.FRONTEND_URL}/payment/success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`
      },
      transactions: [{
        amount: {
          currency: 'USD',
          total: order.total.toFixed(2)
        },
        description: `Order #${order.orderNumber}`,
        custom: order._id.toString()
      }]
    };

    paypal.payment.create(create_payment_json, async (error, payment) => {
      if (error) {
        console.error('PayPal payment error:', error);
        return res.status(500).json({
          success: false,
          message: error.message
        });
      }

      // Save payment record
      await Payment.create({
        order: order._id,
        store: order.store,
        amount: order.total,
        currency: 'USD',
        method: 'paypal',
        transactionId: payment.id,
        status: 'pending',
        metadata: payment
      });

      // Find approval URL
      const approvalUrl = payment.links.find(link => link.rel === 'approval_url').href;

      res.json({
        success: true,
        data: {
          approvalUrl,
          paymentId: payment.id
        }
      });
    });

  } catch (error) {
    console.error('PayPal payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Execute PayPal payment
// @route   POST /api/payment/paypal/execute
// @access  Public
exports.executePayPalPayment = async (req, res) => {
  try {
    const { paymentId, payerId } = req.body;

    const payment = await Payment.findOne({ transactionId: paymentId });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    const execute_payment_json = {
      payer_id: payerId
    };

    paypal.payment.execute(paymentId, execute_payment_json, async (error, executedPayment) => {
      if (error) {
        console.error('Execute PayPal payment error:', error);
        return res.status(500).json({
          success: false,
          message: error.message
        });
      }

      // Update payment status
      payment.status = 'completed';
      payment.metadata = executedPayment;
      await payment.save();

      // Update order
      const order = await Order.findById(payment.order);
      order.paymentStatus = 'paid';
      order.status = 'processing';
      order.transactionId = executedPayment.id;
      await order.save();

      res.json({
        success: true,
        data: executedPayment
      });
    });

  } catch (error) {
    console.error('Execute PayPal payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Process refund
// @route   POST /api/payment/refund
// @access  Private
exports.processRefund = async (req, res) => {
  try {
    const { paymentId, amount, reason } = req.body;

    const payment = await Payment.findById(paymentId).populate('order');
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    let refundResult;

    if (payment.method === 'stripe') {
      // Stripe refund
      refundResult = await stripe.refunds.create({
        payment_intent: payment.transactionId,
        amount: amount ? Math.round(amount * 100) : undefined,
        reason: reason || 'requested_by_customer'
      });
    } else if (payment.method === 'paypal') {
      // PayPal refund
      refundResult = await new Promise((resolve, reject) => {
        paypal.sale.refund(payment.transactionId, {
          amount: {
            currency: 'USD',
            total: (amount || payment.amount).toFixed(2)
          }
        }, (error, refund) => {
          if (error) reject(error);
          else resolve(refund);
        });
      });
    }

    // Update payment status
    payment.status = 'refunded';
    payment.refundedAt = new Date();
    payment.refundAmount = amount || payment.amount;
    payment.refundReason = reason;
    await payment.save();

    // Update order
    const order = payment.order;
    order.paymentStatus = 'refunded';
    order.refunds.push({
      amount: amount || payment.amount,
      reason,
      transactionId: refundResult.id,
      processedAt: new Date()
    });
    await order.save();

    res.json({
      success: true,
      data: refundResult,
      message: 'Refund processed successfully'
    });

  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get payment methods for store
// @route   GET /api/payment/methods/:storeId
// @access  Private
exports.getPaymentMethods = async (req, res) => {
  try {
    const { storeId } = req.params;

    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    const paymentMethods = store.settings?.paymentMethods || [];

    res.json({
      success: true,
      data: paymentMethods
    });

  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Connect Stripe account
// @route   POST /api/payment/connect/stripe
// @access  Private
exports.connectStripe = async (req, res) => {
  try {
    const { storeId, authorizationCode } = req.body;

    // Exchange authorization code for tokens
    const response = await stripe.oauth.token({
      grant_type: 'authorization_code',
      code: authorizationCode,
    });

    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Save Stripe account details
    store.paymentAccounts = store.paymentAccounts || {};
    store.paymentAccounts.stripe = {
      accountId: response.stripe_user_id,
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      connectedAt: new Date()
    };

    // Enable Stripe payment method
    if (!store.settings.paymentMethods) {
      store.settings.paymentMethods = [];
    }
    if (!store.settings.paymentMethods.includes('stripe')) {
      store.settings.paymentMethods.push('stripe');
    }

    await store.save();

    res.json({
      success: true,
      message: 'Stripe account connected successfully'
    });

  } catch (error) {
    console.error('Connect Stripe error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get transaction history
// @route   GET /api/payment/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    const { storeId, page = 1, limit = 20, startDate, endDate } = req.query;

    const query = {};
    if (storeId) query.store = storeId;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const payments = await Payment.find(query)
      .populate('order', 'orderNumber customer total')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Payment.countDocuments(query);

    // Calculate summary
    const summary = await Payment.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalCount: { $sum: 1 },
          successfulAmount: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0] }
          },
          refundedAmount: {
            $sum: { $cond: [{ $eq: ['$status', 'refunded'] }, '$amount', 0] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: payments,
      summary: summary[0] || {
        totalAmount: 0,
        totalCount: 0,
        successfulAmount: 0,
        refundedAmount: 0
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Webhook for Stripe events
// @route   POST /api/payment/webhook/stripe
// @access  Public
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await handleSuccessfulPayment(paymentIntent);
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      await handleFailedPayment(failedPayment);
      break;
    case 'charge.refunded':
      const refund = event.data.object;
      await handleRefund(refund);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

// Helper functions for webhook handling
async function handleSuccessfulPayment(paymentIntent) {
  const payment = await Payment.findOne({ transactionId: paymentIntent.id });
  if (payment) {
    payment.status = 'completed';
    await payment.save();

    await Order.findByIdAndUpdate(payment.order, {
      paymentStatus: 'paid',
      status: 'processing'
    });
  }
}

async function handleFailedPayment(paymentIntent) {
  const payment = await Payment.findOne({ transactionId: paymentIntent.id });
  if (payment) {
    payment.status = 'failed';
    await payment.save();

    await Order.findByIdAndUpdate(payment.order, {
      paymentStatus: 'failed'
    });
  }
}

async function handleRefund(charge) {
  const payment = await Payment.findOne({ transactionId: charge.payment_intent });
  if (payment) {
    payment.status = 'refunded';
    payment.refundedAt = new Date();
    payment.refundAmount = charge.amount_refunded / 100;
    await payment.save();

    await Order.findByIdAndUpdate(payment.order, {
      paymentStatus: 'refunded'
    });
  }
}