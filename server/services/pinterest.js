import axios from 'axios';

const PINTEREST_API_BASE = 'https://api.pinterest.com/v5';

export class PinterestService {
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
      scope: 'boards:read,pins:read,pins:write,user_accounts:read',
      state: state
    });

    return `https://www.pinterest.com/oauth/?${params.toString()}`;
  }

  // Exchange code for access token
  async getAccessToken(code) {
    const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    
    const response = await axios.post(
      `${PINTEREST_API_BASE}/oauth/token`,
      {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.redirectUri
      },
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
      `${PINTEREST_API_BASE}/oauth/token`,
      {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      },
      {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return response.data;
  }

  // Get user info
  async getUserInfo(accessToken) {
    const response = await axios.get(
      `${PINTEREST_API_BASE}/user_account`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    return response.data;
  }

  // Get user's boards
  async getBoards(accessToken) {
    const response = await axios.get(
      `${PINTEREST_API_BASE}/boards`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    return response.data;
  }

  // Create a pin
  async createPin(accessToken, boardId, title, description, link, mediaSource) {
    const payload = {
      board_id: boardId,
      title: title.slice(0, 100), // Pinterest title limit
      description: description.slice(0, 500), // Pinterest description limit
      link: link
    };

    // Handle media source (URL or base64)
    if (mediaSource) {
      if (mediaSource.startsWith('http')) {
        payload.media_source = {
          source_type: 'image_url',
          url: mediaSource
        };
      }
    }

    const response = await axios.post(
      `${PINTEREST_API_BASE}/pins`,
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

  // Create multiple pins (to different boards)
  async createPinsToMultipleBoards(accessToken, boardIds, title, description, link, mediaSource) {
    const results = [];
    
    for (const boardId of boardIds) {
      try {
        const result = await this.createPin(accessToken, boardId, title, description, link, mediaSource);
        results.push({ boardId, success: true, pinId: result.id });
      } catch (error) {
        results.push({ boardId, success: false, error: error.message });
      }
    }

    return results;
  }
}
