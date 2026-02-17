import axios from 'axios';
import crypto from 'crypto';

const TUMBLR_API_BASE = 'https://api.tumblr.com/v2';

export class TumblrService {
  constructor(consumerKey, consumerSecret, redirectUri) {
    this.consumerKey = consumerKey;
    this.consumerSecret = consumerSecret;
    this.redirectUri = redirectUri;
  }

  // Generate OAuth 1.0a request token URL
  async getRequestToken() {
    const oauthParams = {
      oauth_consumer_key: this.consumerKey,
      oauth_nonce: crypto.randomBytes(16).toString('hex'),
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
      oauth_version: '1.0',
      oauth_callback: this.redirectUri
    };

    // This is a simplified version - full OAuth 1.0a requires signature generation
    const response = await axios.post(
      `${TUMBLR_API_BASE}/oauth/request_token`,
      {},
      {
        params: oauthParams
      }
    );

    return response.data;
  }

  // Get authorization URL
  getAuthUrl(oauthToken) {
    return `https://www.tumblr.com/oauth/authorize?oauth_token=${oauthToken}`;
  }

  // Get access token (OAuth 1.0a)
  async getAccessToken(oauthToken, oauthVerifier) {
    const response = await axios.post(
      `${TUMBLR_API_BASE}/oauth/access_token`,
      {},
      {
        params: {
          oauth_consumer_key: this.consumerKey,
          oauth_token: oauthToken,
          oauth_verifier: oauthVerifier
        }
      }
    );

    return response.data;
  }

  // Get user info
  async getUserInfo(oauthToken, oauthTokenSecret) {
    // OAuth 1.0a signed request
    const response = await axios.get(
      `${TUMBLR_API_BASE}/user/info`,
      {
        params: {
          api_key: this.consumerKey
        }
      }
    );

    return response.data.response;
  }

  // Get user's blogs
  async getBlogs(apiKey) {
    const response = await axios.get(
      `${TUMBLR_API_BASE}/user/info`,
      {
        params: {
          api_key: apiKey
        }
      }
    );

    return response.data.response?.user?.blogs || [];
  }

  // Create a text post
  async createTextPost(blogIdentifier, apiKey, post) {
    const payload = {
      type: 'text',
      title: post.title?.slice(0, 100),
      body: post.body,
      tags: (post.tags || []).join(','),
      format: post.format || 'html',
      state: post.state || 'published'
    };

    if (post.date) {
      payload.date = post.date;
    }

    const response = await axios.post(
      `${TUMBLR_API_BASE}/blog/${blogIdentifier}/post`,
      payload,
      {
        params: {
          api_key: apiKey
        }
      }
    );

    return response.data.response;
  }

  // Create a photo post
  async createPhotoPost(blogIdentifier, apiKey, post) {
    const payload = {
      type: 'photo',
      caption: post.caption?.slice(0, 1000),
      tags: (post.tags || []).join(','),
      source: post.source, // URL to image
      data: post.data, // Or base64 encoded image
      state: post.state || 'published'
    };

    const response = await axios.post(
      `${TUMBLR_API_BASE}/blog/${blogIdentifier}/post`,
      payload,
      {
        params: {
          api_key: apiKey
        }
      }
    );

    return response.data.response;
  }

  // Create post to multiple blogs
  async createPostToMultipleBlogs(blogIdentifiers, apiKey, post) {
    const results = [];

    for (const blogId of blogIdentifiers) {
      try {
        let result;
        if (post.type === 'photo') {
          result = await this.createPhotoPost(blogId, apiKey, post);
        } else {
          result = await this.createTextPost(blogId, apiKey, post);
        }
        results.push({ blogId, success: true, postId: result.id });
      } catch (error) {
        results.push({ blogId, success: false, error: error.message });
      }
    }

    return results;
  }
}
