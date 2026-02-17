import axios from 'axios';

const DISCORD_API_BASE = 'https://discord.com/api/v10';

export class DiscordService {
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
      scope: 'identify guilds bot',
      permissions: '2048', // Send Messages permission
      state: state
    });

    return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
  }

  // Exchange code for access token
  async getAccessToken(code) {
    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.redirectUri
    });

    const response = await axios.post(
      `${DISCORD_API_BASE}/oauth2/token`,
      params,
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
    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    });

    const response = await axios.post(
      `${DISCORD_API_BASE}/oauth2/token`,
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return response.data;
  }

  // Get user info
  async getUserInfo(accessToken) {
    const response = await axios.get(
      `${DISCORD_API_BASE}/users/@me`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    return response.data;
  }

  // Get user's guilds (servers)
  async getGuilds(accessToken) {
    const response = await axios.get(
      `${DISCORD_API_BASE}/users/@me/guilds`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    return response.data;
  }

  // Get channels in a guild
  async getGuildChannels(accessToken, guildId) {
    const response = await axios.get(
      `${DISCORD_API_BASE}/guilds/${guildId}/channels`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    // Filter to text channels only (type 0 is GUILD_TEXT, type 5 is GUILD_ANNOUNCEMENT)
    return response.data.filter(channel => channel.type === 0 || channel.type === 5);
  }

  // Get all channels user can access (from all guilds)
  async getAllChannels(accessToken) {
    const guilds = await this.getGuilds(accessToken);
    const allChannels = [];

    for (const guild of guilds) {
      try {
        const channels = await this.getGuildChannels(accessToken, guild.id);
        channels.forEach(channel => {
          allChannels.push({
            id: channel.id,
            name: channel.name,
            guildId: guild.id,
            guildName: guild.name,
            type: channel.type
          });
        });
      } catch (error) {
        console.error(`Failed to get channels for guild ${guild.name}:`, error.message);
      }
    }

    return allChannels;
  }

  // Send message to a channel
  async sendMessage(accessToken, channelId, content, embeds = []) {
    const payload = {
      content: content.slice(0, 2000) // Discord message limit
    };

    if (embeds.length > 0) {
      payload.embeds = embeds.slice(0, 10); // Max 10 embeds
    }

    const response = await axios.post(
      `${DISCORD_API_BASE}/channels/${channelId}/messages`,
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

  // Send message to multiple channels
  async sendMessageToMultipleChannels(accessToken, channelIds, content, embeds = []) {
    const results = [];
    
    for (const channelId of channelIds) {
      try {
        const result = await this.sendMessage(accessToken, channelId, content, embeds);
        results.push({ channelId, success: true, messageId: result.id });
      } catch (error) {
        results.push({ channelId, success: false, error: error.message });
      }
    }

    return results;
  }

  // Send message with image attachment (using webhook approach)
  async sendMessageWithImage(botToken, channelId, content, imageUrl) {
    const payload = {
      content: content.slice(0, 2000),
      embeds: [{
        image: {
          url: imageUrl
        }
      }]
    };

    const response = await axios.post(
      `${DISCORD_API_BASE}/channels/${channelId}/messages`,
      payload,
      {
        headers: {
          'Authorization': `Bot ${botToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  }
}
