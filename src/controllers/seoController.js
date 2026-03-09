const Store = require('../models/Store');
const Product = require('../models/Product');
const SEOSettings = require('../models/SEOSettings');
const { validationResult } = require('express-validator');
const { generateSitemap } = require('../services/sitemapService');
const { generateMetaTags } = require('../services/seoService');

// @desc    Get SEO settings for store
// @route   GET /api/seo/:storeId
// @access  Private
exports.getSEOSettings = async (req, res) => {
  try {
    const { storeId } = req.params;

    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Check if user owns the store
    if (store.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    let seoSettings = await SEOSettings.findOne({ store: storeId });
    if (!seoSettings) {
      // Create default SEO settings
      seoSettings = await SEOSettings.create({
        store: storeId,
        title: store.name,
        description: store.description || 'Online store powered by QuickStore',
        keywords: [],
        ogImage: store.logo,
        twitterCard: 'summary_large_image',
        robots: 'index,follow'
      });
    }

    res.json({
      success: true,
      data: seoSettings
    });

  } catch (error) {
    console.error('Get SEO settings error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update SEO settings
// @route   PUT /api/seo/:storeId
// @access  Private
exports.updateSEOSettings = async (req, res) => {
  try {
    const { storeId } = req.params;
    const {
      title,
      description,
      keywords,
      ogTitle,
      ogDescription,
      ogImage,
      twitterCard,
      twitterTitle,
      twitterDescription,
      twitterImage,
      canonicalUrl,
      robots,
      structuredData
    } = req.body;

    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Check if user owns the store
    if (store.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const seoSettings = await SEOSettings.findOneAndUpdate(
      { store: storeId },
      {
        title,
        description,
        keywords,
        ogTitle,
        ogDescription,
        ogImage,
        twitterCard,
        twitterTitle,
        twitterDescription,
        twitterImage,
        canonicalUrl,
        robots,
        structuredData,
        updatedAt: new Date()
      },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      data: seoSettings,
      message: 'SEO settings updated successfully'
    });

  } catch (error) {
    console.error('Update SEO settings error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Generate sitemap
// @route   POST /api/seo/:storeId/sitemap
// @access  Private
exports.generateSitemap = async (req, res) => {
  try {
    const { storeId } = req.params;

    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Check if user owns the store
    if (store.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Generate sitemap
    const sitemapUrl = await generateSitemap(storeId);

    // Update SEO settings with sitemap URL
    await SEOSettings.findOneAndUpdate(
      { store: storeId },
      { sitemapUrl, sitemapGeneratedAt: new Date() }
    );

    res.json({
      success: true,
      data: { sitemapUrl },
      message: 'Sitemap generated successfully'
    });

  } catch (error) {
    console.error('Generate sitemap error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Generate meta tags for product
// @route   POST /api/seo/product/:productId
// @access  Private
exports.generateProductMetaTags = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId).populate('store');
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Generate meta tags using AI
    const metaTags = await generateMetaTags('product', {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      storeName: product.store.name
    });

    res.json({
      success: true,
      data: metaTags
    });

  } catch (error) {
    console.error('Generate product meta tags error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Analyze SEO for store
// @route   GET /api/seo/:storeId/analyze
// @access  Private
exports.analyzeSEO = async (req, res) => {
  try {
    const { storeId } = req.params;

    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    const products = await Product.find({ store: storeId });
    const seoSettings = await SEOSettings.findOne({ store: storeId });

    // SEO Analysis
    const analysis = {
      store: {
        name: store.name,
        url: store.url,
        hasTitle: !!(seoSettings?.title),
        hasDescription: !!(seoSettings?.description),
        hasKeywords: !!(seoSettings?.keywords?.length > 0),
        hasOgImage: !!(seoSettings?.ogImage),
        hasSitemap: !!(seoSettings?.sitemapUrl),
        titleLength: seoSettings?.title?.length || 0,
        descriptionLength: seoSettings?.description?.length || 0
      },
      products: {
        total: products.length,
        withTitle: products.filter(p => p.name && p.name.length > 0).length,
        withDescription: products.filter(p => p.description && p.description.length > 0).length,
        withImages: products.filter(p => p.images && p.images.length > 0).length,
        averageTitleLength: products.reduce((sum, p) => sum + (p.name?.length || 0), 0) / products.length,
        averageDescriptionLength: products.reduce((sum, p) => sum + (p.description?.length || 0), 0) / products.length
      },
      recommendations: []
    };

    // Generate recommendations
    if (!seoSettings?.title) {
      analysis.recommendations.push('Add a meta title for your store');
    } else if (seoSettings.title.length < 30) {
      analysis.recommendations.push('Meta title is too short (minimum 30 characters)');
    } else if (seoSettings.title.length > 60) {
      analysis.recommendations.push('Meta title is too long (maximum 60 characters)');
    }

    if (!seoSettings?.description) {
      analysis.recommendations.push('Add a meta description for your store');
    } else if (seoSettings.description.length < 120) {
      analysis.recommendations.push('Meta description is too short (minimum 120 characters)');
    } else if (seoSettings.description.length > 160) {
      analysis.recommendations.push('Meta description is too long (maximum 160 characters)');
    }

    if (!seoSettings?.ogImage) {
      analysis.recommendations.push('Add an Open Graph image for better social sharing');
    }

    if (!seoSettings?.sitemapUrl) {
      analysis.recommendations.push('Generate a sitemap for better search engine indexing');
    }

    res.json({
      success: true,
      data: analysis
    });

  } catch (error) {
    console.error('Analyze SEO error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get SEO keywords suggestions
// @route   GET /api/seo/:storeId/keywords
// @access  Private
exports.getKeywordSuggestions = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { query } = req.query;

    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Get products for keyword ideas
    const products = await Product.find({ store: storeId }).limit(20);

    // Generate keyword suggestions from products
    const productKeywords = products.flatMap(p => {
      const words = p.name.split(' ');
      return words.filter(w => w.length > 3);
    });

    // Get category keywords
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

    // Mock keyword suggestions (in production, use Google Keyword Planner API)
    const suggestions = [
      { keyword: store.category, volume: '1.2K', difficulty: 'Medium' },
      { keyword: `buy ${store.category}`, volume: '800', difficulty: 'High' },
      { keyword: `best ${store.category}`, volume: '2.1K', difficulty: 'High' },
      { keyword: `${store.category} online`, volume: '950', difficulty: 'Medium' },
      { keyword: `${store.category} store`, volume: '600', difficulty: 'Low' }
    ];

    // Add product-based suggestions
    productKeywords.slice(0, 5).forEach(keyword => {
      suggestions.push({
        keyword: keyword.toLowerCase(),
        volume: '100-500',
        difficulty: 'Low'
      });
    });

    // Add category suggestions
    categories.forEach(category => {
      suggestions.push({
        keyword: category,
        volume: '500-1K',
        difficulty: 'Medium'
      });
    });

    res.json({
      success: true,
      data: suggestions
    });

  } catch (error) {
    console.error('Get keyword suggestions error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};