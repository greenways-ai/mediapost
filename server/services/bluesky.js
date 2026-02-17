import axios from 'axios';

const BLUESKY_API_BASE = 'https://bsky.social/xrpc';

export class BlueskyService {
  constructor() {
    // Bluesky uses app passwords
  }

  // Create session (login)
  async createSession(identifier, password) {
    const response = await axios.post(`${BLUESKY_API_BASE}/com.atproto.server.createSession`, {
      identifier,
      password
    });
    return response.data;
  }

  // Refresh session
  async refreshSession(refreshJwt) {
    const response = await axios.post(
      `${BLUESKY_API_BASE}/com.atproto.server.refreshSession`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${refreshJwt}`
        }
      }
    );
    return response.data;
  }

  // Get profile
  async getProfile(accessJwt, actor) {
    const response = await axios.get(
      `${BLUESKY_API_BASE}/app.bsky.actor.getProfile`,
      {
        params: { actor },
        headers: {
          'Authorization': `Bearer ${accessJwt}`
        }
      }
    );
    return response.data;
  }

  // Create a post
  async createPost(accessJwt, handle, text, embed = null) {
    const now = new Date().toISOString();
    
    const post = {
      '$type': 'app.bsky.feed.post',
      text: text.slice(0, 300), // Bluesky limit
      createdAt: now
    };

    if (embed) {
      post.embed = embed;
    }

    const response = await axios.post(
      `${BLUESKY_API_BASE}/com.atproto.repo.createRecord`,
      {
        repo: handle,
        collection: 'app.bsky.feed.post',
        record: post
      },
      {
        headers: {
          'Authorization': `Bearer ${accessJwt}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  }

  // Upload blob (image)
  async uploadBlob(accessJwt, buffer, encoding) {
    const response = await axios.post(
      `${BLUESKY_API_BASE}/com.atproto.repo.uploadBlob`,
      buffer,
      {
        headers: {
          'Authorization': `Bearer ${accessJwt}`,
          'Content-Type': encoding
        }
      }
    );
    return response.data;
  }

  // Create post with images
  async createPostWithImages(accessJwt, handle, text, imageBlobs) {
    const embed = {
      '$type': 'app.bsky.embed.images',
      images: imageBlobs.map(blob => ({
        alt: '',
        image: blob.blob
      }))
    };

    return this.createPost(accessJwt, handle, text, embed);
  }
}
