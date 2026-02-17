import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { TwitterService } from './services/twitter.js';
import { RedditService } from './services/reddit.js';
import { InstagramService } from './services/instagram.js';
import { PinterestService } from './services/pinterest.js';
import { DiscordService } from './services/discord.js';
import { TelegramService } from './services/telegram.js';
import { BlueskyService } from './services/bluesky.js';
import { MastodonService } from './services/mastodon.js';
import { YouTubeService } from './services/youtube.js';
import { TikTokService } from './services/tiktok.js';
import { LinkedInService } from './services/linkedin.js';
import { MediumService } from './services/medium.js';
import { TumblrService } from './services/tumblr.js';
import { GitHubService } from './services/github.js';
import { DevToService } from './services/devto.js';
import { TwitchService } from './services/twitch.js';
import { ThreadsService } from './services/threads.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Initialize services
const twitterService = process.env.TWITTER_CLIENT_ID ? new TwitterService(
  process.env.TWITTER_CLIENT_ID,
  process.env.TWITTER_CLIENT_SECRET,
  process.env.TWITTER_CALLBACK_URL
) : null;

const redditService = process.env.REDDIT_CLIENT_ID ? new RedditService(
  process.env.REDDIT_CLIENT_ID,
  process.env.REDDIT_CLIENT_SECRET,
  process.env.REDDIT_CALLBACK_URL
) : null;

const instagramService = process.env.INSTAGRAM_APP_ID ? new InstagramService(
  process.env.INSTAGRAM_APP_ID,
  process.env.INSTAGRAM_APP_SECRET,
  process.env.INSTAGRAM_CALLBACK_URL
) : null;

const pinterestService = process.env.PINTEREST_APP_ID ? new PinterestService(
  process.env.PINTEREST_APP_ID,
  process.env.PINTEREST_APP_SECRET,
  process.env.PINTEREST_CALLBACK_URL
) : null;

const discordService = process.env.DISCORD_CLIENT_ID ? new DiscordService(
  process.env.DISCORD_CLIENT_ID,
  process.env.DISCORD_CLIENT_SECRET,
  process.env.DISCORD_CALLBACK_URL
) : null;

const telegramService = new TelegramService();
const blueskyService = new BlueskyService();
const mastodonService = new MastodonService();
const mediumService = new MediumService();
const devtoService = new DevToService();

const youtubeService = process.env.YOUTUBE_CLIENT_ID ? new YouTubeService(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_CALLBACK_URL
) : null;

const tiktokService = process.env.TIKTOK_CLIENT_KEY ? new TikTokService(
  process.env.TIKTOK_CLIENT_KEY,
  process.env.TIKTOK_CLIENT_SECRET,
  process.env.TIKTOK_CALLBACK_URL
) : null;

const linkedinService = process.env.LINKEDIN_CLIENT_ID ? new LinkedInService(
  process.env.LINKEDIN_CLIENT_ID,
  process.env.LINKEDIN_CLIENT_SECRET,
  process.env.LINKEDIN_CALLBACK_URL
) : null;

const tumblrService = process.env.TUMBLR_CONSUMER_KEY ? new TumblrService(
  process.env.TUMBLR_CONSUMER_KEY,
  process.env.TUMBLR_CONSUMER_SECRET,
  process.env.TUMBLR_CALLBACK_URL
) : null;

const githubService = process.env.GITHUB_CLIENT_ID ? new GitHubService(
  process.env.GITHUB_CLIENT_ID,
  process.env.GITHUB_CLIENT_SECRET,
  process.env.GITHUB_CALLBACK_URL
) : null;

const twitchService = process.env.TWITCH_CLIENT_ID ? new TwitchService(
  process.env.TWITCH_CLIENT_ID,
  process.env.TWITCH_CLIENT_SECRET,
  process.env.TWITCH_CALLBACK_URL
) : null;

