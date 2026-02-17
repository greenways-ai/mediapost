# Environment Setup Checklist

Use this checklist to track your environment configuration progress.

## ✅ Supabase Configuration

### Local Development (.env)

- [ ] **VITE_SUPABASE_URL** - Local Supabase URL (from `supabase start`)
  - Default: `http://localhost:54321`
  - Get from: `supabase start` output

- [ ] **VITE_SUPABASE_ANON_KEY** - Local anon key
  - Get from: `supabase start` output
  - Looks like: `eyJhbGciOiJIUzI1NiIs...`

### Staging Environment

- [ ] **STAGING_SUPABASE_PROJECT_REF** - Project reference ID
  - Format: `xxxxxxxxxxxxxxxxxxxx`
  - Get from: Supabase Dashboard > Project Settings > General

- [ ] **STAGING_SUPABASE_URL** - Staging project URL
  - Format: `https://xxxxxx.supabase.co`
  - Get from: Supabase Dashboard > Project Settings > API

- [ ] **STAGING_SUPABASE_ANON_KEY** - Staging public API key
  - Get from: Supabase Dashboard > Project Settings > API

### Production Environment

- [ ] **PRODUCTION_SUPABASE_PROJECT_REF** - Project reference ID
  - Format: `xxxxxxxxxxxxxxxxxxxx`
  - Get from: Supabase Dashboard > Project Settings > General

- [ ] **PRODUCTION_SUPABASE_URL** - Production project URL
  - Format: `https://xxxxxx.supabase.co`
  - Get from: Supabase Dashboard > Project Settings > API

- [ ] **PRODUCTION_SUPABASE_ANON_KEY** - Production public API key
  - Get from: Supabase Dashboard > Project Settings > API

### Supabase CLI Access

- [ ] **SUPABASE_ACCESS_TOKEN** - Personal access token
  - Get from: https://supabase.com/dashboard/account/tokens
  - Required for: GitHub Actions deployments

---

## 🔐 Social Media API Credentials

### Twitter / X
- [ ] **TWITTER_CLIENT_ID** - OAuth 2.0 Client ID
  - Get from: https://developer.twitter.com/en/portal/dashboard
  - Required scopes: `tweet.read`, `tweet.write`, `users.read`

- [ ] **TWITTER_CLIENT_SECRET** - OAuth 2.0 Client Secret
  - Store securely - never commit to git

- [ ] **Callback URL** configured: `https://your-app.com/auth/callback`

### Reddit
- [ ] **REDDIT_CLIENT_ID** - App ID
  - Get from: https://www.reddit.com/prefs/apps
  - Create app type: "web app"

- [ ] **REDDIT_CLIENT_SECRET** - App Secret

- [ ] **Redirect URI** configured: `https://your-app.com/auth/callback`

### Instagram / Facebook
- [ ] **INSTAGRAM_APP_ID** - Facebook App ID
  - Get from: https://developers.facebook.com/apps
  - Add "Instagram Basic Display" and "Instagram Graph API" products

- [ ] **INSTAGRAM_APP_SECRET** - Facebook App Secret

- [ ] **Valid OAuth Redirect URIs** configured

### Pinterest
- [ ] **PINTEREST_APP_ID** - App ID
  - Get from: https://developers.pinterest.com/apps/

- [ ] **PINTEREST_APP_SECRET** - App Secret

### Discord
- [ ] **DISCORD_CLIENT_ID** - Application ID
  - Get from: https://discord.com/developers/applications

- [ ] **DISCORD_CLIENT_SECRET** - Client Secret

- [ ] **OAuth2 Redirect** configured

### YouTube (Google)
- [ ] **YOUTUBE_CLIENT_ID** - OAuth 2.0 Client ID
  - Get from: https://console.cloud.google.com/apis/credentials
  - Enable YouTube Data API v3

- [ ] **YOUTUBE_CLIENT_SECRET** - Client Secret

- [ ] **Authorized redirect URIs** configured

### TikTok
- [ ] **TIKTOK_CLIENT_KEY** - Client Key
  - Get from: https://developers.tiktok.com/
  - Requires developer approval

- [ ] **TIKTOK_CLIENT_SECRET** - Client Secret

### LinkedIn
- [ ] **LINKEDIN_CLIENT_ID** - Client ID
  - Get from: https://www.linkedin.com/developers/apps

- [ ] **LINKEDIN_CLIENT_SECRET** - Client Secret

- [ ] **Authorized redirect URLs** configured

### Tumblr
- [ ] **TUMBLR_CONSUMER_KEY** - OAuth Consumer Key
  - Get from: https://www.tumblr.com/oauth/apps

- [ ] **TUMBLR_CONSUMER_SECRET** - Consumer Secret

### GitHub
- [ ] **GITHUB_CLIENT_ID** - Client ID
  - Get from: https://github.com/settings/developers
  - Create "OAuth App"

- [ ] **GITHUB_CLIENT_SECRET** - Client Secret

- [ ] **Authorization callback URL** configured

### Twitch
- [ ] **TWITCH_CLIENT_ID** - Client ID
  - Get from: https://dev.twitch.tv/console

- [ ] **TWITCH_CLIENT_SECRET** - Client Secret

- [ ] **OAuth Redirect URLs** configured

### Threads (Meta)
- [ ] **THREADS_APP_ID** - App ID
  - Get from: https://developers.facebook.com/apps
  - Add "Threads API" product

- [ ] **THREADS_APP_SECRET** - App Secret

### Telegram (Bot)
- [ ] **TELEGRAM_BOT_TOKEN** - Bot Token
  - Get from: Message @BotFather on Telegram
  - Create new bot: `/newbot`

