# Buffer Clone

A self-hosted social media scheduling application powered by Supabase. Compose, schedule, and post content to 18+ social platforms.

![Buffer Clone Screenshot](https://via.placeholder.com/800x400/3778ff/ffffff?text=Buffer+Clone)

## Features

- ✍️ **Compose Posts** - Write content with a clean, distraction-free editor
- 🔗 **18+ Platform Support** - Twitter/X, Instagram, Reddit, Pinterest, Discord, Telegram, Bluesky, Mastodon, YouTube, TikTok, LinkedIn, Medium, Tumblr, GitHub, Dev.to, Twitch, Threads, and more
- 📊 **Character Limits** - Automatic character counting per platform
- 📅 **Scheduling** - Schedule posts for future dates and times
- 🖼️ **Media Uploads** - Attach images and videos with Supabase Storage
- 🔐 **Supabase Auth** - Email/password and OAuth authentication
- 📋 **Post Queue** - Manage drafts, scheduled, and published posts
- ☁️ **Supabase Backend** - PostgreSQL database, Edge Functions, and real-time subscriptions
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🚀 **CI/CD Ready** - GitHub Actions workflows for automated deployment

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started)

### Installation

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Install dependencies
npm install

# Start local Supabase
supabase start

# Copy environment file
cp .env.example .env
# Edit .env with credentials from `supabase start` output

# Start the development server
npm run dev
```

This will start:
- **Frontend**: http://localhost:5173
- **Supabase Studio**: http://localhost:54323
- **Supabase API**: http://localhost:54321

## Documentation

| Document | Description |
|----------|-------------|
| [ENV_QUICKSTART.md](ENV_QUICKSTART.md) | ⚡ Quick environment setup (5 min) |
| [ENV_SETUP_CHECKLIST.md](ENV_SETUP_CHECKLIST.md) | ✅ Complete setup checklist |
| [SUPABASE_SETUP.md](SUPABASE_SETUP.md) | 🗄️ Supabase configuration guide |
| [DEPLOYMENT.md](DEPLOYMENT.md) | 🚀 Deployment and CI/CD guide |

## Supported Platforms

### Social Networks
- **Twitter/X** - Microblogging
- **Instagram** - Visual storytelling
- **Facebook** - Social networking
- **LinkedIn** - Professional networking
- **Reddit** - Forum discussions
- **Pinterest** - Visual discovery
- **TikTok** - Short videos
- **YouTube** - Video platform
- **Threads** - Meta's microblogging

### Developer Platforms
- **GitHub** - Code repositories
- **Dev.to** - Developer blogging
- **Medium** - Publishing platform

### Messaging/Community
- **Discord** - Community chat
- **Telegram** - Messaging

### Decentralized/Federated
- **Bluesky** - Decentralized social
- **Mastodon** - Federated social

### Other
- **Twitch** - Live streaming
- **Tumblr** - Microblogging

## Architecture

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + TypeScript + Tailwind CSS |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| Database | PostgreSQL with Row Level Security |
| Auth | Supabase Auth (Email + OAuth) |
| Storage | Supabase Storage |
| Edge Functions | Deno/TypeScript |
| CI/CD | GitHub Actions |

### Database Schema

```
auth.users (Supabase Auth)
  └── profiles (user profiles)
  └── accounts (connected platforms)
  └── posts (scheduled/published content)
  └── post_analytics (metrics)
```

### Project Structure

```
├── src/                      # Frontend source
│   ├── components/           # React components
│   ├── lib/                  # Supabase client
│   └── types/                # TypeScript types
├── supabase/
│   ├── migrations/           # Database migrations
│   └── functions/            # Edge Functions
├── .github/workflows/        # CI/CD workflows
└── .env                      # Environment variables
```

## Environment Setup

### Option 1: Quick Start (Recommended)

See [ENV_QUICKSTART.md](ENV_QUICKSTART.md) for a 15-minute setup.

### Option 2: Complete Checklist

See [ENV_SETUP_CHECKLIST.md](ENV_SETUP_CHECKLIST.md) for detailed step-by-step configuration.

## Deployment

### Staging

Push to `develop` branch for automatic staging deployment:

```bash
git checkout -b develop
git push origin develop
```

### Production

Push to `main` branch for production deployment:

```bash
git checkout main
git merge develop
git push origin main
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## CI/CD Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `ci.yml` | PR/Push | Lint, build, test |
| `deploy-staging.yml` | Push to `develop` | Deploy to staging |
| `deploy-production.yml` | Push to `main` | Deploy to production |
| `migrate.yml` | Manual | Database migrations |
| `release.yml` | Tag push | Create releases |

## Authentication

### Email/Password
- Standard email and password signup/signin
- Email confirmation (configurable)

### OAuth Providers
Supabase Auth supports:
- Twitter
- GitHub
- Google
- Discord

Configure in Supabase Dashboard > Authentication > Providers

## API Credentials

To post to social platforms, you need API credentials for each service. See [ENV_SETUP_CHECKLIST.md](ENV_SETUP_CHECKLIST.md) for links to each platform's developer portal.

## Customization

### Adding a New Platform

1. Add platform config to `src/types/index.ts`
2. Add icon to `src/components/PlatformIcon.tsx`
3. Create service in `supabase/functions/publish-post/`
4. Update database (if needed)

### Custom Styling

Edit `tailwind.config.js` and component files in `src/components/`.

## Troubleshooting

### Common Issues

**Supabase connection fails**
- Ensure `supabase start` is running
- Check `.env` values match `supabase status` output

**OAuth callback fails**
- Verify callback URL matches exactly in provider dashboard
- Check for trailing slashes

**Build fails**
- Run `npm ci` to clean install dependencies
- Check TypeScript errors with `npm run build`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Credits

- Inspired by [Buffer](https://buffer.com)
- Built with [Supabase](https://supabase.com)
- Icons from various platform brand assets

---

**Ready to start?** Check out [ENV_QUICKSTART.md](ENV_QUICKSTART.md) for the 15-minute setup guide!