const threadsService = process.env.THREADS_APP_ID ? new ThreadsService(
  process.env.THREADS_APP_ID,
  process.env.THREADS_APP_SECRET,
  process.env.THREADS_CALLBACK_URL
) : null;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Store OAuth states and verifiers (in production, use Redis or database)
const oauthStates = new Map();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images and videos are allowed'));
  }
});

// Database setup
let db;

async function initDb() {
  db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      platforms TEXT NOT NULL,
      media_urls TEXT,
      scheduled_at DATETIME,
      status TEXT DEFAULT 'draft',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      published_at DATETIME,
      external_ids TEXT
    );

    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      platform TEXT NOT NULL,
      name TEXT NOT NULL,
      handle TEXT,
      avatar_url TEXT,
      is_active INTEGER DEFAULT 1,
      is_connected INTEGER DEFAULT 0,
      access_token TEXT,
      refresh_token TEXT,
      token_expires_at DATETIME,
      platform_user_id TEXT,
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  // Add columns if they don't exist (migration for existing databases)
  try {
    await db.exec(`
      ALTER TABLE accounts ADD COLUMN is_connected INTEGER DEFAULT 0;
      ALTER TABLE accounts ADD COLUMN access_token TEXT;
      ALTER TABLE accounts ADD COLUMN refresh_token TEXT;
      ALTER TABLE accounts ADD COLUMN token_expires_at DATETIME;
      ALTER TABLE accounts ADD COLUMN platform_user_id TEXT;
      ALTER TABLE accounts ADD COLUMN metadata TEXT;
      ALTER TABLE accounts ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP;
    `);
  } catch (e) {
    // Columns might already exist, ignore error
  }

  try {
    await db.exec(`
      ALTER TABLE posts ADD COLUMN external_ids TEXT;
    `);
  } catch (e) {
    // Column might already exist
  }

  // Seed default accounts if none exist
  const accounts = await db.get('SELECT COUNT(*) as count FROM accounts');
  if (accounts.count === 0) {
    await db.run(`
      INSERT INTO accounts (id, platform, name, handle) VALUES 
      ('${uuidv4()}', 'twitter', 'Twitter Account', '@user'),
      ('${uuidv4()}', 'linkedin', 'LinkedIn Profile', 'linkedin.com/in/user'),
      ('${uuidv4()}', 'facebook', 'Facebook Page', 'facebook.com/page'),
      ('${uuidv4()}', 'instagram', 'Instagram', '@user'),
      ('${uuidv4()}', 'reddit', 'Reddit Account', 'u/user'),
      ('${uuidv4()}', 'pinterest', 'Pinterest', 'pinterest.com/user'),
      ('${uuidv4()}', 'discord', 'Discord', 'Discord User'),
      ('${uuidv4()}', 'telegram', 'Telegram', '@user'),
      ('${uuidv4()}', 'bluesky', 'Bluesky', '@user.bsky.social'),
      ('${uuidv4()}', 'mastodon', 'Mastodon', '@user@mastodon.social'),
      ('${uuidv4()}', 'youtube', 'YouTube', 'youtube.com/@user'),
      ('${uuidv4()}', 'tiktok', 'TikTok', '@user'),
      ('${uuidv4()}', 'medium', 'Medium', 'medium.com/@user'),
      ('${uuidv4()}', 'tumblr', 'Tumblr', 'user.tumblr.com'),
      ('${uuidv4()}', 'github', 'GitHub', 'github.com/user'),
      ('${uuidv4()}', 'devto', 'Dev.to', 'dev.to/user'),
      ('${uuidv4()}', 'twitch', 'Twitch', 'twitch.tv/user'),
      ('${uuidv4()}', 'threads', 'Threads', '@user')
    `);
  }

  console.log('Database initialized');
}

// ==================== AUTH ROUTES ====================

