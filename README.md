# MyPost

A social media management platform built with Next.js and Supabase. Schedule and publish posts to multiple social media platforms from a single dashboard.

## Features

- **Multi-Platform Publishing**: Post to Twitter, LinkedIn, Facebook, Instagram, Reddit, and 13+ other platforms
- **Smart Scheduling**: Schedule posts for optimal engagement times
- **Admin Dashboard**: Manage platform credentials, enable/disable platforms, and manage users
- **Secure Authentication**: OAuth2 and token-based authentication with Supabase Auth
- **Analytics**: Track post performance across platforms

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Deployment**: Netlify (static export)

## Quick Start

### Prerequisites

- Node.js 20+
- Supabase CLI
- Git

### 1. Clone and Setup

```bash
git clone <repo-url>
cd mypost
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy the local environment file from dot-secrets:

```bash
cp .secrets/mypost/local-sample/.env .env.local
```

Or create `.env.local` manually:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Start Supabase Locally

```bash
supabase start
```

### 5. Apply Database Migrations

```bash
supabase db reset
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development with Production Supabase

To test against the live production database (use with caution):

```bash
# Switch to production Supabase
./scripts/switch-env.sh prod

# Or manually copy the production env
cp .secrets/mypost/prod/.env .env.local

# Start dev server
npm run dev
```

**⚠️ Warning**: This connects to LIVE production data. Changes you make will affect the production database.

To switch back to local Supabase:

```bash
./scripts/switch-env.sh local
```

Check current environment:

```bash
./scripts/switch-env.sh status
```

## Admin Setup

1. Sign up for an account at `/login`
2. Make yourself admin in Supabase SQL Editor:
   ```sql
   UPDATE profiles SET is_admin = true WHERE id = 'your-user-id';
   ```
3. Access admin panel at `/admin`
4. Configure platforms at `/admin/platforms` - enable/disable platforms and enter OAuth credentials

## Project Structure

```
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── admin/        # Admin dashboard
│   │   ├── dashboard/    # User dashboard
│   │   ├── login/        # Authentication
│   │   └── api/          # API routes
│   ├── lib/              # Utilities
│   │   ├── supabase.ts   # Supabase clients
│   │   └── database.types.ts
│   └── types/            # TypeScript types
├── supabase/
│   ├── migrations/       # Database migrations
│   └── config.toml
└── .secrets/             # Git submodule with env configs
    └── mypost/
        ├── prod/         # Production configs
        ├── staging/      # Staging configs
        └── local-sample/ # Local dev templates
```

## Deployment

### Production (Netlify)

1. Push to `main` branch
2. GitHub Actions automatically:
   - Pulls dot-secrets submodule
   - Builds Next.js static site
   - Deploys to Netlify

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed setup.

### Environment Configuration

Production environment variables are stored in the `dot-secrets` submodule:

```bash
# Update prod config
cd .secrets
vim mypost/prod/.env
git add . && git commit -m "Update prod config"
git push

# Update main repo reference
cd ..
git add .secrets
git commit -m "Update dot-secrets submodule"
```

## Database Migrations

Create a new migration:

```bash
supabase migration new migration_name
```

Apply migrations locally:

```bash
supabase db reset
```

Push to production:

```bash
supabase db push
```

## Contributing

1. Create a feature branch from `develop`
2. Make your changes
3. Submit a PR to `develop`
4. After merge, staging auto-deploys
5. Create PR from `develop` to `main` for production

## License

MIT
