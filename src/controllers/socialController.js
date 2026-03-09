const SocialAccount = require('../models/SocialAccount');
const SocialPost = require('../models/SocialPost');
const Store = require('../models/Store');
const axios = require('axios');
const { validationResult } = require('express-validator');

// Facebook SDK configuration
const FB = require('fb').default;
FB.options({ version: 'v18.0' });

// @desc    Connect social media account
// @route   POST /api/social/connect
// @access  Private
exports.connectAccount = async (req, res) => {
  try {
    const { platform, accessToken, accountId, accountName } = req.body;

    // Verify token with platform
    let verified = false;
    let accountData = {};

    switch(platform) {
      case 'facebook':
        FB.setAccessToken(accessToken);
        const fbRes = await FB.api('me/accounts');
        const page = fbRes.data.find(p => p.id === accountId);
        if (page) {
          verified = true;
          accountData = {
            id: page.id,
            name: page.name,
            accessToken: page.access_token,
            category: page.category
          };
        }
        break;

      case 'instagram':
        // Instagram Business Account verification
        const igRes = await axios.get(`https://graph.facebook.com/v18.0/${accountId}`, {
          params: {
            fields: 'id,username,name,profile_picture_url',
            access_token: accessToken
          }
        });
        if (igRes.data) {
          verified = true;
          accountData = igRes.data;
        }
        break;

      case 'twitter':
        // Twitter verification
        const twitterRes = await axios.get('https://api.twitter.com/2/users/me', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (twitterRes.data) {
          verified = true;
          accountData = twitterRes.data.data;
        }
        break;

      case 'pinterest':
        // Pinterest verification
        const pinterestRes = await axios.get('https://api.pinterest.com/v5/user_account', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (pinterestRes.data) {
          verified = true;
          accountData = pinterestRes.data;
        }
        break;
    }

    if (!verified) {
      return res.status(400).json({
        success: false,
        message: 'Invalid access token or account ID'
      });
    }

    // Save or update social account
    const socialAccount = await SocialAccount.findOneAndUpdate(
      { platform, accountId },
      {
        user: req.user.id,
        platform,
        accessToken,
        accountId,
        accountName: accountName || accountData.name || accountData.username,
        accountData,
        connectedAt: new Date(),
        status: 'active'
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      data: socialAccount,
      message: `${platform} account connected successfully`
    });

  } catch (error) {
    console.error('Connect social account error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get connected accounts
// @route   GET /api/social/accounts
// @access  Private
exports.getAccounts = async (req, res) => {
  try {
    const accounts = await SocialAccount.find({ 
      user: req.user.id,
      status: 'active'
    });

    res.json({
      success: true,
      data: accounts
    });

  } catch (error) {
    console.error('Get social accounts error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Disconnect social account
// @route   DELETE /api/social/accounts/:id
// @access  Private
exports.disconnectAccount = async (req, res) => {
  try {
    const account = await SocialAccount.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    account.status = 'disconnected';
    account.disconnectedAt = new Date();
    await account.save();

    res.json({
      success: true,
      message: 'Account disconnected successfully'
    });

  } catch (error) {
    console.error('Disconnect account error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create social post
// @route   POST /api/social/posts
// @access  Private
exports.createPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { platforms, content, media, scheduledAt, productId } = req.body;

    const post = await SocialPost.create({
      user: req.user.id,
      platforms,
      content,
      media,
      scheduledAt,
      productId,
      status: scheduledAt ? 'scheduled' : 'draft',
      createdAt: new Date()
    });

    // If no scheduling, publish immediately
    if (!scheduledAt) {
      await publishPost(post._id);
    }

    res.status(201).json({
      success: true,
      data: post,
      message: scheduledAt ? 'Post scheduled' : 'Post created'
    });

  } catch (error) {
    console.error('Create social post error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get social posts
// @route   GET /api/social/posts
// @access  Private
exports.getPosts = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = { user: req.user.id };
    if (status) query.status = status;

    const posts = await SocialPost.find(query)
      .populate('productId', 'name images price')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await SocialPost.countDocuments(query);

    res.json({
      success: true,
      data: posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get social posts error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Auto-post product to social media
// @route   POST /api/social/auto-post
// @access  Private
exports.autoPostProduct = async (req, res) => {
  try {
    const { productId, platforms } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const accounts = await SocialAccount.find({
      user: req.user.id,
      platform: { $in: platforms },
      status: 'active'
    });

    if (accounts.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No active social accounts found'
      });
    }

    // Generate post content
    const content = {
      text: `Check out our new product: ${product.name}! 🛍️\n\n${product.description.substring(0, 100)}...\n\nPrice: $${product.price}\n\n#newproduct #shop #${product.category}`,
      link: `${process.env.FRONTEND_URL}/product/${product.slug}`,
      image: product.images[0]?.url
    };

    // Create post for each platform
    const posts = [];
    for (const account of accounts) {
      const post = await SocialPost.create({
        user: req.user.id,
        platforms: [account.platform],
        content,
        media: [{ url: content.image, type: 'image' }],
        productId,
        status: 'published',
        publishedAt: new Date()
      });

      // Publish to platform
      await publishToPlatform(account, post);
      posts.push(post);
    }

    res.json({
      success: true,
      data: posts,
      message: 'Product posted to social media'
    });

  } catch (error) {
    console.error('Auto post product error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get social media analytics
// @route   GET /api/social/analytics
// @access  Private
exports.getAnalytics = async (req, res) => {
  try {
    const { platform, startDate, endDate } = req.query;

    const accounts = await SocialAccount.find({
      user: req.user.id,
      platform: platform || { $exists: true },
      status: 'active'
    });

    const analytics = [];

    for (const account of accounts) {
      let accountAnalytics = { platform: account.platform, account: account.accountName };

      try {
        switch(account.platform) {
          case 'facebook':
            const fbRes = await FB.api(`${account.accountId}/insights`, {
              access_token: account.accessToken,
              metric: 'page_impressions,page_engaged_users,page_post_engagements',
              period: 'day',
              since: startDate,
              until: endDate
            });
            accountAnalytics.metrics = fbRes.data;
            break;

          case 'instagram':
            const igRes = await axios.get(`https://graph.facebook.com/v18.0/${account.accountId}/insights`, {
              params: {
                metric: 'impressions,reach,profile_views',
                period: 'day',
                since: startDate,
                until: endDate,
                access_token: account.accessToken
              }
            });
            accountAnalytics.metrics = igRes.data.data;
            break;

          case 'twitter':
            const twitterRes = await axios.get(`https://api.twitter.com/2/users/${account.accountId}/tweets`, {
              headers: { Authorization: `Bearer ${account.accessToken}` }
            });
            accountAnalytics.tweets = twitterRes.data;
            break;
        }
      } catch (error) {
        console.error(`Error fetching ${account.platform} analytics:`, error);
        accountAnalytics.error = error.message;
      }

      analytics.push(accountAnalytics);
    }

    res.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('Get social analytics error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper function to publish to platform
async function publishToPlatform(account, post) {
  try {
    switch(account.platform) {
      case 'facebook':
        await FB.api(`${account.accountId}/feed`, 'post', {
          message: post.content.text,
          link: post.content.link,
          access_token: account.accessToken
        });
        break;

      case 'instagram':
        // Instagram requires media container first
        const container = await axios.post(`https://graph.facebook.com/v18.0/${account.accountId}/media`, {
          image_url: post.media[0].url,
          caption: post.content.text,
          access_token: account.accessToken
        });

        await axios.post(`https://graph.facebook.com/v18.0/${account.accountId}/media_publish`, {
          creation_id: container.data.id,
          access_token: account.accessToken
        });
        break;

      case 'twitter':
        await axios.post('https://api.twitter.com/2/tweets', {
          text: post.content.text
        }, {
          headers: { Authorization: `Bearer ${account.accessToken}` }
        });
        break;
    }

    post.status = 'published';
    post.publishedAt = new Date();
    await post.save();

  } catch (error) {
    console.error(`Error publishing to ${account.platform}:`, error);
    post.status = 'failed';
    post.error = error.message;
    await post.save();
    throw error;
  }
}

// Helper function to publish scheduled posts
async function publishPost(postId) {
  const post = await SocialPost.findById(postId).populate('user');
  const accounts = await SocialAccount.find({
    user: post.user._id,
    platform: { $in: post.platforms },
    status: 'active'
  });

  for (const account of accounts) {
    try {
      await publishToPlatform(account, post);
    } catch (error) {
      console.error('Error publishing post:', error);
    }
  }
}

// Schedule publishing (run every minute)
setInterval(async () => {
  const now = new Date();
  const scheduledPosts = await SocialPost.find({
    status: 'scheduled',
    scheduledAt: { $lte: now }
  });

  for (const post of scheduledPosts) {
    await publishPost(post._id);
  }
}, 60000);