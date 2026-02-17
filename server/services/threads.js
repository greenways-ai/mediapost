import axios from 'axios';

const THREADS_API_BASE = 'https://graph.threads.net/v1.0';
const FACEBOOK_AUTH_BASE = 'https://www.facebook.com/v18.0/dialog/oauth';

export class ThreadsService {
  constructor(appId, appSecret, redirectUri) {
    this.appId = appId;
    this.appSecret = appSecret;
    this.redirectUri = redirectUri;
  }

  // Generate OAuth authorization URL (via Facebook)
  getAuthUrl(state) {
    const params = new URLSearchParams({
      client_id: this.appId,
      redirect_uri: this.redirectUri,
      scope: 'threads_basic,threads_content_publish,threads_manage_insights',
      response_type: 'code',
      state: state
    });

    return `${FACEBOOK_AUTH_BASE}?${params.toString()}`;
  }

  // Exchange code for access token
  async getAccessToken(code) {
    const response = await axios.get(
      `https://graph.threads.net/oauth/access_token`,
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

  // Exchange for long-lived token
  async getLongLivedToken(shortLivedToken) {
    const response = await axios.get(
      `https://graph.threads.net/access_token`,
      {
        params: {
          grant_type: 'th_exchange_token',
          client_secret: this.appSecret,
          access_token: shortLivedToken
        }
      }
    );

    return response.data;
  }

  // Get user profile
  async getUserProfile(accessToken) {
    const response = await axios.get(
      `${THREADS_API_BASE}/me`,
      {
        params: {
          fields: 'id,username,threads_profile_picture_url,threads_biography',
          access_token: accessToken
        }
      }
    );

    return response.data;
  }

  // Get user threads (posts)
  async getUserThreads(userId, accessToken) {
    const response = await axios.get(
      `${THREADS_API_BASE}/${userId}/threads`,
      {
        params: {
          access_token: accessToken
        }
      }
    );

    return response.data;
  }

  // Create a text post
  async createTextPost(accessToken, userId, text) {
    // Step 1: Create the container
    const containerResponse = await axios.post(
      `${THREADS_API_BASE}/${userId}/threads`,
      {
        media_type: 'TEXT',
        text: text.slice(0, 500), // Threads limit
        access_token: accessToken
      }
    );

    const creationId = containerResponse.data.id;

    // Step 2: Publish the container
    const publishResponse = await axios.post(
      `${THREADS_API_BASE}/${userId}/threads_publish`,
      {
        creation_id: creationId,
        access_token: accessToken
      }
    );

    return publishResponse.data;
  }

  // Create an image post
  async createImagePost(accessToken, userId, imageUrl, text) {
    // Step 1: Create the container
    const containerResponse = await axios.post(
      `${THREADS_API_BASE}/${userId}/threads`,
      {
        media_type: 'IMAGE',
        image_url: imageUrl,
        text: text?.slice(0, 500),
        access_token: accessToken
      }
    );

    const creationId = containerResponse.data.id;

    // Step 2: Publish the container
    const publishResponse = await axios.post(
      `${THREADS_API_BASE}/${userId}/threads_publish`,
      {
        creation_id: creationId,
        access_token: accessToken
      }
    );

    return publishResponse.data;
  }

  // Create a carousel post (multiple images)
  async createCarouselPost(accessToken, userId, imageUrls, text) {
    // Step 1: Create item containers for each image
    const itemContainers = [];
    
    for (const imageUrl of imageUrls.slice(0, 10)) { // Max 10 items
      const itemResponse = await axios.post(
        `${THREADS_API_BASE}/${userId}/threads`,
        {
          media_type: 'IMAGE',
          image_url: imageUrl,
          is_carousel_item: true,
          access_token: accessToken
        }
      );
      itemContainers.push(itemResponse.data.id);
    }

    // Step 2: Create carousel container
    const carouselResponse = await axios.post(
      `${THREADS_API_BASE}/${userId}/threads`,
      {
        media_type: 'CAROUSEL',
        children: itemContainers.join(','),
        text: text?.slice(0, 500),
        access_token: accessToken
      }
    );

    const creationId = carouselResponse.data.id;

    // Step 3: Publish
    const publishResponse = await axios.post(
      `${THREADS_API_BASE}/${userId}/threads_publish`,
      {
        creation_id: creationId,
        access_token: accessToken
      }
    );

    return publishResponse.data;
  }
}
