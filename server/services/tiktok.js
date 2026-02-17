import axios from 'axios';

const TIKTOK_API_BASE = 'https://open-api.tiktok.com';
const TIKTOK_AUTH_BASE = 'https://www.tiktok.com/auth/authorize';

export class TikTokService {
  constructor(clientKey, clientSecret, redirectUri) {
    this.clientKey = clientKey;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
  }

  // Generate OAuth authorization URL
  getAuthUrl(state) {
    const params = new URLSearchParams({
      client_key: this.clientKey,
      redirect_uri: this.redirectUri,
      scope: 'user.info.basic,video.list,video.upload',
      response_type: 'code',
      state: state
    });

    return `${TIKTOK_AUTH_BASE}/?${params.toString()}`;
  }

  // Exchange code for access token
  async getAccessToken(code) {
    const response = await axios.post(
      `${TIKTOK_API_BASE}/oauth/access_token/`,
      {
        client_key: this.clientKey,
        client_secret: this.clientSecret,
        code: code,
        grant_type: 'authorization_code'
      }
    );

    return response.data.data;
  }

  // Refresh access token
  async refreshAccessToken(refreshToken) {
    const response = await axios.post(
      `${TIKTOK_API_BASE}/oauth/refresh_token/`,
      {
        client_key: this.clientKey,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      }
    );

    return response.data.data;
  }

  // Get user info
  async getUserInfo(accessToken, openId) {
    const response = await axios.get(
      `${TIKTOK_API_BASE}/user/info/`,
      {
        params: {
          access_token: accessToken,
          open_id: openId
        }
      }
    );

    return response.data.data;
  }

  // Initialize video upload
  async initializeUpload(accessToken, openId, postInfo) {
    const response = await axios.post(
      `${TIKTOK_API_BASE}/share/video/upload/`,
      {
        access_token: accessToken,
        open_id: openId,
        post_info: {
          title: postInfo.title?.slice(0, 2200),
          privacy_level: postInfo.privacyLevel || 'public',
          disable_duet: postInfo.disableDuet || false,
          disable_comment: postInfo.disableComment || false,
          disable_stitch: postInfo.disableStitch || false,
          video_cover_timestamp_ms: postInfo.coverTimestamp || 0
        }
      }
    );

    return response.data.data;
  }
}
