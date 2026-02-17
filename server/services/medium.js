import axios from 'axios';

const MEDIUM_API_BASE = 'https://api.medium.com/v1';

export class MediumService {
  constructor() {
    // Medium uses integration tokens
  }

  // Get user info
  async getUserInfo(integrationToken) {
    const response = await axios.get(
      `${MEDIUM_API_BASE}/me`,
      {
        headers: {
          'Authorization': `Bearer ${integrationToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    return response.data.data;
  }

  // Get user's publications
  async getPublications(integrationToken, userId) {
    const response = await axios.get(
      `${MEDIUM_API_BASE}/users/${userId}/publications`,
      {
        headers: {
          'Authorization': `Bearer ${integrationToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    return response.data.data;
  }

  // Create a post
  async createPost(integrationToken, userId, post) {
    const payload = {
      title: post.title.slice(0, 100),
      contentFormat: post.contentFormat || 'markdown',
      content: post.content,
      tags: (post.tags || []).slice(0, 5).map(tag => tag.slice(0, 25)), // Max 5 tags, 25 chars each
      publishStatus: post.publishStatus || 'public',
      license: post.license || 'all-rights-reserved'
    };

    if (post.canonicalUrl) {
      payload.canonicalUrl = post.canonicalUrl;
    }

    const response = await axios.post(
      `${MEDIUM_API_BASE}/users/${userId}/posts`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${integrationToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    return response.data.data;
  }

  // Create post under a publication
  async createPublicationPost(integrationToken, publicationId, post) {
    const payload = {
      title: post.title.slice(0, 100),
      contentFormat: post.contentFormat || 'markdown',
      content: post.content,
      tags: (post.tags || []).slice(0, 5).map(tag => tag.slice(0, 25)),
      publishStatus: post.publishStatus || 'draft'
    };

    const response = await axios.post(
      `${MEDIUM_API_BASE}/publications/${publicationId}/posts`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${integrationToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    return response.data.data;
  }
}
