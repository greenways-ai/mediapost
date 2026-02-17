import axios from 'axios';

const REDDIT_API_BASE = 'https://oauth.reddit.com';
const REDDIT_AUTH_BASE = 'https://www.reddit.com/api/v1';

export class RedditService {
  constructor(clientId, clientSecret, redirectUri) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
  }

  // Generate OAuth authorization URL
  getAuthUrl(state) {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: 'identity submit read',
      state: state,
      duration: 'permanent'
    });

    return `https://www.reddit.com/api/v1/authorize?${params.toString()}`;
  }

  // Exchange code for access token
  async getAccessToken(code) {
    const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    
    const response = await axios.post(
      `${REDDIT_AUTH_BASE}/access_token`,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.redirectUri
      }),
      {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'BufferClone/1.0'
        }
      }
    );

    return response.data;
  }

  // Refresh access token
  async refreshAccessToken(refreshToken) {
    const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    
    const response = await axios.post(
      `${REDDIT_AUTH_BASE}/access_token`,
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      }),
      {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'BufferClone/1.0'
        }
      }
    );

    return response.data;
  }

  // Submit a post
  async submitPost(accessToken, subreddit, title, text, kind = 'self') {
    const params = new URLSearchParams({
      sr: subreddit,
      title: title,
      kind: kind, // 'self' for text post, 'link' for URL
      resubmit: 'true'
    });

    if (kind === 'self') {
      params.append('text', text);
    } else {
      params.append('url', text);
    }

    const response = await axios.post(
      `${REDDIT_API_BASE}/api/submit`,
      params,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'BufferClone/1.0'
        }
      }
    );

    return response.data;
  }

  // Get user info
  async getUserInfo(accessToken) {
    const response = await axios.get(
      `${REDDIT_API_BASE}/api/v1/me`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'BufferClone/1.0'
        }
      }
    );

    return response.data;
  }

  // Get user's subscribed subreddits
  async getSubreddits(accessToken) {
    const response = await axios.get(
      `${REDDIT_API_BASE}/subreddits/mine/subscriber`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'BufferClone/1.0'
        }
      }
    );

    return response.data;
  }
}
