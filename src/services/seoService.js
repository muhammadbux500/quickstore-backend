const axios = require('axios');
const { JSDOM } = require('jsdom');
const sitemap = require('sitemap');
const { createGzip } = require('zlib');
const { Readable } = require('stream');

class SEOService {
  constructor() {
    this.userAgent = 'QuickStore SEO Bot';
  }

  // Generate sitemap
  async generateSitemap(storeId, baseUrl, pages) {
    try {
      const sitemapStream = new sitemap.SitemapStream({
        hostname: baseUrl,
        cacheTime: 600000 // 10 minutes
      });

      // Add pages to sitemap
      pages.forEach(page => {
        sitemapStream.write({
          url: page.url,
          changefreq: page.changefreq || 'weekly',
          priority: page.priority || 0.5,
          lastmod: page.lastmod || new Date().toISOString()
        });
      });

      sitemapStream.end();

      // Convert to string
      let sitemapString = '';
      const data = await new Promise((resolve, reject) => {
        const chunks = [];
        sitemapStream
          .pipe(createGzip())
          .on('data', chunk => chunks.push(chunk))
          .on('end', () => resolve(Buffer.concat(chunks)))
          .on('error', reject);
      });

      return {
        success: true,
        sitemap: data.toString('base64'),
        url: `${baseUrl}/sitemap.xml`
      };

    } catch (error) {
      console.error('Generate sitemap error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate robots.txt
  generateRobotsTxt(baseUrl, sitemapUrl) {
    const content = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /dashboard/
Disallow: /api/
Disallow: /cart/
Disallow: /checkout/

# Sitemap
Sitemap: ${sitemapUrl || `${baseUrl}/sitemap.xml`}

# Crawl-delay
Crawl-delay: 10

# Host
Host: ${baseUrl}
`;

    return content;
  }

  // Generate meta tags
  generateMetaTags(data) {
    const {
      title,
      description,
      keywords,
      ogTitle,
      ogDescription,
      ogImage,
      ogUrl,
      twitterCard,
      twitterTitle,
      twitterDescription,
      twitterImage,
      canonicalUrl,
      robots = 'index,follow'
    } = data;

    const tags = [
      `<title>${this.escapeHtml(title)}</title>`,
      `<meta name="description" content="${this.escapeHtml(description)}">`,
      `<meta name="keywords" content="${this.escapeHtml(keywords)}">`,
      `<meta name="robots" content="${robots}">`,
      
      // Open Graph
      `<meta property="og:title" content="${this.escapeHtml(ogTitle || title)}">`,
      `<meta property="og:description" content="${this.escapeHtml(ogDescription || description)}">`,
      `<meta property="og:image" content="${ogImage}">`,
      `<meta property="og:url" content="${ogUrl}">`,
      `<meta property="og:type" content="website">`,
      
      // Twitter Card
      `<meta name="twitter:card" content="${twitterCard || 'summary_large_image'}">`,
      `<meta name="twitter:title" content="${this.escapeHtml(twitterTitle || title)}">`,
      `<meta name="twitter:description" content="${this.escapeHtml(twitterDescription || description)}">`,
      `<meta name="twitter:image" content="${twitterImage || ogImage}">`,
      
      // Canonical
      `<link rel="canonical" href="${canonicalUrl || ogUrl}">`,
      
      // JSON-LD structured data
      `<script type="application/ld+json">${JSON.stringify(this.generateStructuredData(data))}</script>`
    ];

    return tags.filter(Boolean).join('\n');
  }

  // Generate structured data (JSON-LD)
  generateStructuredData(data) {
    const base = {
      '@context': 'https://schema.org',
      '@type': data.type || 'WebSite',
      'name': data.name,
      'description': data.description,
      'url': data.url
    };

    switch (data.type) {
      case 'Product':
        return {
          ...base,
          'image': data.images,
          'brand': {
            '@type': 'Brand',
            'name': data.brand
          },
          'offers': {
            '@type': 'Offer',
            'price': data.price,
            'priceCurrency': data.currency || 'USD',
            'availability': data.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            'url': data.url
          },
          'aggregateRating': data.rating ? {
            '@type': 'AggregateRating',
            'ratingValue': data.rating,
            'reviewCount': data.reviewCount
          } : undefined
        };

      case 'Store':
        return {
          ...base,
          '@type': 'Store',
          'address': {
            '@type': 'PostalAddress',
            'streetAddress': data.address,
            'addressLocality': data.city,
            'addressRegion': data.state,
            'postalCode': data.zipCode,
            'addressCountry': data.country
          },
          'telephone': data.phone,
          'email': data.email,
          'openingHours': data.hours,
          'priceRange': data.priceRange
        };

      default:
        return base;
    }
  }

  // Analyze page SEO
  async analyzePage(url) {
    try {
      // Fetch page
      const response = await axios.get(url, {
        headers: {
          'User-Agent': this.userAgent
        },
        timeout: 10000
      });

      const html = response.data;
      const dom = new JSDOM(html);
      const document = dom.window.document;

      // Extract meta tags
      const title = document.querySelector('title')?.textContent;
      const metaDescription = document.querySelector('meta[name="description"]')?.content;
      const metaKeywords = document.querySelector('meta[name="keywords"]')?.content;
      const canonical = document.querySelector('link[rel="canonical"]')?.href;
      const ogTitle = document.querySelector('meta[property="og:title"]')?.content;
      const ogDescription = document.querySelector('meta[property="og:description"]')?.content;
      const ogImage = document.querySelector('meta[property="og:image"]')?.content;
      const twitterCard = document.querySelector('meta[name="twitter:card"]')?.content;
      const h1Tags = Array.from(document.querySelectorAll('h1')).map(h => h.textContent);
      const h2Tags = Array.from(document.querySelectorAll('h2')).map(h => h.textContent);

      // Check images for alt text
      const images = Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.src,
        alt: img.alt,
        hasAlt: !!img.alt
      }));

      const imagesWithoutAlt = images.filter(img => !img.hasAlt).length;

      // Check links
      const links = Array.from(document.querySelectorAll('a')).map(a => ({
        href: a.href,
        text: a.textContent,
        hasText: !!a.textContent.trim()
      }));

      const linksWithoutText = links.filter(l => !l.hasText).length;

      // Calculate scores
      const analysis = {
        url,
        title: {
          content: title,
          length: title?.length || 0,
          score: this.scoreTitle(title)
        },
        metaDescription: {
          content: metaDescription,
          length: metaDescription?.length || 0,
          score: this.scoreMetaDescription(metaDescription)
        },
        metaKeywords: metaKeywords?.split(',').map(k => k.trim()) || [],
        canonical: {
          present: !!canonical,
          url: canonical
        },
        openGraph: {
          title: !!ogTitle,
          description: !!ogDescription,
          image: !!ogImage,
          score: [ogTitle, ogDescription, ogImage].filter(Boolean).length
        },
        twitterCard: {
          present: !!twitterCard,
          type: twitterCard
        },
        headings: {
          h1: {
            count: h1Tags.length,
            content: h1Tags,
            score: this.scoreHeadings(h1Tags, 'h1')
          },
          h2: {
            count: h2Tags.length,
            content: h2Tags,
            score: this.scoreHeadings(h2Tags, 'h2')
          }
        },
        images: {
          total: images.length,
          withoutAlt: imagesWithoutAlt,
          score: images.length > 0 ? ((images.length - imagesWithoutAlt) / images.length) * 100 : 100
        },
        links: {
          total: links.length,
          withoutText: linksWithoutText,
          score: links.length > 0 ? ((links.length - linksWithoutText) / links.length) * 100 : 100
        },
        content: {
          wordCount: this.countWords(document.body.textContent),
          score: this.scoreContent(document.body.textContent)
        },
        recommendations: []
      };

      // Generate recommendations
      if (!title) {
        analysis.recommendations.push('Add a title tag');
      } else if (title.length < 30) {
        analysis.recommendations.push('Title tag is too short (minimum 30 characters)');
      } else if (title.length > 60) {
        analysis.recommendations.push('Title tag is too long (maximum 60 characters)');
      }

      if (!metaDescription) {
        analysis.recommendations.push('Add a meta description');
      } else if (metaDescription.length < 120) {
        analysis.recommendations.push('Meta description is too short (minimum 120 characters)');
      } else if (metaDescription.length > 160) {
        analysis.recommendations.push('Meta description is too long (maximum 160 characters)');
      }

      if (!canonical) {
        analysis.recommendations.push('Add a canonical URL');
      }

      if (!ogTitle || !ogDescription || !ogImage) {
        analysis.recommendations.push('Add Open Graph tags for better social sharing');
      }

      if (h1Tags.length === 0) {
        analysis.recommendations.push('Add an H1 heading');
      } else if (h1Tags.length > 1) {
        analysis.recommendations.push('Multiple H1 headings found (should be only one)');
      }

      if (imagesWithoutAlt > 0) {
        analysis.recommendations.push(`${imagesWithoutAlt} images missing alt text`);
      }

      if (linksWithoutText > 0) {
        analysis.recommendations.push(`${linksWithoutText} links missing text`);
      }

      if (analysis.content.wordCount < 300) {
        analysis.recommendations.push('Page content is too thin (aim for at least 300 words)');
      }

      // Calculate overall score
      const scores = [
        analysis.title.score,
        analysis.metaDescription.score,
        analysis.openGraph.score * 33, // 3 items * 33 = 100
        analysis.images.score,
        analysis.links.score,
        analysis.content.score,
        analysis.headings.h1.score,
        analysis.headings.h2.score * 50 // 2 items * 50 = 100
      ].filter(s => !isNaN(s));

      analysis.overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

      return {
        success: true,
        data: analysis
      };

    } catch (error) {
      console.error('Analyze page error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Score title
  scoreTitle(title) {
    if (!title) return 0;
    const length = title.length;
    if (length >= 30 && length <= 60) return 100;
    if (length > 60) return 70;
    if (length < 30) return 50;
    return 0;
  }

  // Score meta description
  scoreMetaDescription(description) {
    if (!description) return 0;
    const length = description.length;
    if (length >= 120 && length <= 160) return 100;
    if (length > 160) return 70;
    if (length < 120) return 50;
    return 0;
  }

  // Score headings
  scoreHeadings(headings, type) {
    if (type === 'h1') {
      return headings.length === 1 ? 100 : headings.length > 1 ? 50 : 0;
    }
    if (type === 'h2') {
      return headings.length > 0 ? Math.min(headings.length * 10, 100) : 0;
    }
    return 0;
  }

  // Score content
  scoreContent(content) {
    const wordCount = this.countWords(content);
    if (wordCount >= 1000) return 100;
    if (wordCount >= 500) return 80;
    if (wordCount >= 300) return 60;
    if (wordCount >= 200) return 40;
    if (wordCount >= 100) return 20;
    return 0;
  }

  // Count words
  countWords(text) {
    return text.trim().split(/\s+/).length;
  }

  // Escape HTML
  escapeHtml(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Generate keyword suggestions
  async generateKeywordSuggestions(query) {
    try {
      // Use Google Keyword Planner or similar API
      // This is a mock implementation
      const suggestions = [
        { keyword: query, volume: '1.2K', difficulty: 'Medium' },
        { keyword: `best ${query}`, volume: '800', difficulty: 'High' },
        { keyword: `buy ${query} online`, volume: '600', difficulty: 'Medium' },
        { keyword: `${query} near me`, volume: '400', difficulty: 'Low' },
        { keyword: `cheap ${query}`, volume: '350', difficulty: 'Medium' },
        { keyword: `${query} review`, volume: '300', difficulty: 'Low' },
        { keyword: `${query} price`, volume: '280', difficulty: 'Low' },
        { keyword: `${query} sale`, volume: '250', difficulty: 'Medium' }
      ];

      return {
        success: true,
        data: suggestions
      };

    } catch (error) {
      console.error('Generate keyword suggestions error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Check backlinks
  async checkBacklinks(url) {
    try {
      // Use backlink API (e.g., Ahrefs, Moz)
      // This is a mock implementation
      return {
        success: true,
        data: {
          totalBacklinks: Math.floor(Math.random() * 1000),
          referringDomains: Math.floor(Math.random() * 100),
          dofollow: Math.floor(Math.random() * 800),
          nofollow: Math.floor(Math.random() * 200),
          topAnchors: [
            { text: 'click here', count: 50 },
            { text: 'read more', count: 30 },
            { text: url, count: 20 }
          ]
        }
      };

    } catch (error) {
      console.error('Check backlinks error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Check page speed
  async checkPageSpeed(url) {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/pagespeedonline/v5/runPagespeed`,
        {
          params: {
            url,
            strategy: 'mobile',
            key: process.env.GOOGLE_API_KEY
          }
        }
      );

      const data = response.data;
      const lighthouse = data.lighthouseResult;

      return {
        success: true,
        data: {
          score: lighthouse.categories.performance.score * 100,
          metrics: {
            firstContentfulPaint: this.extractMetric(lighthouse, 'first-contentful-paint'),
            speedIndex: this.extractMetric(lighthouse, 'speed-index'),
            largestContentfulPaint: this.extractMetric(lighthouse, 'largest-contentful-paint'),
            timeToInteractive: this.extractMetric(lighthouse, 'interactive'),
            totalBlockingTime: this.extractMetric(lighthouse, 'total-blocking-time'),
            cumulativeLayoutShift: this.extractMetric(lighthouse, 'cumulative-layout-shift')
          },
          opportunities: lighthouse.audits ? Object.values(lighthouse.audits)
            .filter(a => a.details && a.details.type === 'opportunity')
            .map(a => ({
              title: a.title,
              description: a.description,
              score: a.score
            })) : []
        }
      };

    } catch (error) {
      console.error('Check page speed error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Extract metric from Lighthouse
  extractMetric(lighthouse, id) {
    const audit = lighthouse.audits?.[id];
    if (!audit) return null;
    
    return {
      value: audit.displayValue,
      score: audit.score
    };
  }
}

module.exports = new SEOService();