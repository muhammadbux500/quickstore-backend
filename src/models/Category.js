const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    minlength: [2, 'Category name must be at least 2 characters'],
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  slug: {
    type: String,
    lowercase: true,
    unique: true
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  ancestors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  level: {
    type: Number,
    default: 0
  },
  image: String,
  icon: String,
  banner: String,
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  settings: {
    layout: {
      type: String,
      enum: ['grid', 'list', 'compact'],
      default: 'grid'
    },
    productsPerPage: {
      type: Number,
      default: 20
    },
    showSubcategories: {
      type: Boolean,
      default: true
    }
  },
  productCount: {
    type: Number,
    default: 0
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

// Virtual for full path
categorySchema.virtual('path').get(function() {
  return this.ancestors ? [...this.ancestors, this._id] : [this._id];
});

// Virtual for children
categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

// Virtual for products
categorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category'
});

// Update ancestors
categorySchema.pre('save', async function(next) {
  if (!this.isModified('parent') && !this.isNew) return next();

  if (!this.parent) {
    this.ancestors = [];
    this.level = 0;
  } else {
    const parent = await this.constructor.findById(this.parent);
    if (parent) {
      this.ancestors = [...parent.ancestors, parent._id];
      this.level = parent.level + 1;
    }
  }
  next();
});

// Ensure no circular reference
categorySchema.pre('save', async function(next) {
  if (this.parent && this.parent.toString() === this._id.toString()) {
    throw new Error('Category cannot be its own parent');
  }
  
  if (this.ancestors && this.ancestors.includes(this._id)) {
    throw new Error('Circular reference detected in category hierarchy');
  }
  next();
});

// Update product count
categorySchema.methods.updateProductCount = async function() {
  const Product = mongoose.model('Product');
  this.productCount = await Product.countDocuments({ 
    category: this._id,
    status: 'active'
  });
  await this.save();
};

// Indexes
categorySchema.index({ store: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ slug: 1 });
categorySchema.index({ isActive: 1 });

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;