-- Use gen_random_uuid() which is native in PostgreSQL 13+
-- No extension needed for UUID generation

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social accounts table (connected platforms)
CREATE TABLE accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  name TEXT NOT NULL,
  handle TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  is_connected BOOLEAN DEFAULT false,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  platform_user_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, platform)
);

-- Posts table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  platforms TEXT[] NOT NULL,
  media_urls TEXT[] DEFAULT '{}',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  external_ids JSONB DEFAULT '{}',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Post analytics table
CREATE TABLE post_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  impressions INTEGER DEFAULT 0,
  engagements INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view own accounts"
  ON accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own accounts"
  ON accounts FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own posts"
  ON posts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own posts"
  ON posts FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own analytics"
  ON post_analytics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM posts 
      WHERE posts.id = post_analytics.post_id 
      AND posts.user_id = auth.uid()
    )
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at
  BEFORE UPDATE ON accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_platform ON accounts(platform);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_scheduled_at ON posts(scheduled_at);
CREATE INDEX idx_post_analytics_post_id ON post_analytics(post_id);

-- Insert default platforms for new users
CREATE OR REPLACE FUNCTION create_default_accounts()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO accounts (user_id, platform, name, handle) VALUES
    (NEW.id, 'twitter', 'Twitter Account', '@user'),
    (NEW.id, 'linkedin', 'LinkedIn Profile', 'linkedin.com/in/user'),
    (NEW.id, 'facebook', 'Facebook Page', 'facebook.com/page'),
    (NEW.id, 'instagram', 'Instagram', '@user'),
    (NEW.id, 'reddit', 'Reddit Account', 'u/user'),
    (NEW.id, 'pinterest', 'Pinterest', 'pinterest.com/user'),
    (NEW.id, 'discord', 'Discord', 'Discord User'),
    (NEW.id, 'telegram', 'Telegram', '@user'),
    (NEW.id, 'bluesky', 'Bluesky', '@user.bsky.social'),
    (NEW.id, 'mastodon', 'Mastodon', '@user@mastodon.social'),
    (NEW.id, 'youtube', 'YouTube', 'youtube.com/@user'),
    (NEW.id, 'tiktok', 'TikTok', '@user'),
    (NEW.id, 'medium', 'Medium', 'medium.com/@user'),
    (NEW.id, 'tumblr', 'Tumblr', 'user.tumblr.com'),
    (NEW.id, 'github', 'GitHub', 'github.com/user'),
    (NEW.id, 'devto', 'Dev.to', 'dev.to/user'),
    (NEW.id, 'twitch', 'Twitch', 'twitch.tv/user'),
    (NEW.id, 'threads', 'Threads', '@user');
  
  INSERT INTO profiles (id, username, full_name)
  VALUES (NEW.id, SPLIT_PART(NEW.email, '@', 1), '');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_accounts();
