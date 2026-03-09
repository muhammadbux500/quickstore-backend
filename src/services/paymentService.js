const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paypal = require('paypal-rest-sdk');
const crypto = require('crypto');

// Configure PayPal
paypal.configure({
  mode: process.env.PAYPAL_MODE || 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET
});

class PaymentService {
  constructor() {
    this.providers = {
      stripe: this.stripeProvider,
      paypal: this.paypalProvider,
      cod: this.codProvider
    };
  }

  // Process payment
  async processPayment(order, method, paymentDetails) {
    try {
      const provider = this.providers[method];
      if (!provider) {
        throw new Error(`Unsupported payment method: ${method}`);
      }

      const result = await provider.call(this, order, paymentDetails);
      
      return {
        success: true,
        ...result
      };

    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Stripe provider
  async stripeProvider(order, paymentDetails) {
    try {
      const { paymentMethodId, saveCard = false } = paymentDetails;

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(order.total * 100),
        currency: order.currency?.toLowerCase() || 'usd',
        payment_method: paymentMethodId,
        confirmation_method: 'manual',
        confirm: true,
        metadata: {
          orderId: order._id.toString(),
          orderNumber: order.orderNumber,
          storeId: order.store.toString()
        },
        receipt_email: order.customer.email
      });

      // If card should be saved
      if (saveCard && paymentIntent.status === 'succeeded') {
        await this.savePaymentMethod(order.customer.userId, paymentMethodId);
      }

      return {
        provider: 'stripe',
        transactionId: paymentIntent.id,
        status: this.mapStripeStatus(paymentIntent.status),
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        paymentMethod: paymentIntent.payment_method,
        receiptUrl: paymentIntent.charges?.data[0]?.receipt_url,
        requiresAction: paymentIntent.status === 'requires_action',
        clientSecret: paymentIntent.client_secret
      };

    } catch (error) {
      throw new Error(`Stripe payment failed: ${error.message}`);
    }
  }

