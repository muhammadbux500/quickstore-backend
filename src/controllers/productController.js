const Product = require('../models/Product');
const Category = require('../models/Category');
const Store = require('../models/Store');
const { validationResult } = require('express-validator');
const { uploadToS3 } = require('../services/uploadService');
const slugify = require('slugify');

// @desc    Create product
// @route   POST /api/stores/:storeId/products
// @access  Private
exports.createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { storeId } = req.params;
    const {
      name, description, price, comparePrice, cost,
      sku, barcode, quantity, category, tags,
      images, variants, weight, dimensions,
      seo, status
    } = req.body;

    // Check if store exists and user owns it
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    if (store.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Check product limit based on plan
    const productCount = await Product.countDocuments({ store: storeId });
    const planLimits = {
      starter: 100,
      professional: 1000,
      enterprise: -1 // unlimited
    };

    const limit = planLimits[store.plan];
    if (limit !== -1 && productCount >= limit) {
      return res.status(400).json({
        success: false,
        message: `You have reached the maximum number of products (${limit}) for your plan`
      });
    }

    // Create product
    const product = await Product.create({
      store: storeId,
      name,
      slug: slugify(name, { lower: true }),
      description,
      price,
      comparePrice,
      cost,
      sku,
      barcode,
      quantity,
      category,
      tags: tags || [],
      images: images || [],
      variants: variants || [],
      weight,
      dimensions,
      seo,
      status: status || 'draft',
      createdBy: req.user.id
    });

    // Update store product count
    store.productCount = productCount + 1;
    await store.save();

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all products for store
// @route   GET /api/stores/:storeId/products
// @access  Private
exports.getProducts = async (req, res) => {
  try {
    const { storeId } = req.params;
    const {
      page = 1,
      limit = 10,
      category,
      status,
      search,
      sort = '-createdAt'
    } = req.query;

    // Build query
    const query = { store: storeId };
    
    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const products = await Product.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('category', 'name slug');

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single product
// @route   GET /api/stores/:storeId/products/:id
// @access  Private
exports.getProduct = async (req, res) => {
  try {
    const { storeId, id } = req.params;

    const product = await Product.findOne({
      _id: id,
      store: storeId
    }).populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update product
// @route   PUT /api/stores/:storeId/products/:id
// @access  Private
exports.updateProduct = async (req, res) => {
  try {
    const { storeId, id } = req.params;

    const product = await Product.findOne({
      _id: id,
      store: storeId
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user owns the store
    const store = await Store.findById(storeId);
    if (store.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Update fields
    const updates = [
      'name', 'description', 'price', 'comparePrice', 'cost',
      'sku', 'barcode', 'quantity', 'category', 'tags',
      'images', 'variants', 'weight', 'dimensions', 'seo', 'status'
    ];

    updates.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    // Update slug if name changed
    if (req.body.name) {
      product.slug = slugify(req.body.name, { lower: true });
    }

    await product.save();

    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/stores/:storeId/products/:id
// @access  Private
exports.deleteProduct = async (req, res) => {
  try {
    const { storeId, id } = req.params;

    const product = await Product.findOne({
      _id: id,
      store: storeId
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user owns the store
    const store = await Store.findById(storeId);
    if (store.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await product.deleteOne();

    // Update store product count
    store.productCount = Math.max(0, store.productCount - 1);
    await store.save();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Bulk update products
// @route   POST /api/stores/:storeId/products/bulk
// @access  Private
exports.bulkUpdateProducts = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { products, action } = req.body;

    // Check if user owns the store
    const store = await Store.findById(storeId);
    if (store.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const productIds = products.map(p => p.id);

    switch(action) {
      case 'delete':
        await Product.deleteMany({ _id: { $in: productIds } });
        store.productCount -= products.length;
        await store.save();
        break;

      case 'updateStatus':
        await Product.updateMany(
          { _id: { $in: productIds } },
          { $set: { status: req.body.status } }
        );
        break;

      case 'updatePrice':
        await Product.updateMany(
          { _id: { $in: productIds } },
          { $set: { price: req.body.price } }
        );
        break;

      case 'updateCategory':
        await Product.updateMany(
          { _id: { $in: productIds } },
          { $set: { category: req.body.category } }
        );
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action'
        });
    }

    res.json({
      success: true,
      message: `${products.length} products updated successfully`
    });

  } catch (error) {
    console.error('Bulk update products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Upload product images
// @route   POST /api/stores/:storeId/products/:id/images
// @access  Private
exports.uploadProductImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload images'
      });
    }

    const { storeId, id } = req.params;

    const product = await Product.findOne({
      _id: id,
      store: storeId
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user owns the store
    const store = await Store.findById(storeId);
    if (store.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Upload images to cloud storage
    const uploadedImages = [];
    for (const file of req.files) {
      const imageUrl = await uploadToS3(file, 'product-images');
      uploadedImages.push({
        url: imageUrl,
        alt: product.name,
        isPrimary: product.images.length === 0 && uploadedImages.length === 0
      });
    }

    product.images.push(...uploadedImages);
    await product.save();

    res.json({
      success: true,
      data: { images: uploadedImages },
      message: `${uploadedImages.length} images uploaded successfully`
    });

  } catch (error) {
    console.error('Upload product images error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete product image
// @route   DELETE /api/stores/:storeId/products/:id/images/:imageId
// @access  Private
exports.deleteProductImage = async (req, res) => {
  try {
    const { storeId, id, imageId } = req.params;

    const product = await Product.findOne({
      _id: id,
      store: storeId
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user owns the store
    const store = await Store.findById(storeId);
    if (store.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Remove image
    product.images = product.images.filter(img => img._id.toString() !== imageId);
    
    // If primary image was deleted, set new primary
    if (product.images.length > 0 && !product.images.some(img => img.isPrimary)) {
      product.images[0].isPrimary = true;
    }

    await product.save();

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('Delete product image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Set primary image
// @route   PUT /api/stores/:storeId/products/:id/images/:imageId/primary
// @access  Private
exports.setPrimaryImage = async (req, res) => {
  try {
    const { storeId, id, imageId } = req.params;

    const product = await Product.findOne({
      _id: id,
      store: storeId
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user owns the store
    const store = await Store.findById(storeId);
    if (store.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Update primary image
    product.images.forEach(img => {
      img.isPrimary = img._id.toString() === imageId;
    });

    await product.save();

    res.json({
      success: true,
      message: 'Primary image set successfully'
    });

  } catch (error) {
    console.error('Set primary image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};