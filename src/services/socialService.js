const axios = require('axios');
const FB = require('fb').default;
const { TwitterApi } = require('twitter-api-v2');
const { Instagram } = require('instagram-web-api');

FB.options({ version: 'v18.0' });

class SocialService {
  constructor() {
    this.clients = {
      facebook: null,
      instagram: null,
      twitter: null,
      pinterest: null
    };
  }

  // Initialize Facebook client
  initFacebook(accessToken) {
    FB.setAccessToken(accessToken);
    this.clients.facebook = FB;
  }

  // Initialize Instagram client
  initInstagram(username, password) {
    this.clients.instagram = new Instagram({ username, password });
  }

  // Initialize Twitter client
  initTwitter(apiKey, apiSecret, accessToken, accessSecret) {
    this.clients.twitter = new TwitterApi({
      appKey: apiKey,
      appSecret: apiSecret,
      accessToken: accessToken,
      accessSecret: accessSecret
    });
  }

  // Post to social media
  async postToSocial(platform, content, media = [], account) {
    try {
      switch (platform) {
        case 'facebook':
          return await this.postToFacebook(content, media, account);
        case 'instagram':
          return await this.postToInstagram(content, media, account);
        case 'twitter':
          return await this.postToTwitter(content, media, account);
        case 'pinterest':
          return await this.postToPinterest(content, media, account);
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }

    } catch (error) {
      console.error(`Post to ${platform} error:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Post to Facebook
  async postToFacebook(content, media, account) {
    try {
      this.initFacebook(account.accessToken);

      let postData = {
        message: content.text,
        link: content.link,
        access_token: account.accessToken
      };

      // If there are media files
      if (media && media.length > 0) {
        if (media.length === 1) {
          // Single image
          postData = {
            ...postData,
            url: media[0].url,
            published: true
          };
          const result = await FB.api(`${account.accountId}/photos`, 'post', postData);
          return { success: true, postId: result.id, platform: 'facebook' };
        } else {
          // Multiple images - create album
          const album = await FB.api(`${account.accountId}/albums`, 'post', {
            name: content.text.substring(0, 100),
            access_token: account.accessToken
          });

          const results = [];
          for (const image of media) {
            const result = await FB.api(`${album.id}/photos`, 'post', {
              url: image.url,
              access_token: account.accessToken
            });
            results.push(result.id);
          }

          return { success: true, albumId: album.id, postIds: results, platform: 'facebook' };
        }
      } else {
        // Text only post
        const result = await FB.api(`${account.accountId}/feed`, 'post', postData);
        return { success: true, postId: result.id, platform: 'facebook' };
      }

    } catch (error) {
      throw new Error(`Facebook post failed: ${error.message}`);
    }
  }

  // Post to Instagram
  async postToInstagram(content, media, account) {
    try {
      this.initInstagram(account.username, account.password);
      await this.clients.instagram.login();

      let result;

      if (media && media.length > 0) {
        if (media.length === 1) {
          // Single image
          result = await this.clients.instagram.uploadPhoto({
            photo: media[0].url,
            caption: content.text,
            post: 'feed'
          });
        } else {
          // Carousel
          const items = media.map(m => ({
            type: 'IMAGE',
            url: m.url
          }));
          result = await this.clients.instagram.uploadAlbum({
            items,
            caption: content.text
          });
        }
      } else {
        // Text only? Instagram requires media
        throw new Error('Instagram posts require at least one image');
      }

      return {
        success: true,
        postId: result.media?.id || result.id,
        platform: 'instagram'
      };

    } catch (error) {
      throw new Error(`Instagram post failed: ${error.message}`);
    }
  }

  // Post to Twitter
  async postToTwitter(content, media, account) {
    try {
      this.initTwitter(
        account.apiKey,
        account.apiSecret,
        account.accessToken,
        account.accessSecret
      );

      let tweetData = { text: content.text };

      // Add media if present
      if (media && media.length > 0) {
        const mediaIds = [];
        
        for (const image of media) {
          // Download image and upload to Twitter
          const imageResponse = await axios.get(image.url, { responseType: 'arraybuffer' });
          const buffer = Buffer.from(imageResponse.data, 'binary');
          
          const mediaId = await this.clients.twitter.v1.uploadMedia(buffer, {
            mimeType: image.type || 'image/jpeg'
          });
          mediaIds.push(mediaId);
        }

        tweetData.media = { media_ids: mediaIds };
      }

      const result = await this.clients.twitter.v2.tweet(tweetData);

      return {
        success: true,
        postId: result.data.id,
        platform: 'twitter'
      };

    } catch (error) {
      throw new Error(`Twitter post failed: ${error.message}`);
    }
  }

  // Post to Pinterest
  async postToPinterest(content, media, account) {
    try {
      const response = await axios.post('https://api.pinterest.com/v5/pins', {
        title: content.text.substring(0, 100),
        description: content.text,
        link: content.link,
        media_source: {
          source_type: 'image_url',
          url: media[0].url
        }
      }, {
        headers: {
          'Authorization': `Bearer ${account.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        postId: response.data.id,
        platform: 'pinterest'
      };

    } catch (error) {
      throw new Error(`Pinterest post failed: ${error.message}`);
    }
  }

  // Schedule post
  async schedulePost(post, scheduledTime) {
    const delay = new Date(scheduledTime) - new Date();
    
    if (delay < 0) {
      throw new Error('Scheduled time must be in the future');
    }

    setTimeout(async () => {
      try {
        await this.postToSocial(post.platform, post.content, post.media, post.account);
        
        // Update post status in database
        const SocialPost = require('../models/SocialPost');
        await SocialPost.findByIdAndUpdate(post._id, {
          status: 'published',
          publishedAt: new Date()
        });

      } catch (error) {
        console.error('Scheduled post failed:', error);
        
        // Update post status to failed
        const SocialPost = require('../models/SocialPost');
        await SocialPost.findByIdAndUpdate(post._id, {
          status: 'failed',
          error: error.message
        });
      }
    }, delay);

    return {
      success: true,
      scheduledTime,
      postId: post._id
    };
  }

  // Get analytics
  async getAnalytics(platform, accountId, accessToken, startDate, endDate) {
    try {
      switch (platform) {
        case 'facebook':
          return await this.getFacebookAnalytics(accountId, accessToken, startDate, endDate);
        case 'instagram':
          return await this.getInstagramAnalytics(accountId, accessToken, startDate, endDate);
        case 'twitter':
          return await this.getTwitterAnalytics(accountId, accessToken, startDate, endDate);
        default:
          throw new Error(`Analytics not supported for ${platform}`);
      }

    } catch (error) {
      console.error(`Get ${platform} analytics error:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get Facebook analytics
  async getFacebookAnalytics(pageId, accessToken, startDate, endDate) {
    try {
      this.initFacebook(accessToken);

      const metrics = [
        'page_impressions',
        'page_engaged_users',
        'page_post_engagements',
        'page_fans',
        'page_views_total',
        'page_actions_post_reactions_total'
      ];

      const result = await FB.api(`${pageId}/insights`, {
        metric: metrics.join(','),
        period: 'day',
        since: startDate,
        until: endDate,
        access_token: accessToken
      });

      const analytics = {};

      result.data.forEach(metric => {
        analytics[metric.name] = metric.values.map(v => ({
          date: v.end_time,
          value: v.value
        }));
      });

      return {
        success: true,
        platform: 'facebook',
        data: analytics
      };

    } catch (error) {
      throw new Error(`Facebook analytics failed: ${error.message}`);
    }
  }

  // Get Instagram analytics
  async getInstagramAnalytics(accountId, accessToken, startDate, endDate) {
    try {
      const response = await axios.get(`https://graph.facebook.com/v18.0/${accountId}/insights`, {
        params: {
          metric: 'impressions,reach,profile_views,follower_count',
          period: 'day',
          since: startDate,
          until: endDate,
          access_token: accessToken
        }
      });

      const analytics = {};

      response.data.data.forEach(metric => {
        analytics[metric.name] = metric.values.map(v => ({
          date: v.end_time,
          value: v.value
        }));
      });

      return {
        success: true,
        platform: 'instagram',
        data: analytics
      };

    } catch (error) {
      throw new Error(`Instagram analytics failed: ${error.message}`);
    }
  }