// Get auth URL for a platform
app.get('/api/auth/:platform/url', async (req, res) => {
  try {
    const { platform } = req.params;
    const state = uuidv4();
    
    let authUrl;
    
    switch (platform) {
      case 'twitter':
        if (!twitterService) throw new Error('Twitter API not configured');
        const { url, codeVerifier } = twitterService.getAuthUrl(state);
        authUrl = url;
        oauthStates.set(state, { platform, codeVerifier });
        break;
        
      case 'reddit':
        if (!redditService) throw new Error('Reddit API not configured');
        authUrl = redditService.getAuthUrl(state);
        oauthStates.set(state, { platform });
        break;
        
      case 'instagram':
        if (!instagramService) throw new Error('Instagram API not configured');
        authUrl = instagramService.getAuthUrl(state);
        oauthStates.set(state, { platform });
        break;
        
      case 'pinterest':
        if (!pinterestService) throw new Error('Pinterest API not configured');
        authUrl = pinterestService.getAuthUrl(state);
        oauthStates.set(state, { platform });
        break;
        
      case 'discord':
        if (!discordService) throw new Error('Discord API not configured');
        authUrl = discordService.getAuthUrl(state);
        oauthStates.set(state, { platform });
        break;
        
      case 'youtube':
        if (!youtubeService) throw new Error('YouTube API not configured');
        authUrl = youtubeService.getAuthUrl(state);
        oauthStates.set(state, { platform });
        break;
        
      case 'tiktok':
        if (!tiktokService) throw new Error('TikTok API not configured');
        authUrl = tiktokService.getAuthUrl(state);
        oauthStates.set(state, { platform });
        break;
        
      case 'linkedin':
        if (!linkedinService) throw new Error('LinkedIn API not configured');
        authUrl = linkedinService.getAuthUrl(state);
        oauthStates.set(state, { platform });
        break;
        
      case 'tumblr':
        if (!tumblrService) throw new Error('Tumblr API not configured');
        // Tumblr uses OAuth 1.0a - need request token first
        const requestToken = await tumblrService.getRequestToken();
        authUrl = tumblrService.getAuthUrl(requestToken.oauth_token);
        oauthStates.set(state, { platform, requestToken });
        break;
        
      case 'github':
        if (!githubService) throw new Error('GitHub API not configured');
        authUrl = githubService.getAuthUrl(state);
        oauthStates.set(state, { platform });
        break;
        
      case 'twitch':
        if (!twitchService) throw new Error('Twitch API not configured');
        authUrl = twitchService.getAuthUrl(state);
        oauthStates.set(state, { platform });
        break;
        
      case 'threads':
        if (!threadsService) throw new Error('Threads API not configured');
        authUrl = threadsService.getAuthUrl(state);
        oauthStates.set(state, { platform });
        break;
        
      default:
        throw new Error('Unknown platform');
    }
    
    res.json({ authUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// OAuth callback handler
app.get('/api/auth/:platform/callback', async (req, res) => {
  try {
    const { platform } = req.params;
    const { code, state, error: oauthError } = req.query;
    
    if (oauthError) {
      return res.redirect(`${FRONTEND_URL}?error=${encodeURIComponent(oauthError)}`);
    }
    
    const stateData = oauthStates.get(state);
    if (!stateData || stateData.platform !== platform) {
      return res.redirect(`${FRONTEND_URL}?error=invalid_state`);
    }
    
    oauthStates.delete(state);
    
    let tokenData;
    let userInfo;
    
    switch (platform) {
      case 'twitter':
        tokenData = await twitterService.getAccessToken(code, stateData.codeVerifier);
        userInfo = await twitterService.getUserInfo(tokenData.access_token);
        
        await db.run(`
          UPDATE accounts 
          SET is_connected = 1,
              access_token = ?,
              refresh_token = ?,
              token_expires_at = datetime('now', '+${tokenData.expires_in || 7200} seconds'),
              platform_user_id = ?,
              handle = ?,
              name = ?,
              updated_at = datetime('now')
          WHERE platform = 'twitter'
        `, [
          tokenData.access_token,
          tokenData.refresh_token,
          userInfo.data.id,
          `@${userInfo.data.username}`,
          userInfo.data.name
        ]);
        break;
        
      case 'reddit':
        tokenData = await redditService.getAccessToken(code);
        userInfo = await redditService.getUserInfo(tokenData.access_token);
        
        await db.run(`
          UPDATE accounts 
          SET is_connected = 1,
              access_token = ?,
              refresh_token = ?,
              platform_user_id = ?,
              handle = ?,
              name = ?,
              updated_at = datetime('now')
          WHERE platform = 'reddit'
        `, [
          tokenData.access_token,
          tokenData.refresh_token,
          userInfo.id,
          `u/${userInfo.name}`,
          userInfo.name
        ]);
        break;
        
      case 'instagram':
        tokenData = await instagramService.getAccessToken(code);
        // Get long-lived token
        const longLivedToken = await instagramService.getLongLivedToken(tokenData.access_token);
        
        // Get user's pages
        const pages = await instagramService.getPages(longLivedToken.access_token);
        if (pages.data && pages.data.length > 0) {
          const page = pages.data[0];
          const instagramAccount = await instagramService.getInstagramAccount(
            page.id,
            page.access_token
          );
          
          if (instagramAccount) {
            const igInfo = await instagramService.getUserInfo(
              instagramAccount.id,
              page.access_token
            );
            
            await db.run(`
              UPDATE accounts 
              SET is_connected = 1,
                  access_token = ?,
                  platform_user_id = ?,
                  handle = ?,
                  name = ?,
                  metadata = ?,
                  updated_at = datetime('now')
              WHERE platform = 'instagram'
            `, [
              page.access_token,
              instagramAccount.id,
              `@${igInfo.username}`,
              igInfo.username,
              JSON.stringify({ 
                instagram_account_id: instagramAccount.id,
                page_id: page.id
              })
            ]);
          }
        }
        break;
        
      case 'pinterest':
        tokenData = await pinterestService.getAccessToken(code);
        userInfo = await pinterestService.getUserInfo(tokenData.access_token);
        
        await db.run(`
          UPDATE accounts 
          SET is_connected = 1,
              access_token = ?,
              refresh_token = ?,
              token_expires_at = datetime('now', '+${tokenData.expires_in || 2592000} seconds'),
              platform_user_id = ?,
              handle = ?,
              name = ?,
              updated_at = datetime('now')
          WHERE platform = 'pinterest'
        `, [
          tokenData.access_token,
          tokenData.refresh_token,
          userInfo.id,
          userInfo.username,
          userInfo.username
        ]);
        break;
        
      case 'discord':
        tokenData = await discordService.getAccessToken(code);
        userInfo = await discordService.getUserInfo(tokenData.access_token);
        
        // Get user's channels from guilds
        const channels = await discordService.getAllChannels(tokenData.access_token);
        
        await db.run(`
          UPDATE accounts 
          SET is_connected = 1,
              access_token = ?,
              refresh_token = ?,
              token_expires_at = datetime('now', '+${tokenData.expires_in || 604800} seconds'),
              platform_user_id = ?,
              handle = ?,
              name = ?,
              metadata = ?,
              updated_at = datetime('now')
          WHERE platform = 'discord'
        `, [
          tokenData.access_token,
          tokenData.refresh_token,
          userInfo.id,
          userInfo.username,
          userInfo.global_name || userInfo.username,
          JSON.stringify({ channels: channels })
        ]);
        break;
        
      case 'youtube':
        tokenData = await youtubeService.getAccessToken(code);
        
        // Get channel info
        const channelInfo = await youtubeService.getChannelInfo(tokenData.access_token);
        const channel = channelInfo.items?.[0];
        
        await db.run(`
          UPDATE accounts 
          SET is_connected = 1,
              access_token = ?,
              refresh_token = ?,
              token_expires_at = datetime('now', '+${tokenData.expires_in || 3600} seconds'),
              platform_user_id = ?,
              handle = ?,
              name = ?,
              updated_at = datetime('now')
          WHERE platform = 'youtube'
        `, [
          tokenData.access_token,
          tokenData.refresh_token,
          channel?.id,
          channel?.snippet?.customUrl || channel?.id,
          channel?.snippet?.title
        ]);
        break;
        
      case 'tiktok':
        tokenData = await tiktokService.getAccessToken(code);
        userInfo = await tiktokService.getUserInfo(tokenData.access_token, tokenData.open_id);
        
        await db.run(`
          UPDATE accounts 
          SET is_connected = 1,
              access_token = ?,
              refresh_token = ?,
              token_expires_at = datetime('now', '+${tokenData.expires_in || 86400} seconds'),
              platform_user_id = ?,
              handle = ?,
              name = ?,
              updated_at = datetime('now')
          WHERE platform = 'tiktok'
        `, [
          tokenData.access_token,
          tokenData.refresh_token,
          tokenData.open_id,
          `@${userInfo.display_name}`,
          userInfo.display_name
        ]);
        break;
        
      case 'linkedin':
        tokenData = await linkedinService.getAccessToken(code);
        userInfo = await linkedinService.getProfile(tokenData.access_token);
        
        await db.run(`
          UPDATE accounts 
          SET is_connected = 1,
              access_token = ?,
              refresh_token = ?,
              token_expires_at = datetime('now', '+${tokenData.expires_in || 5184000} seconds'),
              platform_user_id = ?,
              handle = ?,
              name = ?,
              updated_at = datetime('now')
          WHERE platform = 'linkedin'
        `, [
          tokenData.access_token,
          tokenData.refresh_token,
          userInfo.id,
          userInfo.vanityName || userInfo.id,
          `${userInfo.localizedFirstName} ${userInfo.localizedLastName}`
        ]);
        break;
        
      case 'github':
        tokenData = await githubService.getAccessToken(code);
        userInfo = await githubService.getUser(tokenData.access_token);
        
        await db.run(`
          UPDATE accounts 
          SET is_connected = 1,
              access_token = ?,
              token_expires_at = datetime('now', '+${tokenData.expires_in || 31536000} seconds'),
              platform_user_id = ?,
              handle = ?,
              name = ?,
              updated_at = datetime('now')
          WHERE platform = 'github'
        `, [
          tokenData.access_token,
          userInfo.id,
          userInfo.login,
          userInfo.name || userInfo.login
        ]);
        break;
        
      case 'twitch':
        tokenData = await twitchService.getAccessToken(code);
        userInfo = await twitchService.getUser(tokenData.access_token);
        
        await db.run(`
          UPDATE accounts 
          SET is_connected = 1,
              access_token = ?,
              refresh_token = ?,
              token_expires_at = datetime('now', '+${tokenData.expires_in || 14400} seconds'),
              platform_user_id = ?,
              handle = ?,
              name = ?,
              updated_at = datetime('now')
          WHERE platform = 'twitch'
        `, [
          tokenData.access_token,
          tokenData.refresh_token,
          userInfo.id,
          userInfo.login,
          userInfo.display_name
        ]);
        break;
        
      case 'threads':
        tokenData = await threadsService.getAccessToken(code);
        const llToken = await threadsService.getLongLivedToken(tokenData.access_token);
        userInfo = await threadsService.getUserProfile(llToken.access_token);
        
        await db.run(`
          UPDATE accounts 
          SET is_connected = 1,
              access_token = ?,
              token_expires_at = datetime('now', '+${llToken.expires_in || 5184000} seconds'),
              platform_user_id = ?,
              handle = ?,
              name = ?,
              updated_at = datetime('now')
          WHERE platform = 'threads'
        `, [
          llToken.access_token,
          userInfo.id,
          `@${userInfo.username}`,
          userInfo.username
        ]);
        break;
    }
    
    res.redirect(`${FRONTEND_URL}?connected=${platform}`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect(`${FRONTEND_URL}?error=${encodeURIComponent(error.message)}`);
  }
});

// Disconnect an account
app.post('/api/accounts/:platform/disconnect', async (req, res) => {
  try {
    const { platform } = req.params;
    
    await db.run(`
      UPDATE accounts 
      SET is_connected = 0,
          access_token = NULL,
          refresh_token = NULL,
          token_expires_at = NULL,
          platform_user_id = NULL,
          metadata = NULL,
          updated_at = datetime('now')
      WHERE platform = ?
    `, platform);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== API ROUTES ====================

// Get all accounts
app.get('/api/accounts', async (req, res) => {
  try {
    const accounts = await db.all('SELECT * FROM accounts WHERE is_active = 1');
    // Don't send tokens to client
    const sanitized = accounts.map(acc => ({
      ...acc,
      access_token: undefined,
      refresh_token: undefined
    }));
    res.json(sanitized);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM posts';
    if (status) {
      query += ` WHERE status = '${status}'`;
    }
    query += ' ORDER BY created_at DESC';
    const posts = await db.all(query);
    res.json(posts.map(post => ({
      ...post,
      platforms: JSON.parse(post.platforms),
      media_urls: post.media_urls ? JSON.parse(post.media_urls) : [],
      external_ids: post.external_ids ? JSON.parse(post.external_ids) : {}
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create post
app.post('/api/posts', async (req, res) => {
  try {
    const { content, platforms, scheduledAt } = req.body;
    const id = uuidv4();
    const status = scheduledAt ? 'scheduled' : 'draft';
    
    await db.run(
      'INSERT INTO posts (id, content, platforms, scheduled_at, status) VALUES (?, ?, ?, ?, ?)',
      [id, content, JSON.stringify(platforms), scheduledAt || null, status]
    );
    
    const post = await db.get('SELECT * FROM posts WHERE id = ?', id);
    res.json({
      ...post,
      platforms: JSON.parse(post.platforms),
      media_urls: post.media_urls ? JSON.parse(post.media_urls) : [],
      external_ids: {}
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload media for post
app.post('/api/posts/:id/media', upload.array('media', 4), async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files;
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    const mediaUrls = files.map(file => `/uploads/${file.filename}`);
    
    // Get existing media
    const existing = await db.get('SELECT media_urls FROM posts WHERE id = ?', id);
    const existingUrls = existing?.media_urls ? JSON.parse(existing.media_urls) : [];
    const allUrls = [...existingUrls, ...mediaUrls];
    
    await db.run(
      'UPDATE posts SET media_urls = ? WHERE id = ?',
      [JSON.stringify(allUrls), id]
    );
    
    res.json({ mediaUrls: allUrls });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Publish post to platforms
app.post('/api/posts/:id/publish', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await db.get('SELECT * FROM posts WHERE id = ?', id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const platforms = JSON.parse(post.platforms);
    const mediaUrls = post.media_urls ? JSON.parse(post.media_urls) : [];
    const externalIds = {};
    const errors = [];
    
    // Get connected accounts
    const accounts = await db.all(
      'SELECT * FROM accounts WHERE platform IN (' + platforms.map(() => '?').join(',') + ') AND is_connected = 1',
      platforms
    );
    
    const accountMap = {};
    accounts.forEach(acc => accountMap[acc.platform] = acc);
    
    // Post to each platform
    for (const platform of platforms) {
      try {
        const account = accountMap[platform];
        if (!account) {
          errors.push(`${platform}: Account not connected`);
          continue;
        }
        
        switch (platform) {
          case 'twitter':
            if (twitterService) {
              // Build full URLs for media
              const fullMediaUrls = mediaUrls.map(url => 
                url.startsWith('http') ? url : `${FRONTEND_URL.replace('5173', '3001')}${url}`
              );
              
              const result = await twitterService.postTweet(
                account.access_token,
                post.content,
                [] // Media upload requires OAuth 1.0a, would need separate implementation
              );
              externalIds.twitter = result.data?.id;
            }
            break;
            
          case 'reddit':
            if (redditService) {
              // Get metadata for subreddit
              const metadata = account.metadata ? JSON.parse(account.metadata) : {};
              const subreddit = metadata.preferred_subreddit || 'test';
              
              const result = await redditService.submitPost(
                account.access_token,
                subreddit,
                post.content.slice(0, 300), // Title limit
                post.content,
                'self'
              );
              externalIds.reddit = result.json?.data?.name;
            }
            break;
            
          case 'instagram':
            if (instagramService) {
              const metadata = account.metadata ? JSON.parse(account.metadata) : {};
              const instagramAccountId = metadata.instagram_account_id;
              
              // Build full URLs for media
              const fullMediaUrls = mediaUrls.map(url => 
                url.startsWith('http') ? url : `${FRONTEND_URL.replace('5173', '3001')}${url}`
              );
              
              let result;
              if (fullMediaUrls.length === 0) {
                errors.push('instagram: Instagram requires at least one image');
                continue;
              } else if (fullMediaUrls.length === 1) {
                result = await instagramService.postImage(
                  instagramAccountId,
                  account.access_token,
                  fullMediaUrls[0],
                  post.content
                );
              } else {
                result = await instagramService.postCarousel(
                  instagramAccountId,
                  account.access_token,
                  fullMediaUrls,
                  post.content
                );
              }
              externalIds.instagram = result.id;
            }
            break;
            
          case 'pinterest':
            if (pinterestService) {
              const metadata = account.metadata ? JSON.parse(account.metadata) : {};
              const boardIds = metadata.selected_boards || [];
              
              if (boardIds.length === 0) {
                errors.push('pinterest: No boards selected. Please select boards in account settings.');
                continue;
              }
              
              // Build full URLs for media
              const fullMediaUrls = mediaUrls.map(url => 
                url.startsWith('http') ? url : `${FRONTEND_URL.replace('5173', '3001')}${url}`
              );
              
              const mediaSource = fullMediaUrls.length > 0 ? fullMediaUrls[0] : null;
              
              const results = await pinterestService.createPinsToMultipleBoards(
                account.access_token,
                boardIds,
                post.content.slice(0, 100),
                post.content,
                null, // link
                mediaSource
              );
              
              externalIds.pinterest = results.filter(r => r.success).map(r => r.pinId);
            }
            break;
            
          case 'discord':
            if (discordService) {
              const metadata = account.metadata ? JSON.parse(account.metadata) : {};
              const channelIds = metadata.selected_channels || [];
              
              if (channelIds.length === 0) {
                errors.push('discord: No channels selected. Please select channels in account settings.');
                continue;
              }
              
              // Build full URLs for media
              const fullMediaUrls = mediaUrls.map(url => 
                url.startsWith('http') ? url : `${FRONTEND_URL.replace('5173', '3001')}${url}`
              );
              
              // Create embeds for images
              const embeds = fullMediaUrls.slice(0, 4).map(url => ({
                image: { url }
              }));
              
              const results = await discordService.sendMessageToMultipleChannels(
                account.access_token,
                channelIds,
                post.content,
                embeds
              );
              
              externalIds.discord = results.filter(r => r.success).map(r => r.messageId);
            }
            break;
        }
      } catch (err) {
        console.error(`Error posting to ${platform}:`, err);
        errors.push(`${platform}: ${err.message}`);
      }
    }
    
    // Update post status
    await db.run(
      'UPDATE posts SET status = ?, published_at = CURRENT_TIMESTAMP, external_ids = ? WHERE id = ?',
      ['published', JSON.stringify(externalIds), id]
    );
    
    const updatedPost = await db.get('SELECT * FROM posts WHERE id = ?', id);
    
    res.json({
      ...updatedPost,
      platforms: JSON.parse(updatedPost.platforms),
      media_urls: updatedPost.media_urls ? JSON.parse(updatedPost.media_urls) : [],
      external_ids: externalIds,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Publish error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete post
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM posts WHERE id = ?', id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update post
app.patch('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, platforms, scheduled_at, status, media_urls } = req.body;
    
    const updates = [];
    const values = [];
    
    if (content !== undefined) {
      updates.push('content = ?');
      values.push(content);
    }
    if (platforms !== undefined) {
      updates.push('platforms = ?');
      values.push(JSON.stringify(platforms));
    }
    if (scheduled_at !== undefined) {
      updates.push('scheduled_at = ?');
      values.push(scheduled_at);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }
    if (media_urls !== undefined) {
      updates.push('media_urls = ?');
      values.push(media_urls);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    values.push(id);
    await db.run(`UPDATE posts SET ${updates.join(', ')} WHERE id = ?`, values);
    
    const post = await db.get('SELECT * FROM posts WHERE id = ?', id);
    res.json({
      ...post,
      platforms: JSON.parse(post.platforms),
      media_urls: post.media_urls ? JSON.parse(post.media_urls) : [],
      external_ids: post.external_ids ? JSON.parse(post.external_ids) : {}
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Reddit subreddits for connected account
app.get('/api/reddit/subreddits', async (req, res) => {
  try {
    const account = await db.get("SELECT * FROM accounts WHERE platform = 'reddit' AND is_connected = 1");
    if (!account || !redditService) {
      return res.status(404).json({ error: 'Reddit not connected' });
    }
    
    const subreddits = await redditService.getSubreddits(account.access_token);
    res.json(subreddits.data?.children?.map(child => ({
      name: child.data.display_name,
      title: child.data.title,
      subscribers: child.data.subscribers
    })) || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Pinterest boards for connected account
app.get('/api/pinterest/boards', async (req, res) => {
  try {
    const account = await db.get("SELECT * FROM accounts WHERE platform = 'pinterest' AND is_connected = 1");
    if (!account || !pinterestService) {
      return res.status(404).json({ error: 'Pinterest not connected' });
    }
    
    const boards = await pinterestService.getBoards(account.access_token);
    res.json(boards.items?.map(board => ({
      id: board.id,
      name: board.name,
      description: board.description,
      url: board.url
    })) || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Discord channels for connected account
app.get('/api/discord/channels', async (req, res) => {
  try {
    const account = await db.get("SELECT * FROM accounts WHERE platform = 'discord' AND is_connected = 1");
    if (!account || !discordService) {
      return res.status(404).json({ error: 'Discord not connected' });
    }
    
    // Check if we have cached channels in metadata
    const metadata = account.metadata ? JSON.parse(account.metadata) : {};
    if (metadata.channels && metadata.channels.length > 0) {
      return res.json(metadata.channels);
    }
    
    // Otherwise fetch fresh
    const channels = await discordService.getAllChannels(account.access_token);
    
    // Update cache
    await db.run(
      'UPDATE accounts SET metadata = ? WHERE platform = "discord"',
      [JSON.stringify({ ...metadata, channels })]
    );
    
    res.json(channels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update account metadata
app.patch('/api/accounts/:platform/metadata', async (req, res) => {
  try {
    const { platform } = req.params;
    const metadataUpdate = req.body;
    
    const account = await db.get('SELECT metadata FROM accounts WHERE platform = ?', platform);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    
    const currentMetadata = account.metadata ? JSON.parse(account.metadata) : {};
    const newMetadata = { ...currentMetadata, ...metadataUpdate };
    
    await db.run(
      'UPDATE accounts SET metadata = ?, updated_at = datetime("now") WHERE platform = ?',
      [JSON.stringify(newMetadata), platform]
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Queue settings
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await db.all('SELECT * FROM settings');
    const settingsObj = {};
    settings.forEach(s => settingsObj[s.key] = s.value);
    res.json(settingsObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Frontend URL: ${FRONTEND_URL}`);
    console.log('');
    console.log('API Integrations:');
    console.log(`  Twitter: ${twitterService ? '✅ Configured' : '❌ Not configured'}`);
    console.log(`  Reddit: ${redditService ? '✅ Configured' : '❌ Not configured'}`);
    console.log(`  Instagram: ${instagramService ? '✅ Configured' : '❌ Not configured'}`);
  });
});
