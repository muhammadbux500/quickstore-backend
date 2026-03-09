const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Store name is required'],
    trim: true,
    minlength: [3, 'Store name must be at least 3 characters'],
    maxlength: [50, 'Store name cannot exceed 50 characters']
  },
  url: {
    type: String,
    required: [true, 'Store URL is required'],
    unique: true,
    lowercase: true,
    trim: true,
    minlength: [3, 'Store URL must be at least 3 characters'],
    maxlength: [30, 'Store URL cannot exceed 30 characters'],
    match: [/^[a-z0-9-]+$/, 'Store URL can only contain lowercase letters, numbers, and hyphens']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    enum: ['fashion', 'electronics', 'home', 'beauty', 'food', 'sports', 'books', 'jewelry', 'pets', 'other']
  },
  logo: String,
  coverImage: String,
  favicon: String,
  plan: {
    type: String,
    enum: ['starter', 'professional', 'enterprise', 'custom'],
    default: 'starter'
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended', 'closed'],
    default: 'pending'
  },
  statusReason: String,
  statusUpdatedAt: Date,
  statusUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verified: {
    type: Boolean,
    default: false
  },
  verifiedAt: Date,
  settings: {
    currency: {
      type: String,
      default: 'USD'
    },
    language: {
      type: String,
      default: 'en'
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    email: String,
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    },
    taxRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    taxId: String,
    shippingRates: [{
      name: String,
      price: Number,
      estimatedDays: String,
      countries: [String]
    }],
    paymentMethods: [{
      type: String,
      enum: ['stripe', 'paypal', 'bank_transfer', 'cod']
    }],
    orderSettings: {
      autoConfirm: {
        type: Boolean,
        default: true
      },
      stockAlert: {
        type: Number,
        default: 5
      },
      orderPrefix: {
        type: String,
        default: 'ORD'
      },
      invoicePrefix: {
        type: String,
        default: 'INV'
      }
    },
    notificationSettings: {
      newOrder: {
        email: {
          type: Boolean,
          default: true
        },
        sms: {
          type: Boolean,
          default: false
        }
      },
      lowStock: {
        email: {
          type: Boolean,
          default: true
        },
        threshold: {
          type: Number,
          default: 5
        }
      }
    },
    seoSettings: {
      title: String,
      description: String,
      keywords: [String],
      googleAnalytics: String,
      facebookPixel: String
    }
  },
  paymentAccounts: {
    stripe: {
      accountId: String,
      accessToken: String,
      refreshToken: String,
      connectedAt: Date
    },
    paypal: {
      email: String,
      clientId: String,
      secret: String,
      connectedAt: Date
    }
  },
  theme: {
    current: {
      type: String,
      default: 'default'
    },
    colors: {
      primary: {
        type: String,
        default: '#3B82F6'
      },
      secondary: {
        type: String,
        default: '#8B5CF6'
      },
      accent: {
        type: String,
        default: '#EC4899'
      },
      background: {
        type: String,
        default: '#FFFFFF'
      },
      text: {
        type: String,
        default: '#111827'
      }
    },
    fonts: {
      heading: {
        type: String,
        default: 'Poppins'
      },
      body: {
        type: String,
        default: 'Inter'
      }
    },
    customCSS: String,
    lastModified: Date
  },
  domains: [{
    domain: String,
    verified: {
      type: Boolean,
      default: false
    },
    verifiedAt: Date,
    primary: {
      type: Boolean,
      default: false
    }
  }],
  stats: {
    productCount: {
      type: Number,
      default: 0
    },
    orderCount: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    },
    averageOrderValue: {
      type: Number,
      default: 0
    },
    conversionRate: {
      type: Number,
      default: 0
    },
    visitorCount: {
      type: Number,
      default: 0
    },
    lastOrderAt: Date
  },
  social: {
    facebook: String,
    instagram: String,
    twitter: String,
    pinterest: String,
    youtube: String,
    tiktok: String
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

// Virtual for full URL
storeSchema.virtual('fullUrl').get(function() {
  const customDomain = this.domains?.find(d => d.primary)?.domain;
  return customDomain ? `https://${customDomain}` : `https://${this.url}.quickstore.com`;
});

// Virtual for products
storeSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'store'
});

// Virtual for orders
storeSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'store'
});

// Update stats
storeSchema.methods.updateStats = async function() {
  const Order = mongoose.model('Order');
  
  const stats = await Order.aggregate([
    { $match: { store: this._id, paymentStatus: 'paid' } },
    {
      $group: {
        _id: null,
        orderCount: { $sum: 1 },
        totalRevenue: { $sum: '$total' },
        averageOrderValue: { $avg: '$total' }
      }
    }
  ]);

  if (stats.length > 0) {
    this.stats.orderCount = stats[0].orderCount;
    this.stats.totalRevenue = stats[0].totalRevenue;
    this.stats.averageOrderValue = stats[0].averageOrderValue || 0;
  }

  await this.save();
};

// Indexes
storeSchema.index({ url: 1 });
storeSchema.index({ owner: 1 });
storeSchema.index({ status: 1 });
storeSchema.index({ plan: 1 });
storeSchema.index({ createdAt: -1 });

const Store = mongoose.model('Store', storeSchema);
module.exports = Store;