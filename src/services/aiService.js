const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// AI Service class
class AIService {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'openai'; // 'openai' or 'gemini'
  }

  // Generate store design
  async generateStoreDesign(prompt, industry, style, name) {
    try {
      const fullPrompt = `Create a complete e-commerce store design for a ${style || 'modern'} ${industry || 'store'} called ${name || 'My Store'}. 
      Description: ${prompt}
      
      Include:
      1. Homepage layout sections
      2. Color scheme with hex codes
      3. Recommended product categories
      4. Sample products with descriptions
      5. Key features and selling points
      6. Navigation structure
      7. Footer content
      
      Format the response as a structured JSON object.`;

      let response;
      
      if (this.provider === 'openai') {
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are an expert e-commerce designer and architect. Create detailed, professional store designs."
            },
            {
              role: "user",
              content: fullPrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 3000,
          response_format: { type: "json_object" }
        });

        response = JSON.parse(completion.choices[0].message.content);
      } else {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(fullPrompt);
        const text = result.response.text();
        
        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        response = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: 'Failed to parse response' };
      }

      return {
        success: true,
        data: response
      };

    } catch (error) {
      console.error('AI generate store design error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate product description
  async generateProductDescription(productData) {
    try {
      const { name, category, features, keywords, tone } = productData;

      const prompt = `Write a compelling product description for:
      Product Name: ${name}
      Category: ${category || 'General'}
      Key Features: ${features || 'Not specified'}
      Target Keywords: ${keywords || 'Not specified'}
      Tone: ${tone || 'professional'}
      
      Include:
      1. An engaging headline
      2. Short description (max 150 characters)
      3. Full description with benefits
      4. Technical specifications
      5. Call to action
      6. SEO meta title and description`;

      let response;

      if (this.provider === 'openai') {
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are an expert copywriter specializing in e-commerce product descriptions."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        });

        response = completion.choices[0].message.content;
      } else {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        response = result.response.text();
      }

      // Parse response into structured format
      const parsed = this.parseProductDescription(response);

      return {
        success: true,
        data: parsed
      };

    } catch (error) {
      console.error('AI generate product description error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate SEO tags
  async generateSEOTags(content, type = 'product', keywords = '') {
    try {
      const prompt = `Generate comprehensive SEO meta tags for this ${type}:
      Content: ${content}
      Target Keywords: ${keywords}
      
      Provide:
      1. Meta Title (50-60 characters)
      2. Meta Description (150-160 characters)
      3. Focus Keywords (5-10 keywords)
      4. Open Graph Title
      5. Open Graph Description
      6. Twitter Card Title
      7. Twitter Card Description
      
      Format as JSON.`;

      let response;

      if (this.provider === 'openai') {
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are an SEO expert. Generate optimized meta tags."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.5,
          max_tokens: 500,
          response_format: { type: "json_object" }
        });

        response = JSON.parse(completion.choices[0].message.content);
      } else {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt + '\n\nReturn as valid JSON.');
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        response = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: 'Failed to parse response' };
      }

      return {
        success: true,
        data: response
      };

    } catch (error) {
      console.error('AI generate SEO tags error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate image with DALL-E
  async generateImage(prompt, style = 'professional') {
    try {
      const enhancedPrompt = `${style} product photography: ${prompt}. High quality, 4K, detailed, professional lighting.`;

      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: enhancedPrompt,
        n: 1,
        size: "1024x1024",
        quality: "hd",
        style: "vivid"
      });

      return {
        success: true,
        data: {
          url: response.data[0].url,
          revisedPrompt: response.data[0].revised_prompt
        }
      };

    } catch (error) {
      console.error('AI generate image error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Analyze store performance
  async analyzeStorePerformance(storeData, products, orders) {
    try {
      const prompt = `Analyze this e-commerce store performance:
      
      Store: ${JSON.stringify(storeData)}
      Products: ${JSON.stringify(products.slice(0, 10))}
      Recent Orders: ${JSON.stringify(orders.slice(0, 20))}
      
      Provide:
      1. Overall store health score (0-100)
      2. Strengths and weaknesses
      3. Product recommendations
      4. Marketing suggestions
      5. Pricing optimization tips
      6. Customer retention strategies
      7. Conversion rate optimization ideas
      
      Format as JSON.`;

      let response;

      if (this.provider === 'openai') {
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are an e-commerce business analyst. Provide actionable insights."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.5,
          max_tokens: 2000,
          response_format: { type: "json_object" }
        });

        response = JSON.parse(completion.choices[0].message.content);
      } else {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt + '\n\nReturn as valid JSON.');
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        response = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: 'Failed to parse response' };
      }

      return {
        success: true,
        data: response
      };

    } catch (error) {
      console.error('AI analyze store error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Chat with AI assistant
  async chat(message, context = {}) {
    try {
      const systemPrompt = `You are QuickAI, an expert e-commerce assistant for QuickStore platform.
      Current context: ${JSON.stringify(context)}
      
      Help users with:
      - Store setup and management
      - Product listing optimization
      - Marketing strategies
      - Customer service
      - Technical issues
      - Business growth tips
      
      Be friendly, professional, and provide specific actionable advice.`;

      let response;

      if (this.provider === 'openai') {
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: message
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        });

        response = completion.choices[0].message.content;
      } else {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(`${systemPrompt}\n\nUser: ${message}`);
        response = result.response.text();
      }

      return {
        success: true,
        data: {
          message: response,
          timestamp: new Date()
        }
      };

    } catch (error) {
      console.error('AI chat error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Helper: Parse product description
  parseProductDescription(text) {
    const result = {
      headline: '',
      shortDescription: '',
      fullDescription: '',
      specifications: [],
      callToAction: '',
      seo: {
        title: '',
        description: ''
      }
    };

    // Extract sections using regex
    const headlineMatch = text.match(/headline:?\s*(.+?)(?=\n|$)/i);
    if (headlineMatch) result.headline = headlineMatch[1].trim();

    const shortDescMatch = text.match(/short description:?\s*(.+?)(?=\n|$)/i);
    if (shortDescMatch) result.shortDescription = shortDescMatch[1].trim();

    const fullDescMatch = text.match(/full description:?\s*([\s\S]+?)(?=\n\n|specifications:|$)/i);
    if (fullDescMatch) result.fullDescription = fullDescMatch[1].trim();

    const specsMatch = text.match(/specifications?:?\s*([\s\S]+?)(?=\n\n|call to action:|$)/i);
    if (specsMatch) {
      result.specifications = specsMatch[1]
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^[•\-*]\s*/, '').trim());
    }

    const ctaMatch = text.match(/call to action:?\s*(.+?)(?=\n|$)/i);
    if (ctaMatch) result.callToAction = ctaMatch[1].trim();

    const seoTitleMatch = text.match(/meta title:?\s*(.+?)(?=\n|$)/i);
    if (seoTitleMatch) result.seo.title = seoTitleMatch[1].trim();

    const seoDescMatch = text.match(/meta description:?\s*(.+?)(?=\n|$)/i);
    if (seoDescMatch) result.seo.description = seoDescMatch[1].trim();

    return result;
  }
}

module.exports = new AIService();