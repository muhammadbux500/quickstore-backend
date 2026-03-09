const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
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
  currency: {
    type: String,
    default: 'USD'
  },
  method: {
    type: String,
    enum: ['stripe', 'paypal', 'bank_transfer', 'cod'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  transactionId: String,
  paymentIntentId: String,
  payerId: String,
  paymentMethodId: String,
  receiptUrl: String,
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  refunds: [{
    amount: Number,
    reason: String,
    transactionId: String,
    status: {
      type: String,
      enum: ['pending', 'processed', 'failed']
    },
    processedAt: Date,
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    }
  }],
  refundedAmount: {
    type: Number,
    default: 0
  },
  fee: {
    type: Number,
    default: 0
  },
  net: {
    type: Number,
    default: 0
  },
  customer: {
    email: String,
    name: String,
    phone: String
  },
  billingDetails: {
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      country: String,
      postalCode: String
    }
  },
  errorDetails: {
    code: String,
    message: String,
    declineCode: String
  },
  processedAt: Date,
  completedAt: Date,
  failedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Calculate net amount
paymentSchema.pre('save', function(next) {
  this.net = this.amount - this.fee - this.refundedAmount;
  next();
});

// Check if refundable
paymentSchema.methods.isRefundable = function() {
  return this.status === 'completed' && this.refundedAmount < this.amount;
};

// Get remaining refundable amount
paymentSchema.methods.getRefundableAmount = function() {
  return this.amount - this.refundedAmount;
};

// Add refund
paymentSchema.methods.addRefund = function(refundData) {
  if (!this.isRefundable()) {
    throw new Error('Payment is not refundable');
  }

  this.refunds.push({
    ...refundData,
    processedAt: new Date()
  });

  this.refundedAmount += refundData.amount;

  if (this.refundedAmount >= this.amount) {
    this.status = 'refunded';
  } else if (this.refundedAmount > 0) {
    this.status = 'partially_refunded';
  }

  return this.save();
};

// Indexes
paymentSchema.index({ order: 1 });
paymentSchema.index({ store: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;