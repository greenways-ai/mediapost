export interface Account {
  id: string;
  platform: Platform;
  name: string;
  handle?: string;
  avatar_url?: string;
  is_active: boolean;
  is_connected: boolean;
  platform_user_id?: string;
  metadata?: string;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  content: string;
  platforms: Platform[];
  media_urls: string[];
  scheduled_at?: string;
  status: 'draft' | 'scheduled' | 'published';
  created_at: string;
  published_at?: string;
  external_ids?: Record<string, string>;
}

export type Platform = 
  | 'twitter' | 'linkedin' | 'facebook' | 'instagram' | 'reddit' 
  | 'pinterest' | 'discord' | 'telegram' | 'bluesky' | 'mastodon'
  | 'youtube' | 'tiktok' | 'medium' | 'tumblr' | 'github'
  | 'devto' | 'twitch' | 'threads';

export interface PlatformConfig {
  id: Platform;
  name: string;
  icon: string;
  color: string;
  characterLimit: number;
  supportsMedia: boolean;
  requiresMedia?: boolean;
  allowsMultipleTargets?: boolean;
  authType: 'oauth' | 'token' | 'password';
}

export const PLATFORM_CONFIG: Record<Platform, PlatformConfig> = {
  // Original platforms
  twitter: {
    id: 'twitter',
    name: 'X (Twitter)',
    icon: 'twitter',
    color: '#000000',
    characterLimit: 280,
    supportsMedia: true,
    authType: 'oauth'
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'linkedin',
    color: '#0a66c2',
    characterLimit: 3000,
    supportsMedia: true,
    authType: 'oauth'
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    icon: 'facebook',
    color: '#1877f2',
    characterLimit: 63206,
    supportsMedia: true,
    authType: 'oauth'
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    icon: 'instagram',
    color: '#e4405f',
    characterLimit: 2200,
    supportsMedia: true,
    requiresMedia: true,
    authType: 'oauth'
  },
  reddit: {
    id: 'reddit',
    name: 'Reddit',
    icon: 'reddit',
    color: '#ff4500',
    characterLimit: 40000,
    supportsMedia: true,
    authType: 'oauth'
  },
  // New platforms
  pinterest: {
    id: 'pinterest',
    name: 'Pinterest',
    icon: 'pinterest',
    color: '#e60023',
    characterLimit: 500,
    supportsMedia: true,
    requiresMedia: true,
    allowsMultipleTargets: true,
    authType: 'oauth'
  },
  discord: {
    id: 'discord',
    name: 'Discord',
    icon: 'discord',
    color: '#5865f2',
    characterLimit: 2000,
    supportsMedia: true,
    allowsMultipleTargets: true,
    authType: 'oauth'
  },
  telegram: {
    id: 'telegram',
    name: 'Telegram',
    icon: 'telegram',
    color: '#0088cc',
    characterLimit: 4096,
    supportsMedia: true,
    allowsMultipleTargets: true,
    authType: 'token'
  },
  bluesky: {
    id: 'bluesky',
    name: 'Bluesky',
    icon: 'bluesky',
    color: '#0085ff',
    characterLimit: 300,
    supportsMedia: true,
    authType: 'password'
  },
  mastodon: {
    id: 'mastodon',
    name: 'Mastodon',
    icon: 'mastodon',
    color: '#6364ff',
    characterLimit: 500,
    supportsMedia: true,
    authType: 'token'
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    icon: 'youtube',
    color: '#ff0000',
    characterLimit: 5000,
    supportsMedia: true,
    requiresMedia: true,
    authType: 'oauth'
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    icon: 'tiktok',
    color: '#000000',
    characterLimit: 2200,
    supportsMedia: true,
    requiresMedia: true,
    authType: 'oauth'
  },
  medium: {
    id: 'medium',
    name: 'Medium',
    icon: 'medium',
    color: '#000000',
    characterLimit: 10000,
    supportsMedia: true,
    authType: 'token'
  },
  tumblr: {
    id: 'tumblr',
    name: 'Tumblr',
    icon: 'tumblr',
    color: '#001935',
    characterLimit: 10000,
    supportsMedia: true,
    allowsMultipleTargets: true,
    authType: 'oauth'
  },
  github: {
    id: 'github',
    name: 'GitHub',
    icon: 'github',
    color: '#181717',
    characterLimit: 65536,
    supportsMedia: true,
    authType: 'oauth'
  },
  devto: {
    id: 'devto',
    name: 'Dev.to',
    icon: 'devto',
    color: '#0a0a0a',
    characterLimit: 10000,
    supportsMedia: true,
    authType: 'token'
  },
  twitch: {
    id: 'twitch',
    name: 'Twitch',
    icon: 'twitch',
    color: '#9146ff',
    characterLimit: 500,
    supportsMedia: false,
    authType: 'oauth'
  },
  threads: {
    id: 'threads',
    name: 'Threads',
    icon: 'threads',
    color: '#000000',
    characterLimit: 500,
    supportsMedia: true,
    authType: 'oauth'
  }
};

export interface Subreddit {
  name: string;
  title: string;
  subscribers: number;
}

export interface PinterestBoard {
  id: string;
  name: string;
  description?: string;
  url?: string;
}

export interface DiscordChannel {
  id: string;
  name: string;
  guildId: string;
  guildName: string;
  type: number;
}

export interface TelegramChat {
  id: string;
  title: string;
  type: string;
}

export interface MastodonInstance {
  url: string;
}

export interface TumblrBlog {
  name: string;
  url: string;
  title: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
}