  // PayPal provider
  async paypalProvider(order, paymentDetails) {
    try {
      const { payerId, paymentId } = paymentDetails;

      return new Promise((resolve, reject) => {
        if (paymentId && payerId) {
          // Execute existing payment
          paypal.payment.execute(paymentId, { payer_id: payerId }, (error, payment) => {
            if (error) {
              reject(new Error(error.message));
            } else {
              resolve({
                provider: 'paypal',
                transactionId: payment.id,
                status: this.mapPayPalStatus(payment.state),
                amount: payment.transactions[0].amount.total,
                currency: payment.transactions[0].amount.currency,
                payerId: payment.payer.payer_info.payer_id,
                paymentMethod: 'paypal'
              });
            }
          });
        } else {
          // Create new payment
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
                currency: order.currency || 'USD',
                total: order.total.toFixed(2)
              },
              description: `Order #${order.orderNumber}`,
              custom: order._id.toString(),
              item_list: {
                items: order.items.map(item => ({
                  name: item.name,
                  sku: item.sku,
                  price: item.price.toFixed(2),
                  currency: order.currency || 'USD',
                  quantity: item.quantity
                }))
              }
            }]
          };

          paypal.payment.create(create_payment_json, (error, payment) => {
            if (error) {
              reject(new Error(error.message));
            } else {
              const approvalUrl = payment.links.find(link => link.rel === 'approval_url').href;
              resolve({
                provider: 'paypal',
                transactionId: payment.id,
                status: 'pending',
                approvalUrl,
                paymentId: payment.id
              });
            }
          });
        }
      });

    } catch (error) {
      throw new Error(`PayPal payment failed: ${error.message}`);
    }
  }

  // Cash on delivery provider
  async codProvider(order, paymentDetails) {
    return {
      provider: 'cod',
      transactionId: `COD-${order.orderNumber}-${Date.now()}`,
      status: 'pending',
      amount: order.total,
      currency: order.currency || 'USD',
      paymentMethod: 'cod',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    };
  }

  // Process refund
  async processRefund(payment, amount, reason) {
    try {
      let refundResult;

      switch (payment.method) {
        case 'stripe':
          refundResult = await stripe.refunds.create({
            payment_intent: payment.transactionId,
            amount: amount ? Math.round(amount * 100) : undefined,
            reason: this.mapRefundReason(reason)
          });
          break;

        case 'paypal':
          refundResult = await new Promise((resolve, reject) => {
            paypal.sale.refund(payment.transactionId, {
              amount: {
                currency: payment.currency,
                total: (amount || payment.amount).toFixed(2)
              },
              description: reason
            }, (error, refund) => {
              if (error) reject(error);
              else resolve(refund);
            });
          });
          break;

        default:
          throw new Error(`Refund not supported for ${payment.method}`);
      }

      return {
        success: true,
        refundId: refundResult.id,
        amount: amount || payment.amount,
        status: 'processed'
      };

    } catch (error) {
      console.error('Refund processing error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Save payment method for future use
  async savePaymentMethod(userId, paymentMethodId) {
    try {
      const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
        customer: userId
      });

      return {
        success: true,
        paymentMethodId: paymentMethod.id,
        card: paymentMethod.card
      };

    } catch (error) {
      console.error('Save payment method error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get saved payment methods
  async getPaymentMethods(userId) {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: userId,
        type: 'card'
      });

      return {
        success: true,
        data: paymentMethods.data.map(method => ({
          id: method.id,
          brand: method.card.brand,
          last4: method.card.last4,
          expMonth: method.card.exp_month,
          expYear: method.card.exp_year,
          isDefault: method.metadata?.isDefault === 'true'
        }))
      };

    } catch (error) {
      console.error('Get payment methods error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create subscription
  async createSubscription(plan, customerId, paymentMethodId) {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: plan.priceId }],
        default_payment_method: paymentMethodId,
        metadata: {
          planName: plan.name,
          planId: plan._id.toString()
        },
        expand: ['latest_invoice.payment_intent']
      });

      return {
        success: true,
        subscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        latestInvoice: subscription.latest_invoice
      };

    } catch (error) {
      console.error('Create subscription error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId) {
    try {
      const subscription = await stripe.subscriptions.cancel(subscriptionId);

      return {
        success: true,
        subscriptionId: subscription.id,
        status: subscription.status,
        canceledAt: new Date(subscription.canceled_at * 1000)
      };

    } catch (error) {
      console.error('Cancel subscription error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Handle webhook
  async handleWebhook(provider, payload, signature) {
    try {
      switch (provider) {
        case 'stripe':
          return await this.handleStripeWebhook(payload, signature);
        case 'paypal':
          return await this.handlePayPalWebhook(payload);
        default:
          throw new Error(`Unsupported webhook provider: ${provider}`);
      }

    } catch (error) {
      console.error('Webhook handling error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Handle Stripe webhook
  async handleStripeWebhook(payload, signature) {
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      return {
        success: true,
        event: event.type,
        data: event.data.object
      };

    } catch (error) {
      throw new Error(`Stripe webhook error: ${error.message}`);
    }
  }

  // Handle PayPal webhook
  async handlePayPalWebhook(payload) {
    try {
      // Verify PayPal webhook signature
      const webhookId = process.env.PAYPAL_WEBHOOK_ID;
      const isValid = await this.verifyPayPalWebhook(payload, webhookId);

      if (!isValid) {
        throw new Error('Invalid PayPal webhook signature');
      }

      return {
        success: true,
        event: payload.event_type,
        data: payload.resource
      };

    } catch (error) {
      throw new Error(`PayPal webhook error: ${error.message}`);
    }
  }

  // Verify PayPal webhook
  async verifyPayPalWebhook(payload, webhookId) {
    // Implement PayPal webhook verification
    // This is a simplified version
    const transmissionId = payload.transmission_id;
    const timestamp = payload.transmission_time;
    const actualSignature = payload.transmission_sig;
    const certUrl = payload.cert_url;
    const authAlgo = payload.auth_algo;

    // In production, verify using PayPal's SDK
    return true;
  }

  // Map Stripe status
  mapStripeStatus(status) {
    const map = {
      'succeeded': 'completed',
      'pending': 'processing',
      'requires_action': 'requires_action',
      'requires_payment_method': 'failed',
      'requires_confirmation': 'pending',
      'canceled': 'cancelled',
      'processing': 'processing',
      'requires_capture': 'pending'
    };
    return map[status] || 'unknown';
  }

  // Map PayPal status
  mapPayPalStatus(status) {
    const map = {
      'approved': 'completed',
      'created': 'pending',
      'saved': 'saved',
      'canceled': 'cancelled',
      'failed': 'failed'
    };
    return map[status] || 'unknown';
  }

  // Map refund reason
  mapRefundReason(reason) {
    const map = {
      'requested_by_customer': 'requested_by_customer',
      'duplicate': 'duplicate',
      'fraudulent': 'fraudulent',
      'general': null
    };
    return map[reason] || null;
  }

  // Calculate transaction fee
  calculateFee(amount, method) {
    const fees = {
      stripe: {
        percentage: 2.9,
        fixed: 0.30
      },
      paypal: {
        percentage: 3.5,
        fixed: 0.49
      },
      cod: {
        percentage: 0,
        fixed: 0
      }
    };

    const fee = fees[method];
    if (!fee) return 0;

    return (amount * fee.percentage / 100) + fee.fixed;
  }
}

module.exports = new PaymentService();