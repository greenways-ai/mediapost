import axios from 'axios';

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_AUTH_BASE = 'https://github.com/login/oauth';

export class GitHubService {
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
      scope: 'repo read:user',
      state: state
    });

    return `${GITHUB_AUTH_BASE}/authorize?${params.toString()}`;
  }

  // Exchange code for access token
  async getAccessToken(code) {
    const response = await axios.post(
      `${GITHUB_AUTH_BASE}/access_token`,
      {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: code,
        redirect_uri: this.redirectUri
      },
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    return response.data;
  }

  // Get authenticated user
  async getUser(accessToken) {
    const response = await axios.get(
      `${GITHUB_API_BASE}/user`,
      {
        headers: {
          'Authorization': `token ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    return response.data;
  }

  // Get user repos
  async getRepos(accessToken, options = {}) {
    const response = await axios.get(
      `${GITHUB_API_BASE}/user/repos`,
      {
        params: {
          visibility: options.visibility || 'all',
          affiliation: options.affiliation || 'owner,collaborator,organization_member',
          sort: options.sort || 'updated',
          per_page: options.perPage || 100
        },
        headers: {
          'Authorization': `token ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    return response.data;
  }

  // Create a gist
  async createGist(accessToken, gist) {
    const payload = {
      description: gist.description,
      public: gist.public !== false,
      files: gist.files
    };

    const response = await axios.post(
      `${GITHUB_API_BASE}/gists`,
      payload,
      {
        headers: {
          'Authorization': `token ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    return response.data;
  }

  // Create an issue (useful for social posting to project boards)
  async createIssue(accessToken, owner, repo, issue) {
    const payload = {
      title: issue.title.slice(0, 256),
      body: issue.body,
      labels: issue.labels || []
    };

    const response = await axios.post(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues`,
      payload,
      {
        headers: {
          'Authorization': `token ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    return response.data;
  }

  // Create a discussion (if discussions are enabled)
  async createDiscussion(accessToken, owner, repo, discussion) {
    // This requires GraphQL API
    const query = `
      mutation {
        createDiscussion(input: {
          repositoryId: "${discussion.repoId}",
          categoryId: "${discussion.categoryId}",
          title: "${discussion.title.replace(/"/g, '\\"')}",
          body: "${discussion.body.replace(/"/g, '\\"')}"
        }) {
          discussion {
            id
            url
          }
        }
      }
    `;

    const response = await axios.post(
      `${GITHUB_API_BASE}/graphql`,
      { query },
      {
        headers: {
          'Authorization': `bearer ${accessToken}`
        }
      }
    );

    return response.data;
  }
}
