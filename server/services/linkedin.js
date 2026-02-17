import axios from 'axios';

const LINKEDIN_API_BASE = 'https://api.linkedin.com/v2';
const LINKEDIN_AUTH_BASE = 'https://www.linkedin.com/oauth/v2';

export class LinkedInService {
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
      scope: 'r_liteprofile r_emailaddress w_member_social',
      state: state
    });

    return `${LINKEDIN_AUTH_BASE}/authorization?${params.toString()}`;
  }

  // Exchange code for access token
  async getAccessToken(code) {
    const response = await axios.post(
      `${LINKEDIN_AUTH_BASE}/accessToken`,
      {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.redirectUri,
        client_id: this.clientId,
        client_secret: this.clientSecret
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return response.data;
  }

  // Get user profile
  async getProfile(accessToken) {
    const response = await axios.get(
      `${LINKEDIN_API_BASE}/me`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    return response.data;
  }

  // Get user info (basic profile)
  async getUserInfo(accessToken) {
    const response = await axios.get(
      `${LINKEDIN_API_BASE}/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    return response.data;
  }

  // Create a share (post)
  async createShare(accessToken, authorUrn, text, options = {}) {
    const payload = {
      author: authorUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: text.slice(0, 3000) // LinkedIn limit
          },
          shareMediaCategory: options.mediaCategory || 'NONE'
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': options.visibility || 'PUBLIC'
      }
    };

    if (options.media && options.media.length > 0) {
      payload.specificContent['com.linkedin.ugc.ShareContent'].media = options.media;
    }

    const response = await axios.post(
      `${LINKEDIN_API_BASE}/ugcPosts`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        }
      }
    );

    return response.data;
  }

  // Register upload for media
  async registerUpload(accessToken, ownerUrn, mediaType = 'IMAGE') {
    const response = await axios.post(
      `${LINKEDIN_API_BASE}/assets?action=registerUpload`,
      {
        registerUploadRequest: {
          recipes: [`urn:li:digitalmediaRecipe:feedshare-${mediaType.toLowerCase()}`],
          owner: ownerUrn,
          serviceRelationships: [
            {
              relationshipType: 'OWNER',
              identifier: 'urn:li:userGeneratedContent'
            }
          ]
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        }
      }
    );

    return response.data;
  }
}
