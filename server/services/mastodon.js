import axios from 'axios';

export class MastodonService {
  constructor() {
    // Mastodon requires instance URL + access token
  }

  // Verify credentials
  async verifyCredentials(instanceUrl, accessToken) {
    const response = await axios.get(
      `${instanceUrl}/api/v1/accounts/verify_credentials`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    return response.data;
  }

  // Get user account info
  async getAccount(instanceUrl, accessToken, id) {
    const response = await axios.get(
      `${instanceUrl}/api/v1/accounts/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    return response.data;
  }

  // Post a status (toot)
  async postStatus(instanceUrl, accessToken, status, options = {}) {
    const payload = {
      status: status.slice(0, 500), // Mastodon limit is 500 chars by default
      visibility: options.visibility || 'public',
      sensitive: options.sensitive || false
    };

    if (options.mediaIds && options.mediaIds.length > 0) {
      payload.media_ids = options.mediaIds;
    }

    const response = await axios.post(
      `${instanceUrl}/api/v1/statuses`,
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

  // Upload media
  async uploadMedia(instanceUrl, accessToken, fileBuffer, filename, description = '') {
    const FormData = (await import('form-data')).default;
    const form = new FormData();
    
    form.append('file', fileBuffer, filename);
    if (description) {
      form.append('description', description.slice(0, 1500));
    }

    const response = await axios.post(
      `${instanceUrl}/api/v2/media`,
      form,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          ...form.getHeaders()
        }
      }
    );

    return response.data;
  }

  // Get timeline
  async getHomeTimeline(instanceUrl, accessToken, options = {}) {
    const response = await axios.get(
      `${instanceUrl}/api/v1/timelines/home`,
      {
        params: {
          limit: options.limit || 20,
          max_id: options.maxId
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    return response.data;
  }
}
