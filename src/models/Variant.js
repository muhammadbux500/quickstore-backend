const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  sku: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  barcode: String,
  attributes: [{
    name: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  }],
  price: {
    type: Number,
    required: true,
    min: 0
  },
  comparePrice: {
    type: Number,
    min: 0
  },
  cost: {
    type: Number,
    min: 0
  },
  quantity: {
    type: Number,
    default: 0,
    min: 0
  },
  weight: {
    type: Number,
    min: 0
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  sales: {
    count: {
      type: Number,
      default: 0
    },
    revenue: {
      type: Number,
      default: 0
    }
  },
  lowStockThreshold: {
    type: Number,
    default: 5
  },
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

// Virtual for attribute string (for display)
variantSchema.virtual('attributeString').get(function() {
  return this.attributes.map(attr => `${attr.name}: ${attr.value}`).join(', ');
});

// Virtual for discount percentage
variantSchema.virtual('discountPercentage').get(function() {
  if (!this.comparePrice || this.comparePrice <= this.price) return 0;
  return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
});

// Virtual for profit margin
variantSchema.virtual('profitMargin').get(function() {
  if (!this.cost || this.price === 0) return 0;
  return Math.round(((this.price - this.cost) / this.price) * 100);
});

// Check if in stock
variantSchema.methods.inStock = function(quantity = 1) {
  return this.quantity >= quantity;
};

// Check if low stock
variantSchema.methods.isLowStock = function() {
  return this.quantity > 0 && this.quantity <= this.lowStockThreshold;
};

// Update sales
variantSchema.methods.addSale = function(quantity, revenue) {
  this.sales.count += quantity;
  this.sales.revenue += revenue;
  this.quantity -= quantity;
};

// Indexes
variantSchema.index({ product: 1 });
variantSchema.index({ store: 1 });
variantSchema.index({ sku: 1 }, { unique: true });
variantSchema.index({ 'attributes.name': 1, 'attributes.value': 1 });

const Variant = mongoose.model('Variant', variantSchema);
module.exports = Variant;