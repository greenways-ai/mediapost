import axios from 'axios';
import crypto from 'crypto';

const TWITTER_API_BASE = 'https://api.twitter.com/2';

export class TwitterService {
  constructor(clientId, clientSecret, redirectUri) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
  }

  // Generate OAuth 2.0 authorization URL
  getAuthUrl(state) {
    const codeChallenge = crypto.randomBytes(32).toString('base64url');
    const codeChallengeHash = crypto.createHash('sha256').update(codeChallenge).digest('base64url');
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: 'tweet.read tweet.write users.read offline.access',
      state: state,
      code_challenge: codeChallengeHash,
      code_challenge_method: 'S256'
    });

    return {
      url: `https://twitter.com/i/oauth2/authorize?${params.toString()}`,
      codeVerifier: codeChallenge
    };
  }

  // Exchange code for access token
  async getAccessToken(code, codeVerifier) {
    const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    
    const response = await axios.post(
      'https://api.twitter.com/2/oauth2/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.redirectUri,
        code_verifier: codeVerifier
      }),
      {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return response.data;
  }

  // Refresh access token
  async refreshAccessToken(refreshToken) {
    const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    
    const response = await axios.post(
      'https://api.twitter.com/2/oauth2/token',
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      }),
      {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return response.data;
  }

  // Post a tweet
  async postTweet(accessToken, text, mediaIds = []) {
    const payload = {
      text: text
    };

    if (mediaIds.length > 0) {
      payload.media = {
        media_ids: mediaIds.slice(0, 4) // Twitter allows max 4 images
      };
    }

    const response = await axios.post(
      `${TWITTER_API_BASE}/tweets`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  }

  // Upload media (requires Twitter API v1.1 for media upload)
  async uploadMedia(accessToken, accessTokenSecret, mediaBuffer, mediaType) {
    // Note: Media upload requires OAuth 1.0a
    // This is a simplified version - in production, use a library like 'twitter-api-v2'
    throw new Error('Media upload requires OAuth 1.0a implementation. Use twitter-api-v2 library for full support.');
  }

  // Get user info
  async getUserInfo(accessToken) {
    const response = await axios.get(
      `${TWITTER_API_BASE}/users/me`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    return response.data;
  }
}
