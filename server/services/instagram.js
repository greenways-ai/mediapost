import axios from 'axios';

const GRAPH_API_BASE = 'https://graph.facebook.com/v18.0';

export class InstagramService {
  constructor(appId, appSecret, redirectUri) {
    this.appId = appId;
    this.appSecret = appSecret;
    this.redirectUri = redirectUri;
  }

  // Generate OAuth authorization URL
  getAuthUrl(state) {
    const params = new URLSearchParams({
      client_id: this.appId,
      redirect_uri: this.redirectUri,
      scope: 'instagram_basic,instagram_content_publish,pages_read_engagement',
      response_type: 'code',
      state: state
    });

    return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
  }

  // Exchange code for access token
  async getAccessToken(code) {
    const response = await axios.get(
      `${GRAPH_API_BASE}/oauth/access_token`,
      {
        params: {
          client_id: this.appId,
          client_secret: this.appSecret,
          redirect_uri: this.redirectUri,
          code: code
        }
      }
    );

    return response.data;
  }

  // Exchange short-lived token for long-lived token
  async getLongLivedToken(shortLivedToken) {
    const response = await axios.get(
      `${GRAPH_API_BASE}/oauth/access_token`,
      {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: this.appId,
          client_secret: this.appSecret,
          fb_exchange_token: shortLivedToken
        }
      }
    );

    return response.data;
  }

  // Refresh long-lived token
  async refreshToken(longLivedToken) {
    const response = await axios.get(
      `${GRAPH_API_BASE}/oauth/access_token`,
      {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: this.appId,
          client_secret: this.appSecret,
          fb_exchange_token: longLivedToken
        }
      }
    );

    return response.data;
  }

  // Get user's Facebook Pages
  async getPages(accessToken) {
    const response = await axios.get(
      `${GRAPH_API_BASE}/me/accounts`,
      {
        params: {
          access_token: accessToken
        }
      }
    );

    return response.data;
  }

  // Get Instagram Business Account connected to a Facebook Page
  async getInstagramAccount(pageId, pageAccessToken) {
    const response = await axios.get(
      `${GRAPH_API_BASE}/${pageId}`,
      {
        params: {
          fields: 'instagram_business_account',
          access_token: pageAccessToken
        }
      }
    );

    return response.data.instagram_business_account;
  }

  // Get user info
  async getUserInfo(instagramAccountId, accessToken) {
    const response = await axios.get(
      `${GRAPH_API_BASE}/${instagramAccountId}`,
      {
        params: {
          fields: 'username,media_count,followers_count',
          access_token: accessToken
        }
      }
    );

    return response.data;
  }

  // Create a media container (for single image or video)
  async createMediaContainer(instagramAccountId, accessToken, imageUrl, caption) {
    const params = {
      image_url: imageUrl,
      caption: caption,
      access_token: accessToken
    };

    const response = await axios.post(
      `${GRAPH_API_BASE}/${instagramAccountId}/media`,
      params
    );

    return response.data;
  }

  // Create a carousel container (multiple images/videos)
  async createCarouselContainer(instagramAccountId, accessToken, mediaUrls, caption) {
    // First, create children containers
    const children = [];
    
    for (const mediaUrl of mediaUrls.slice(0, 10)) { // Max 10 items
      const isVideo = /\.(mp4|mov|avi)$/i.test(mediaUrl);
      const childParams = isVideo ? {
        media_type: 'VIDEO',
        video_url: mediaUrl,
        access_token: accessToken
      } : {
        image_url: mediaUrl,
        access_token: accessToken
      };

      const childResponse = await axios.post(
        `${GRAPH_API_BASE}/${instagramAccountId}/media`,
        childParams
      );
      
      children.push(childResponse.data.id);
    }

    // Then create the carousel container
    const carouselParams = {
      media_type: 'CAROUSEL',
      children: children.join(','),
      caption: caption,
      access_token: accessToken
    };

    const response = await axios.post(
      `${GRAPH_API_BASE}/${instagramAccountId}/media`,
      carouselParams
    );

    return response.data;
  }

  // Publish a media container
  async publishMedia(instagramAccountId, accessToken, creationId) {
    const params = {
      creation_id: creationId,
      access_token: accessToken
    };

    const response = await axios.post(
      `${GRAPH_API_BASE}/${instagramAccountId}/media_publish`,
      params
    );

    return response.data;
  }

  // Check media status
  async getMediaStatus(mediaId, accessToken) {
    const response = await axios.get(
      `${GRAPH_API_BASE}/${mediaId}`,
      {
        params: {
          fields: 'status_code',
          access_token: accessToken
        }
      }
    );

    return response.data;
  }

  // Post to Instagram (single image)
  async postImage(instagramAccountId, accessToken, imageUrl, caption) {
    // Step 1: Create media container
    const container = await this.createMediaContainer(
      instagramAccountId,
      accessToken,
      imageUrl,
      caption
    );

    // Step 2: Publish the container
    const publishResult = await this.publishMedia(
      instagramAccountId,
      accessToken,
      container.id
    );

    return publishResult;
  }

  // Post carousel to Instagram
  async postCarousel(instagramAccountId, accessToken, mediaUrls, caption) {
    // Step 1: Create carousel container
    const container = await this.createCarouselContainer(
      instagramAccountId,
      accessToken,
      mediaUrls,
      caption
    );

    // Step 2: Publish the container
    const publishResult = await this.publishMedia(
      instagramAccountId,
      accessToken,
      container.id
    );

    return publishResult;
  }
}
