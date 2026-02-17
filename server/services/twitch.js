import axios from 'axios';

const TWITCH_API_BASE = 'https://api.twitch.tv/helix';
const TWITCH_AUTH_BASE = 'https://id.twitch.tv/oauth2';

export class TwitchService {
  constructor(clientId, clientSecret, redirectUri) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
  }

  // Generate OAuth authorization URL
  getAuthUrl(state) {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'channel:manage:broadcast user:read:email',
      state: state
    });

    return `${TWITCH_AUTH_BASE}/authorize?${params.toString()}`;
  }

  // Exchange code for tokens
  async getAccessToken(code) {
    const response = await axios.post(
      `${TWITCH_AUTH_BASE}/token`,
      {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUri
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return response.data;
  }

  // Validate token
  async validateToken(accessToken) {
    const response = await axios.get(
      `${TWITCH_AUTH_BASE}/validate`,
      {
        headers: {
          'Authorization': `OAuth ${accessToken}`
        }
      }
    );

    return response.data;
  }

  // Refresh access token
  async refreshAccessToken(refreshToken) {
    const response = await axios.post(
      `${TWITCH_AUTH_BASE}/token`,
      {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return response.data;
  }

  // Get user info
  async getUser(accessToken) {
    const response = await axios.get(
      `${TWITCH_API_BASE}/users`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Client-Id': this.clientId
        }
      }
    );

    return response.data.data?.[0];
  }

  // Get channel info
  async getChannelInfo(accessToken, broadcasterId) {
    const response = await axios.get(
      `${TWITCH_API_BASE}/channels`,
      {
        params: {
          broadcaster_id: broadcasterId
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Client-Id': this.clientId
        }
      }
    );

    return response.data.data?.[0];
  }

  // Modify channel information (update title/game)
  async modifyChannelInfo(accessToken, broadcasterId, info) {
    const payload = {};
    if (info.title) payload.title = info.title.slice(0, 140);
    if (info.gameId) payload.game_id = info.gameId;
    if (info.broadcasterLanguage) payload.broadcaster_language = info.broadcasterLanguage;

    const response = await axios.patch(
      `${TWITCH_API_BASE}/channels`,
      payload,
      {
        params: {
          broadcaster_id: broadcasterId
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Client-Id': this.clientId,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  }

  // Create stream marker (for posting "moments")
  async createStreamMarker(accessToken, userId, description) {
    const response = await axios.post(
      `${TWITCH_API_BASE}/streams/markers`,
      {
        user_id: userId,
        description: description?.slice(0, 140)
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Client-Id': this.clientId,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  }

  // Send chat message (requires chat scope and special endpoint)
  async sendChatMessage(accessToken, broadcasterId, senderId, message) {
    const response = await axios.post(
      `${TWITCH_API_BASE}/chat/messages`,
      {
        broadcaster_id: broadcasterId,
        sender_id: senderId,
        message: message.slice(0, 500) // Twitch message limit
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Client-Id': this.clientId,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  }
}