  // Get Twitter analytics
  async getTwitterAnalytics(accountId, accessToken, startDate, endDate) {
    try {
      // Twitter API v2 for analytics
      const response = await axios.get(`https://api.twitter.com/2/users/${accountId}/tweets`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        params: {
          'tweet.fields': 'public_metrics,created_at',
          'max_results': 100,
          'start_time': startDate,
          'end_time': endDate
        }
      });

      const tweets = response.data.data || [];
      
      const analytics = {
        totalTweets: tweets.length,
        totalImpressions: tweets.reduce((sum, t) => sum + (t.public_metrics?.impression_count || 0), 0),
        totalLikes: tweets.reduce((sum, t) => sum + (t.public_metrics?.like_count || 0), 0),
        totalRetweets: tweets.reduce((sum, t) => sum + (t.public_metrics?.retweet_count || 0), 0),
        totalReplies: tweets.reduce((sum, t) => sum + (t.public_metrics?.reply_count || 0), 0),
        tweetsByDay: {}
      };

      tweets.forEach(tweet => {
        const date = new Date(tweet.created_at).toISOString().split('T')[0];
        if (!analytics.tweetsByDay[date]) {
          analytics.tweetsByDay[date] = {
            count: 0,
            impressions: 0,
            likes: 0,
            retweets: 0
          };
        }
        analytics.tweetsByDay[date].count++;
        analytics.tweetsByDay[date].impressions += tweet.public_metrics?.impression_count || 0;
        analytics.tweetsByDay[date].likes += tweet.public_metrics?.like_count || 0;
        analytics.tweetsByDay[date].retweets += tweet.public_metrics?.retweet_count || 0;
      });

      return {
        success: true,
        platform: 'twitter',
        data: analytics
      };

    } catch (error) {
      throw new Error(`Twitter analytics failed: ${error.message}`);
    }
  }

  // Auto-post product
  async autoPostProduct(product, platforms, accounts) {
    const results = [];

    const content = {
      text: `✨ New Product: ${product.name}\n\n${product.description?.substring(0, 150)}...\n\nPrice: $${product.price}\n\n#newproduct #shop #${product.category}`,
      link: `${process.env.FRONTEND_URL}/product/${product.slug}`
    };

    const media = product.images?.map(img => ({
      url: img.url,
      type: 'image/jpeg'
    })) || [];

    for (const platform of platforms) {
      const account = accounts.find(a => a.platform === platform);
      if (account) {
        try {
          const result = await this.postToSocial(platform, content, media, account);
          results.push({ platform, ...result });
        } catch (error) {
          results.push({ platform, success: false, error: error.message });
        }
      }
    }

    return results;
  }

  // Get account info
  async getAccountInfo(platform, accessToken, accountId) {
    try {
      switch (platform) {
        case 'facebook':
          return await this.getFacebookAccountInfo(accountId, accessToken);
        case 'instagram':
          return await this.getInstagramAccountInfo(accountId, accessToken);
        case 'twitter':
          return await this.getTwitterAccountInfo(accessToken);
        default:
          throw new Error(`Account info not supported for ${platform}`);
      }

    } catch (error) {
      console.error(`Get ${platform} account info error:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get Facebook account info
  async getFacebookAccountInfo(pageId, accessToken) {
    try {
      this.initFacebook(accessToken);

      const result = await FB.api(pageId, {
        fields: 'id,name,username,fan_count,website,about,cover,picture',
        access_token: accessToken
      });

      return {
        success: true,
        platform: 'facebook',
        data: {
          id: result.id,
          name: result.name,
          username: result.username,
          followers: result.fan_count,
          website: result.website,
          about: result.about,
          cover: result.cover?.source,
          avatar: result.picture?.data?.url
        }
      };

    } catch (error) {
      throw new Error(`Facebook account info failed: ${error.message}`);
    }
  }

  // Get Instagram account info
  async getInstagramAccountInfo(accountId, accessToken) {
    try {
      const response = await axios.get(`https://graph.facebook.com/v18.0/${accountId}`, {
        params: {
          fields: 'id,username,name,profile_picture_url,followers_count,follows_count,media_count,biography,website',
          access_token: accessToken
        }
      });

      return {
        success: true,
        platform: 'instagram',
        data: response.data
      };

    } catch (error) {
      throw new Error(`Instagram account info failed: ${error.message}`);
    }
  }

  // Get Twitter account info
  async getTwitterAccountInfo(accessToken) {
    try {
      const response = await axios.get('https://api.twitter.com/2/users/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        params: {
          'user.fields': 'public_metrics,description,profile_image_url,verified'
        }
      });

      const user = response.data.data;

      return {
        success: true,
        platform: 'twitter',
        data: {
          id: user.id,
          name: user.name,
          username: user.username,
          description: user.description,
          followers: user.public_metrics?.followers_count,
          following: user.public_metrics?.following_count,
          tweets: user.public_metrics?.tweet_count,
          avatar: user.profile_image_url,
          verified: user.verified
        }
      };

    } catch (error) {
      throw new Error(`Twitter account info failed: ${error.message}`);
    }
  }
}

module.exports = new SocialService();