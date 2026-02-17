import axios from 'axios';

const DEVTO_API_BASE = 'https://dev.to/api';

export class DevToService {
  constructor() {
    // Dev.to uses API keys
  }

  // Get authenticated user
  async getUser(apiKey) {
    const response = await axios.get(
      `${DEVTO_API_BASE}/users/me`,
      {
        headers: {
          'api-key': apiKey
        }
      }
    );

    return response.data;
  }

  // Get user's articles
  async getArticles(apiKey, options = {}) {
    const response = await axios.get(
      `${DEVTO_API_BASE}/articles/me/all`,
      {
        params: {
          page: options.page || 1,
          per_page: options.perPage || 30
        },
        headers: {
          'api-key': apiKey
        }
      }
    );

    return response.data;
  }

  // Create an article
  async createArticle(apiKey, article) {
    const payload = {
      article: {
        title: article.title.slice(0, 128),
        body_markdown: article.body,
        published: article.published !== false,
        tags: (article.tags || []).slice(0, 4), // Max 4 tags
        canonical_url: article.canonicalUrl,
        description: article.description?.slice(0, 300)
      }
    };

    if (article.series) {
      payload.article.series = article.series;
    }

    if (article.organizationId) {
      payload.article.organization_id = article.organizationId;
    }

    const response = await axios.post(
      `${DEVTO_API_BASE}/articles`,
      payload,
      {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  }

  // Update an article
  async updateArticle(apiKey, articleId, article) {
    const payload = {
      article: {
        title: article.title?.slice(0, 128),
        body_markdown: article.body,
        published: article.published,
        tags: article.tags?.slice(0, 4),
        description: article.description?.slice(0, 300)
      }
    };

    const response = await axios.put(
      `${DEVTO_API_BASE}/articles/${articleId}`,
      payload,
      {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  }
}
