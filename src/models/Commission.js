const mongoose = require('mongoose');

const commissionSchema = new mongoose.Schema({
  affiliate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Affiliate',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  rate: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'paid', 'cancelled'],
    default: 'pending'
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    name: String,
    price: Number,
    quantity: Number,
    commission: Number
  }],
  orderAmount: Number,
  orderNumber: String,
  customerEmail: String,
  payoutId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Affiliate.payoutRequests'
  },
  paidAt: Date,
  cancelledAt: Date,
  cancellationReason: String,
  notes: String,
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

// Update affiliate stats after save
commissionSchema.post('save', async function() {
  const Affiliate = mongoose.model('Affiliate');
  const affiliate = await Affiliate.findById(this.affiliate);
  if (affiliate) {
    await affiliate.updateStats();
    affiliate.calculateTier();
    await affiliate.save();
  }
});

// Update affiliate stats after update
commissionSchema.post('findOneAndUpdate', async function() {
  const doc = await this.model.findOne(this.getQuery());
  if (doc) {
    const Affiliate = mongoose.model('Affiliate');
    const affiliate = await Affiliate.findById(doc.affiliate);
    if (affiliate) {
      await affiliate.updateStats();
      affiliate.calculateTier();
      await affiliate.save();
    }
  }
});

// Indexes
commissionSchema.index({ affiliate: 1 });
commissionSchema.index({ order: 1 });
commissionSchema.index({ store: 1 });
commissionSchema.index({ status: 1 });
commissionSchema.index({ createdAt: -1 });

const Commission = mongoose.model('Commission', commissionSchema);
module.exports = Commission;