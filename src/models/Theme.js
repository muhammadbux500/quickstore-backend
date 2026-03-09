const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: String,
  version: {
    type: String,
    default: '1.0.0'
  },
  author: {
    name: String,
    email: String,
    website: String
  },
  type: {
    type: String,
    enum: ['free', 'premium', 'custom'],
    default: 'free'
  },
  price: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    enum: ['fashion', 'electronics', 'general', 'food', 'sports', 'books', 'jewelry']
  },
  tags: [String],
  features: [String],
  demo: {
    url: String,
    screenshot: String,
    video: String
  },
  preview: {
    desktop: String,
    mobile: String,
    tablet: String
  },
  thumbnail: String,
  screenshots: [String],
  colors: [{
    name: String,
    value: String
  }],
  fonts: {
    heading: String,
    body: String
  },
  layouts: [{
    name: String,
    template: String,
    screenshot: String
  }],
  settings: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  files: {
    css: String,
    js: String,
    templates: [{
      name: String,
      path: String,
      content: String
    }],
    assets: [{
      name: String,
      path: String,
      url: String
    }]
  },
  configurations: [{
    name: String,
    settings: Map,
    preview: String
  }],
  downloads: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: Number,
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  compatibility: {
    minVersion: String,
    maxVersion: String,
    platforms: [String]
  },
  documentation: {
    url: String,
    content: String
  },
  support: {
    email: String,
    url: String
  },
  changelog: [{
    version: String,
    date: Date,
    changes: [String]
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: Date,
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

// Virtual for stores using this theme
themeSchema.virtual('stores', {
  ref: 'Store',
  localField: '_id',
  foreignField: 'theme.current'
});

// Update rating
themeSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating.average = sum / this.reviews.length;
    this.rating.count = this.reviews.length;
  }
};

// Indexes
themeSchema.index({ slug: 1 });
themeSchema.index({ category: 1 });
themeSchema.index({ type: 1 });
themeSchema.index({ status: 1 });
themeSchema.index({ downloads: -1 });
themeSchema.index({ 'rating.average': -1 });

const Theme = mongoose.model('Theme', themeSchema);
module.exports = Theme;