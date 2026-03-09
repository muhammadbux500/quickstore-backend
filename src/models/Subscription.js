const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store'
  },
  plan: {
    type: String,
    enum: ['starter', 'professional', 'enterprise', 'affiliate', 'custom'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'past_due', 'cancelled', 'expired', 'trial'],
    default: 'trial'
  },
  billing: {
    interval: {
      type: String,
      enum: ['monthly', 'yearly', 'quarterly'],
      default: 'monthly'
    },
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    nextBillingDate: Date,
    lastBillingDate: Date,
    trialEndsAt: Date,
    cancelledAt: Date
  },
  payment: {
    method: {
      type: String,
      enum: ['stripe', 'paypal', 'bank_transfer']
    },
    provider: String,
    subscriptionId: String,
    customerId: String,
    paymentMethodId: String
  },
  features: {
    products: {
      limit: Number,
      used: {
        type: Number,
        default: 0
      }
    },
    storage: {
      limit: Number, // in bytes
      used: {
        type: Number,
        default: 0
      }
    },
    bandwidth: {
      limit: Number, // in bytes
      used: {
        type: Number,
        default: 0
      }
    },
    teamMembers: {
      limit: Number,
      used: {
        type: Number,
        default: 0
      }
    },
    stores: {
      limit: Number,
      used: {
        type: Number,
        default: 0
      }
    },
    customDomain: Boolean,
    analytics: {
      type: String,
      enum: ['basic', 'advanced', 'premium']
    },
    support: {
      type: String,
      enum: ['email', 'priority', '24/7']
    }
  },
  invoices: [{
    number: String,
    amount: Number,
    currency: String,
    status: {
      type: String,
      enum: ['paid', 'pending', 'failed']
    },
    paidAt: Date,
    dueDate: Date,
    items: [{
      description: String,
      amount: Number
    }],
    pdfUrl: String
  }],
  usage: [{
    period: {
      start: Date,
      end: Date
    },
    products: Number,
    storage: Number,
    bandwidth: Number,
    orders: Number,
    revenue: Number
  }],
  discounts: [{
    code: String,
    type: {
      type: String,
      enum: ['percentage', 'fixed']
    },
    value: Number,
    validUntil: Date
  }],
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Check if feature limit reached
subscriptionSchema.methods.isLimitReached = function(feature) {
  const limit = this.features[feature]?.limit;
  const used = this.features[feature]?.used;
  
  if (limit === -1) return false; // Unlimited
  return used >= limit;
};

// Update usage
subscriptionSchema.methods.updateUsage = async function() {
  const Product = mongoose.model('Product');
  const Order = mongoose.model('Order');
  
  const currentPeriod = this.usage[this.usage.length - 1];
  const now = new Date();

  if (!currentPeriod || now > currentPeriod.period.end) {
    // Start new period
    const period = {
      start: now,
      end: new Date(now.setMonth(now.getMonth() + 1))
    };
    this.usage.push({
      period,
      products: 0,
      storage: 0,
      bandwidth: 0,
      orders: 0,
      revenue: 0
    });
  }

  const current = this.usage[this.usage.length - 1];
  
  // Update product count
  if (this.store) {
    current.products = await Product.countDocuments({ 
      store: this.store,
      status: 'active'
    });
    
    const orders = await Order.find({
      store: this.store,
      createdAt: { $gte: current.period.start, $lte: current.period.end }
    });
    
    current.orders = orders.length;
    current.revenue = orders.reduce((sum, order) => sum + order.total, 0);
  }

  await this.save();
};

// Check if trial period ended
subscriptionSchema.methods.isTrialExpired = function() {
  if (this.status !== 'trial') return false;
  return new Date() > this.billing.trialEndsAt;
};

// Indexes
subscriptionSchema.index({ user: 1 });
subscriptionSchema.index({ store: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ 'billing.nextBillingDate': 1 });

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;