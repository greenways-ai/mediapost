import axios from 'axios';

const TELEGRAM_API_BASE = 'https://api.telegram.org/bot';

export class TelegramService {
  constructor() {
    // Telegram uses bot tokens directly, no OAuth needed
  }

  // Validate bot token and get bot info
  async validateToken(botToken) {
    const response = await axios.get(`${TELEGRAM_API_BASE}${botToken}/getMe`);
    return response.data;
  }

  // Get updates to find channels the bot is in
  async getUpdates(botToken) {
    const response = await axios.get(`${TELEGRAM_API_BASE}${botToken}/getUpdates`);
    return response.data;
  }

  // Get chat info
  async getChat(botToken, chatId) {
    const response = await axios.post(`${TELEGRAM_API_BASE}${botToken}/getChat`, {
      chat_id: chatId
    });
    return response.data;
  }

  // Send message to a chat/channel
  async sendMessage(botToken, chatId, text, options = {}) {
    const payload = {
      chat_id: chatId,
      text: text.slice(0, 4096), // Telegram limit
      parse_mode: options.parse_mode || 'HTML',
      disable_web_page_preview: options.disablePreview || false
    };

    const response = await axios.post(`${TELEGRAM_API_BASE}${botToken}/sendMessage`, payload);
    return response.data;
  }

  // Send photo to a chat/channel
  async sendPhoto(botToken, chatId, photo, caption, options = {}) {
    const payload = {
      chat_id: chatId,
      photo: photo,
      caption: caption?.slice(0, 1024),
      parse_mode: options.parse_mode || 'HTML'
    };

    const response = await axios.post(`${TELEGRAM_API_BASE}${botToken}/sendPhoto`, payload);
    return response.data;
  }

  // Send media group (multiple photos)
  async sendMediaGroup(botToken, chatId, media, options = {}) {
    const payload = {
      chat_id: chatId,
      media: JSON.stringify(media.slice(0, 10)) // Max 10 items
    };

    const response = await axios.post(`${TELEGRAM_API_BASE}${botToken}/sendMediaGroup`, payload);
    return response.data;
  }

  // Send message to multiple channels
  async sendMessageToMultipleChats(botToken, chatIds, text, options = {}) {
    const results = [];
    
    for (const chatId of chatIds) {
      try {
        const result = await this.sendMessage(botToken, chatId, text, options);
        results.push({ chatId, success: true, messageId: result.result?.message_id });
      } catch (error) {
        results.push({ chatId, success: false, error: error.message });
      }
    }

    return results;
  }
}