### Bluesky
- [ ] **BLUESKY_APP_PASSWORD** - App Password
  - Get from: Bluesky Settings > App Passwords
  - Recommended: Create dedicated app password

### Mastodon
- [ ] **MASTODON_ACCESS_TOKEN** - Access Token
  - Get from: Your instance > Settings > Development > New Application
  - Required scopes: `read`, `write`

- [ ] **MASTODON_INSTANCE_URL** - Instance URL
  - Example: `https://mastodon.social`

### Medium
- [ ] **MEDIUM_INTEGRATION_TOKEN** - Integration Token
  - Get from: https://medium.com/me/settings
  - Scroll to "Integration tokens"

### Dev.to
- [ ] **DEVTO_API_KEY** - API Key
  - Get from: https://dev.to/settings/extensions
  - Generate new API key

---

## 🚀 Frontend Deployment

### Vercel (Optional)
- [ ] **VERCEL_TOKEN** - Vercel API Token
  - Get from: https://vercel.com/account/tokens

- [ ] **VERCEL_ORG_ID** - Organization ID
  - Get from: `vercel teams list` or project settings

- [ ] **VERCEL_PROJECT_ID** - Project ID
  - Get from: Project Settings > General

### Netlify (Optional)
- [ ] **NETLIFY_AUTH_TOKEN** - Personal Access Token
  - Get from: https://app.netlify.com/user/applications/personal

- [ ] **NETLIFY_SITE_ID** - Site ID
  - Get from: Site Settings > General > Site details

---

## 📝 GitHub Repository Settings

### Secrets Configuration

Navigate to: Settings > Secrets and variables > Actions

#### Required Secrets
- [ ] Add `SUPABASE_ACCESS_TOKEN`
- [ ] Add `STAGING_SUPABASE_PROJECT_REF`
- [ ] Add `STAGING_SUPABASE_URL`
- [ ] Add `STAGING_SUPABASE_ANON_KEY`
- [ ] Add `PRODUCTION_SUPABASE_PROJECT_REF`
- [ ] Add `PRODUCTION_SUPABASE_URL`
- [ ] Add `PRODUCTION_SUPABASE_ANON_KEY`

#### Optional Secrets (for frontend hosting)
- [ ] Add `VERCEL_TOKEN` (if using Vercel)
- [ ] Add `VERCEL_ORG_ID`
- [ ] Add `VERCEL_PROJECT_ID`
- [ ] Add `NETLIFY_AUTH_TOKEN` (if using Netlify)
- [ ] Add `NETLIFY_SITE_ID`

### Environment Protection

Navigate to: Settings > Environments

- [ ] Create `staging` environment
  - [ ] Add protection rules (optional)
  - [ ] Add required reviewers (optional)

- [ ] Create `production` environment
  - [ ] Add required reviewers (recommended)
  - [ ] Set wait timer (optional)
  - [ ] Configure deployment branches

### Branch Protection

Navigate to: Settings > Branches

- [ ] Protect `main` branch:
  - [ ] Require pull request reviews
  - [ ] Require status checks to pass
  - [ ] Require branches to be up to date
  - [ ] Include administrators (optional)

- [ ] Protect `develop` branch:
  - [ ] Require status checks to pass

---

## 🔒 Supabase Configuration

### Auth Providers (Supabase Dashboard)

Navigate to: Authentication > Providers

- [ ] **Twitter** - Enable and configure
- [ ] **GitHub** - Enable and configure
- [ ] **Google** - Enable and configure
- [ ] **Discord** - Enable and configure

### Database

- [ ] Run initial migrations: `supabase db reset`
- [ ] Verify tables created: `profiles`, `accounts`, `posts`, `post_analytics`
- [ ] Verify RLS policies are active

### Storage

Navigate to: Storage

- [ ] Create `media` bucket
- [ ] Set bucket to public (for public media URLs)
- [ ] Configure CORS if needed

### Edge Functions Secrets

Navigate to: Edge Functions > Secrets

Add these secrets for production:
- [ ] `TWITTER_CLIENT_ID`
- [ ] `TWITTER_CLIENT_SECRET`
- [ ] `REDDIT_CLIENT_ID`
- [ ] `REDDIT_CLIENT_SECRET`
- [ ] (Add other platform secrets as needed)

Or use Supabase Vault for secure storage.

---

## ✅ Verification Steps

After completing setup, verify everything works:

### Local Development
- [ ] `supabase start` runs without errors
- [ ] `npm run dev` starts frontend successfully
- [ ] Can sign up new user
- [ ] Default accounts are created automatically
- [ ] Can connect at least one social platform
- [ ] Can create and save a post

### Staging
- [ ] GitHub Action "Deploy Staging" runs successfully
- [ ] Can access staging URL
- [ ] Authentication works
- [ ] Database migrations applied

### Production
- [ ] GitHub Action "Deploy Production" runs successfully
- [ ] Can access production URL
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)

---

## 💡 Tips

1. **Start with local development** - Get everything working locally first
2. **Use separate Supabase projects** - Never use production for testing
3. **Keep secrets secure** - Never commit .env files or secrets
4. **Test OAuth flows locally** - Use `localhost:5173` for local callbacks
5. **Document custom changes** - Add notes if you deviate from this checklist

---

## 🆘 Troubleshooting

**Issue:** Environment variables not loading
- Check `.env` file is in project root
- Verify variable names start with `VITE_` for frontend
- Restart dev server after changes

**Issue:** Supabase connection fails
- Verify `supabase start` is running
- Check URL and key match `supabase status` output
- Ensure no firewall blocking port 54321

**Issue:** OAuth callback fails
- Verify callback URL matches exactly (including protocol)
- Check for trailing slashes
- Ensure URL is added to allowed origins in provider dashboard
