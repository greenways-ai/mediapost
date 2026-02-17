# Buffer Clone

A self-hosted social media scheduling application inspired by [Buffer](https://buffer.com). Compose, schedule, and post content to Twitter/X, Instagram, and Reddit with real API integrations.

![Buffer Clone Screenshot](https://via.placeholder.com/800x400/3778ff/ffffff?text=Buffer+Clone)

## Features

- ✍️ **Compose Posts** - Write content with a clean, distraction-free editor
- 🔗 **Real API Integrations** - Actually post to Twitter/X, Instagram, and Reddit
- 📱 **Multi-Platform** - Support for Twitter/X, Instagram, Reddit, Facebook, and LinkedIn
- 📊 **Character Limits** - Automatic character counting per platform
- 📅 **Scheduling** - Schedule posts for future dates and times
- 🖼️ **Media Uploads** - Attach images and videos (Instagram carousels supported)
- 🔐 **OAuth Authentication** - Secure connection to social platforms
- 📋 **Post Queue** - Manage drafts, scheduled, and published posts
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- API credentials from Twitter, Reddit, and/or Instagram (see setup below)

### Installation

```bash
# Clone or navigate to the project
cd buffer-clone

# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your API credentials

# Start the development servers
npm run dev
```

This will start:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## API Setup Guide

To post to real social platforms, you need to set up API credentials for each service:

### Twitter/X Setup

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new Project, then create an App within it
3. In "User authentication settings", enable OAuth 2.0
4. Add callback URL: `http://localhost:3001/api/auth/twitter/callback`
5. Copy **Client ID** and **Client Secret** to your `.env` file

### Reddit Setup

1. Go to [Reddit App Preferences](https://www.reddit.com/prefs/apps)
2. Click "create another app..."
3. Select "web app"
4. Set redirect URI: `http://localhost:3001/api/auth/reddit/callback`
5. Copy **Client ID** (the string under the app name) and **Client Secret** to your `.env` file

### Instagram Setup (via Facebook)

1. Go to [Meta for Developers](https://developers.facebook.com/apps)
2. Create a new app → Select "Business" type
3. Add products: **Instagram Basic Display** and **Instagram Graph API**
4. Configure OAuth:
   - Valid OAuth Redirect URIs: `http://localhost:3001/api/auth/instagram/callback`
5. Copy **App ID** and **App Secret** to your `.env` file

**Note**: Instagram requires a Facebook Page connected to an Instagram Business Account. The app will automatically find and use the first available Instagram account.

## Usage Guide

### Connecting Accounts

1. Navigate to the **Accounts** tab in the app
2. Click **Connect** next to Twitter, Reddit, or Instagram
3. Complete the OAuth flow in the popup
4. Your account is now connected and ready to post!

### Creating a Post

1. **Select Platforms** - Click platform buttons to select where to post (only connected platforms can be selected for API posting)
2. **Write Content** - Type your message. Character limits adjust automatically
3. **Add Media** (Optional) - Upload images/videos:
   - Instagram: Requires at least 1 image, supports up to 10 for carousels
   - Twitter: Supports up to 4 images
   - Reddit: Text posts only (media shown as links)
4. **Schedule or Post**:
   - **Post Now**: Publishes immediately to all selected platforms
   - **Schedule**: Select date/time for future publication

### Platform-Specific Features

| Platform | Text | Images | Videos | Carousels | Notes |
|----------|------|--------|--------|-----------|-------|
| Twitter/X | ✅ | ✅ (4) | ❌ | ❌ | OAuth 2.0 required |
| Reddit | ✅ | ❌ | ❌ | ❌ | Posts to selected subreddit |
| Instagram | ✅ | ✅ (10) | ❌ | ✅ | Requires Facebook Page + Business Account |
| Facebook | ✅ | ✅ | ✅ | ❌ | Mock only (no API integration) |
| LinkedIn | ✅ | ✅ | ✅ | ❌ | Mock only (no API integration) |

### Managing Posts

The **Post Queue** shows your posts in three tabs:

| Tab | Description |
|-----|-------------|
| **Scheduled** | Posts waiting to be published at a specific time |
| **Published** | Successfully posted content with external IDs |
| **Drafts** | Saved posts not yet published |

## Architecture

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + TypeScript + Tailwind CSS v4 |
| Backend | Express.js |
| Database | SQLite |
| OAuth | Custom implementation (Twitter OAuth 2.0, Reddit OAuth 2.0, Instagram Graph API) |
| Build Tool | Vite |

### Project Structure

```
buffer-clone/
├── src/
│   ├── components/
│   │   ├── Composer.tsx         # Post creation form
│   │   ├── PlatformSelector.tsx # Platform selection with connection status
│   │   ├── MediaUploader.tsx    # Image/video upload
│   │   ├── PostQueue.tsx        # Post list management
│   │   ├── PostCard.tsx         # Individual post display
│   │   ├── PlatformIcon.tsx     # Platform icons
│   │   └── AccountManager.tsx   # OAuth connection management
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── server/
│   ├── index.js                 # Express server + OAuth handlers
│   └── services/
│       ├── twitter.js           # Twitter API v2 integration
│       ├── reddit.js            # Reddit API integration
│       └── instagram.js         # Instagram Graph API integration
├── uploads/                     # Uploaded media storage
└── .env                         # API credentials (not committed)
```

### API Endpoints

#### Auth Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/:platform/url` | Get OAuth URL for platform |
| GET | `/api/auth/:platform/callback` | OAuth callback handler |
| POST | `/api/accounts/:platform/disconnect` | Disconnect account |

#### Post Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/accounts` | List accounts (connected status) |
| GET | `/api/posts` | List posts |
| POST | `/api/posts` | Create a new post |
| POST | `/api/posts/:id/media` | Upload media |
| POST | `/api/posts/:id/publish` | Publish to connected platforms |
| PATCH | `/api/posts/:id` | Update post |
| DELETE | `/api/posts/:id` | Delete post |

#### Reddit Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reddit/subreddits` | List user's subscribed subreddits |
| PATCH | `/api/accounts/:platform/metadata` | Update account metadata (e.g., preferred subreddit) |

## Environment Variables

Create a `.env` file in the root directory:

```env
# Twitter/X API Credentials
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
TWITTER_CALLBACK_URL=http://localhost:3001/api/auth/twitter/callback

# Reddit API Credentials
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
REDDIT_CALLBACK_URL=http://localhost:3001/api/auth/reddit/callback

# Instagram/Facebook API Credentials
INSTAGRAM_APP_ID=your_instagram_app_id
INSTAGRAM_APP_SECRET=your_instagram_app_secret
INSTAGRAM_CALLBACK_URL=http://localhost:3001/api/auth/instagram/callback

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Scripts

```bash
# Development - starts both frontend and backend
npm run dev

# Start backend only
npm run server

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Limitations & Notes

### Twitter/X
- OAuth 2.0 is used for authentication
- Media uploads require OAuth 1.0a (not implemented; text-only posts work)
- Rate limits apply based on your Twitter API plan

### Reddit
- Posts are made to a selected subreddit (default: 'test')
- Text posts only (link posts supported but not implemented in UI)
- Requires "submit" OAuth scope

### Instagram
- Requires an Instagram Business Account connected to a Facebook Page
- Media must be hosted on a publicly accessible URL (the server provides this for uploads)
- Single images and carousels supported; videos require additional processing
- Instagram has strict content policies

### Facebook & LinkedIn
- Currently mock platforms (no real API integration)
- You can extend the code following the same pattern as Twitter/Reddit/Instagram

## Troubleshooting

### "API not configured" error
Make sure you've added the credentials to your `.env` file and restarted the server.

### OAuth redirect fails
Check that your callback URLs in the developer consoles exactly match your `.env` values.

### Instagram connection fails
- Ensure your Instagram account is a Business Account
- It must be connected to a Facebook Page you administer
- The Facebook app needs Instagram Basic Display and Instagram Graph API products added

### Posts show errors
Check the server console for detailed error messages. Common issues:
- Expired tokens (reconnect the account)
- Rate limiting (wait before retrying)
- Content policy violations

## Data Storage

All data is stored locally:
- `server/database.sqlite` - Posts, accounts, and OAuth tokens
- `uploads/` - Uploaded media files

**Security Note**: OAuth tokens are stored in the database. In production, consider encrypting these values.

## Extending

### Adding a New Platform

1. Create a service in `server/services/{platform}.js`
2. Add OAuth routes in `server/index.js`
3. Add publishing logic in the publish endpoint
4. Update `src/types/index.ts` with new platform config
5. Update `src/components/PlatformIcon.tsx` with the icon

## Stopping the Servers

```bash
# Stop both servers
pkill -f "node server/index.js"
pkill -f "vite"

# Or on Windows
taskkill /F /IM node.exe
```

## License

MIT

## Credits

Inspired by [Buffer](https://buffer.com) - the original social media scheduling tool.
