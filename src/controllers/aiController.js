const OpenAI = require('openai');
const Store = require('../models/Store');
const Product = require('../models/Product');
const { validationResult } = require('express-validator');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// @desc    Generate store with AI
// @route   POST /api/ai/generate-store
// @access  Private
exports.generateStore = async (req, res) => {
  try {
    const { prompt, industry, style, name } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert e-commerce store designer. Create a complete store structure based on the user's requirements."
        },
        {
          role: "user",
          content: `Create a ${style || 'modern'} ${industry || 'e-commerce'} store called ${name || 'My Store'}. Description: ${prompt}. Include: homepage sections, product categories, color scheme, and recommended products.`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const aiResponse = completion.choices[0].message.content;

    // Parse AI response into structured data
    const storeDesign = parseStoreDesign(aiResponse);

    res.json({
      success: true,
      data: storeDesign
    });

  } catch (error) {
    console.error('Generate store error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Generate product description
// @route   POST /api/ai/generate-description
// @access  Private
exports.generateProductDescription = async (req, res) => {
  try {
    const { name, category, features, keywords, tone } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert e-commerce copywriter. Create compelling product descriptions that drive sales."
        },
        {
          role: "user",
          content: `Write a ${tone || 'professional'} product description for: ${name}\nCategory: ${category}\nFeatures: ${features}\nKeywords: ${keywords}\nInclude: benefits, specifications, and a call to action.`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const description = completion.choices[0].message.content;

    // Generate short version
    const shortCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Create a short, punchy product description (max 150 characters)."
        },
        {
          role: "user",
          content: `Short description for: ${name}`
        }
      ],
      temperature: 0.7,
      max_tokens: 100
    });

    const shortDescription = shortCompletion.choices[0].message.content;

    res.json({
      success: true,
      data: {
        full: description,
        short: shortDescription,
        seo: {
          metaTitle: `${name} | Buy Online at Best Price`,
          metaDescription: shortDescription.substring(0, 160)
        }
      }
    });

  } catch (error) {
    console.error('Generate description error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Generate SEO tags
// @route   POST /api/ai/generate-seo
// @access  Private
exports.generateSEOTags = async (req, res) => {
  try {
    const { content, type, keywords } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an SEO expert. Generate optimized meta tags and keywords."
        },
        {
          role: "user",
          content: `Generate SEO tags for this ${type || 'content'}:\n${content}\nTarget keywords: ${keywords || 'none provided'}`
        }
      ],
      temperature: 0.5,
      max_tokens: 500
    });

    const seoTags = completion.choices[0].message.content;

    // Parse SEO tags
    const parsed = {
      title: extractSEOTag(seoTags, 'Title'),
      description: extractSEOTag(seoTags, 'Description'),
      keywords: extractSEOTag(seoTags, 'Keywords'),
      ogTitle: extractSEOTag(seoTags, 'OG Title'),
      ogDescription: extractSEOTag(seoTags, 'OG Description'),
      twitterTitle: extractSEOTag(seoTags, 'Twitter Title'),
      twitterDescription: extractSEOTag(seoTags, 'Twitter Description')
    };

    res.json({
      success: true,
      data: parsed
    });

  } catch (error) {
    console.error('Generate SEO tags error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Generate product image
// @route   POST /api/ai/generate-image
// @access  Private
exports.generateImage = async (req, res) => {
  try {
    const { prompt, style } = req.body;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `${style || 'Professional product photo'}: ${prompt}`,
      n: 1,
      size: "1024x1024",
      quality: "hd"
    });

    res.json({
      success: true,
      data: {
        url: response.data[0].url,
        revisedPrompt: response.data[0].revised_prompt
      }
    });

  } catch (error) {
    console.error('Generate image error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Analyze store performance
// @route   POST /api/ai/analyze/:storeId
// @access  Private
exports.analyzeStore = async (req, res) => {
  try {
    const { storeId } = req.params;

    const store = await Store.findById(storeId);
    const products = await Product.find({ store: storeId });
    const orders = await Order.find({ store: storeId }).limit(100);

    // Prepare analytics data for AI
    const analytics = {
      store: {
        name: store.name,
        age: Math.floor((Date.now() - store.createdAt) / (1000 * 60 * 60 * 24)),
        productCount: products.length,
        orderCount: orders.length,
        revenue: orders.reduce((sum, o) => sum + o.total, 0),
        averageOrderValue: orders.length > 0 
          ? orders.reduce((sum, o) => sum + o.total, 0) / orders.length 
          : 0
      },
      products: products.map(p => ({
        name: p.name,
        price: p.price,
        sales: orders.filter(o => 
          o.items.some(i => i.product.toString() === p._id.toString())
        ).length,
        rating: p.rating || 0
      }))
    };

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an e-commerce analyst. Analyze store performance and provide actionable recommendations."
        },
        {
          role: "user",
          content: `Analyze this store data and provide recommendations:\n${JSON.stringify(analytics, null, 2)}`
        }
      ],
      temperature: 0.5,
      max_tokens: 1000
    });

    const analysis = completion.choices[0].message.content;

    // Extract recommendations
    const recommendations = extractRecommendations(analysis);

    res.json({
      success: true,
      data: {
        analysis,
        recommendations,
        insights: {
          topProducts: analytics.products.sort((a, b) => b.sales - a.sales).slice(0, 5),
          needsImprovement: analytics.products.filter(p => p.sales === 0).map(p => p.name),
          averageOrderValue: analytics.averageOrderValue,
          conversionRate: orders.length > 0 
            ? (orders.filter(o => o.status === 'delivered').length / orders.length) * 100 
            : 0
        }
      }
    });

  } catch (error) {
    console.error('Analyze store error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Chat with AI assistant
// @route   POST /api/ai/chat
// @access  Private
exports.chatWithAI = async (req, res) => {
  try {
    const { message, context } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are QuickAI, an expert e-commerce assistant for QuickStore. Help users with store management, marketing, and business advice."
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const reply = completion.choices[0].message.content;

    res.json({
      success: true,
      data: {
        reply,
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error('Chat with AI error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper functions
function parseStoreDesign(aiResponse) {
  // Parse AI response into structured format
  const sections = [];
  const lines = aiResponse.split('\n');
  
  let currentSection = null;
  
  lines.forEach(line => {
    if (line.includes('Section:') || line.includes('SECTION:')) {
      if (currentSection) sections.push(currentSection);
      currentSection = {
        name: line.replace(/Section:|SECTION:/i, '').trim(),
        content: []
      };
    } else if (currentSection) {
      currentSection.content.push(line.trim());
    }
  });
  
  if (currentSection) sections.push(currentSection);

  return {
    sections,
    raw: aiResponse,
    colors: extractColors(aiResponse),
    products: extractProducts(aiResponse)
  };
}

function extractColors(text) {
  const colors = [];
  const colorMatches = text.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}|(?:red|blue|green|yellow|purple|pink|orange|teal|cyan|indigo|violet|rose|amber|lime|emerald)/gi);
  if (colorMatches) {
    colors.push(...colorMatches.slice(0, 5));
  }
  return colors;
}

function extractProducts(text) {
  const products = [];
  const productLines = text.split('\n').filter(line => 
    line.includes('Product:') || line.includes('PRODUCT:')
  );
  
  productLines.forEach(line => {
    const parts = line.split(':');
    if (parts.length > 1) {
      products.push(parts[1].trim());
    }
  });
  
  return products.slice(0, 8);
}

function extractSEOTag(text, tagName) {
  const regex = new RegExp(`${tagName}:?\\s*(.+?)(?=\\n|$)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : '';
}

function extractRecommendations(text) {
  const recommendations = [];
  const lines = text.split('\n');
  
  lines.forEach(line => {
    if (line.includes('Recommendation:') || line.includes('RECOMMENDATION:')) {
      recommendations.push(line.replace(/Recommendation:|RECOMMENDATION:/i, '').trim());
    } else if (line.match(/^\d+\./)) {
      recommendations.push(line.replace(/^\d+\./, '').trim());
    }
  });
  
  return recommendations;
}