import axios from 'axios';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
const YOUTUBE_AUTH_BASE = 'https://oauth2.googleapis.com';
const GOOGLE_AUTH_BASE = 'https://accounts.google.com/o/oauth2/v2/auth';

export class YouTubeService {
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
      scope: 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly',
      access_type: 'offline',
      prompt: 'consent',
      state: state
    });

    return `${GOOGLE_AUTH_BASE}/auth?${params.toString()}`;
  }

  // Exchange code for tokens
  async getAccessToken(code) {
    const response = await axios.post(
      `${YOUTUBE_AUTH_BASE}/token`,
      {
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        grant_type: 'authorization_code'
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return response.data;
  }

  // Refresh access token
  async refreshAccessToken(refreshToken) {
    const response = await axios.post(
      `${YOUTUBE_AUTH_BASE}/token`,
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

  // Get channel info
  async getChannelInfo(accessToken) {
    const response = await axios.get(
      `${YOUTUBE_API_BASE}/channels`,
      {
        params: {
          part: 'snippet,statistics',
          mine: true
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    return response.data;
  }

  // Create a video upload (requires resumable upload for videos)
  async initializeUpload(accessToken, metadata) {
    const response = await axios.post(
      `${YOUTUBE_API_BASE}/videos?part=snippet,status`,
      {
        snippet: {
          title: metadata.title.slice(0, 100),
          description: metadata.description?.slice(0, 5000),
          tags: metadata.tags || [],
          categoryId: metadata.categoryId || '22' // People & Blogs
        },
        status: {
          privacyStatus: metadata.privacyStatus || 'public',
          selfDeclaredMadeForKids: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'x-upload-content-type': 'video/*'
        }
      }
    );

    return response.data;
  }
}
