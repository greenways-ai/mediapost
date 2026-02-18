-- Platform Settings table for admin management
-- Stores OAuth credentials and platform enable/disable status

-- Add is_admin column to profiles table FIRST (needed for policies below)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create table for platform settings
CREATE TABLE platform_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT false,
  
  -- OAuth Configuration
  client_id TEXT,
  client_secret TEXT,
  redirect_uri TEXT,
  scope TEXT,
  auth_url TEXT,
  token_url TEXT,
  
  -- Additional platform-specific config (JSON for flexibility)
  additional_config JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- Admin-only policy - only admins can manage platform settings
CREATE POLICY "Admins can manage platform settings"
  ON platform_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- All authenticated users can view enabled platforms
CREATE POLICY "Users can view enabled platform settings"
  ON platform_settings FOR SELECT
  USING (
    is_enabled = true OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Create updated_at trigger
CREATE TRIGGER update_platform_settings_updated_at
  BEFORE UPDATE ON platform_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index
CREATE INDEX idx_platform_settings_platform ON platform_settings(platform);
CREATE INDEX idx_platform_settings_enabled ON platform_settings(is_enabled);

-- Insert default platform settings (all disabled by default)
INSERT INTO platform_settings (platform, name, is_enabled) VALUES
  ('twitter', 'X (Twitter)', false),
  ('linkedin', 'LinkedIn', false),
  ('facebook', 'Facebook', false),
  ('instagram', 'Instagram', false),
  ('reddit', 'Reddit', false),
  ('pinterest', 'Pinterest', false),
  ('discord', 'Discord', false),
  ('telegram', 'Telegram', false),
  ('bluesky', 'Bluesky', false),
  ('mastodon', 'Mastodon', false),
  ('youtube', 'YouTube', false),
  ('tiktok', 'TikTok', false),
  ('medium', 'Medium', false),
  ('tumblr', 'Tumblr', false),
  ('github', 'GitHub', false),
  ('devto', 'Dev.to', false),
  ('twitch', 'Twitch', false),
  ('threads', 'Threads', false);

-- Create policy to allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM profiles AS admin_profile
      WHERE admin_profile.id = auth.uid()
      AND admin_profile.is_admin = true
    )
  );
