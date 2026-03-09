const mongoose = require('mongoose');

const affiliateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  referralCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended', 'banned'],
    default: 'pending'
  },
  tier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze'
  },
  commissionRate: {
    type: Number,
    default: 10,
    min: 0,
    max: 50
  },
  website: String,
  niche: String,
  promoMethods: [{
    type: String,
    enum: ['social', 'blog', 'youtube', 'email', 'paid_ads', 'other']
  }],
  taxInfo: {
    taxId: String,
    taxCountry: String,
    taxType: {
      type: String,
      enum: ['individual', 'business']
    },
    businessName: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    }
  },
  paymentInfo: {
    method: {
      type: String,
      enum: ['paypal', 'bank_transfer', 'stripe']
    },
    paypalEmail: String,
    bankAccount: {
      accountName: String,
      accountNumber: String,
      routingNumber: String,
      bankName: String,
      bankCountry: String,
      swiftCode: String
    },
    stripeAccountId: String
  },
  stats: {
    totalClicks: {
      type: Number,
      default: 0
    },
    totalConversions: {
      type: Number,
      default: 0
    },
    totalEarnings: {
      type: Number,
      default: 0
    },
    pendingEarnings: {
      type: Number,
      default: 0
    },
    paidEarnings: {
      type: Number,
      default: 0
    },
    conversionRate: {
      type: Number,
      default: 0
    },
    averageCommission: {
      type: Number,
      default: 0
    }
  },
  clicks: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    destination: String,
    ip: String,
    userAgent: String,
    referrer: String,
    utmSource: String,
    utmMedium: String,
    utmCampaign: String,
    converted: {
      type: Boolean,
      default: false
    },
    conversionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Commission'
    }
  }],
  customLinks: {
    type: Map,
    of: String
  },
  payoutRequests: [{
    amount: Number,
    paymentMethod: String,
    status: {
      type: String,
      enum: ['pending', 'processed', 'failed']
    },
    transactionId: String,
    requestedAt: {
      type: Date,
      default: Date.now
    },
    processedAt: Date,
    notes: String
  }],
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    },
    frequency: {
      type: String,
      enum: ['instant', 'daily', 'weekly'],
      default: 'daily'
    }
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  approvedAt: Date,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastPayoutAt: Date,
  nextPayoutAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Update stats
affiliateSchema.methods.updateStats = async function() {
  const Commission = mongoose.model('Commission');
  
  const stats = await Commission.aggregate([
    { $match: { affiliate: this._id } },
    {
      $group: {
        _id: '$status',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);

  this.stats.pendingEarnings = stats.find(s => s._id === 'pending')?.total || 0;
  this.stats.paidEarnings = stats.find(s => s._id === 'paid')?.total || 0;
  this.stats.totalEarnings = this.stats.pendingEarnings + this.stats.paidEarnings;

  if (this.stats.totalClicks > 0) {
    this.stats.conversionRate = (this.stats.totalConversions / this.stats.totalClicks) * 100;
  }

  await this.save();
};

// Calculate next tier
affiliateSchema.methods.calculateTier = function() {
  if (this.stats.totalEarnings >= 10000) {
    this.tier = 'platinum';
    this.commissionRate = 20;
  } else if (this.stats.totalEarnings >= 5000) {
    this.tier = 'gold';
    this.commissionRate = 15;
  } else if (this.stats.totalEarnings >= 1000) {
    this.tier = 'silver';
    this.commissionRate = 12;
  } else {
    this.tier = 'bronze';
    this.commissionRate = 10;
  }
};

// Indexes
affiliateSchema.index({ user: 1 });
affiliateSchema.index({ referralCode: 1 });
affiliateSchema.index({ status: 1 });
affiliateSchema.index({ tier: 1 });

const Affiliate = mongoose.model('Affiliate', affiliateSchema);
module.exports = Affiliate;