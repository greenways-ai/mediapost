# Supabase Setup Guide

This Buffer Clone now uses Supabase for backend services including PostgreSQL database, authentication, and storage.

## Quick Start

### 1. Install Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# Windows (with scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Or use npm
npm install -g supabase
```

### 2. Login to Supabase

```bash
supabase login
```

### 3. Start Local Supabase

```bash
supabase start
```

This will start:
- PostgreSQL database on port 54322
- Supabase Studio (UI) on port 54323
- Supabase Auth on port 54321
- Supabase Storage
- Inbucket (email testing) on port 54324

### 4. Run Migrations

```bash
supabase db reset
```

This applies all migrations in `supabase/migrations/`.

### 5. Update Environment Variables

Copy the local Supabase credentials from `supabase start` output to your `.env` file:

```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=<anon_key_from_output>
```

### 6. Start the Frontend

```bash
npm run dev
```

## Project Structure

```
supabase/
├── config.toml              # Supabase configuration
├── migrations/              # Database migrations
│   └── 001_initial_schema.sql
└── functions/               # Edge Functions
    └── publish-post/
        └── index.ts
```

## Database Schema

### Tables

- **profiles** - User profile information
- **accounts** - Connected social media accounts
- **posts** - Scheduled and published posts
- **post_analytics** - Post performance metrics

### Row Level Security (RLS)

All tables have RLS enabled. Users can only:
- View and manage their own profile
- View and manage their own accounts
- View and manage their own posts
- View analytics for their own posts

## Authentication

Supabase Auth supports:
- Email/password
- OAuth providers (Twitter, GitHub, Google, Discord)

When a new user signs up, the database trigger automatically creates:
- A profile entry
- 18 default social media account entries (all disconnected)

## Storage

Media uploads are stored in the `media` bucket.

## Edge Functions

### publish-post

Publishes a post to connected social media platforms.

Deploy with:
```bash
supabase functions deploy publish-post
```

## Connecting to Production

1. Create a project on [Supabase Dashboard](https://app.supabase.com)
2. Get your project URL and anon key
3. Update `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```
4. Run migrations on production:
```bash
supabase db push
```

## OAuth Provider Setup

In your Supabase Dashboard, go to Authentication > Providers and configure:

- Twitter: developer.twitter.com
- GitHub: github.com/settings/developers
- Google: console.cloud.google.com
- Discord: discord.com/developers/applications

## Secrets Management

For production, store API credentials in Supabase Secrets:

```bash
supabase secrets set TWITTER_CLIENT_ID=xxx
supabase secrets set TWITTER_CLIENT_SECRET=xxx
# etc...
```

Access in Edge Functions via `Deno.env.get('TWITTER_CLIENT_ID')`.

## Useful Commands

```bash
# Start local Supabase
supabase start

# Stop local Supabase
supabase stop

# Reset database (apply migrations fresh)
supabase db reset

# Create new migration
supabase migration new migration_name

# Deploy to production
supabase link --project-ref your-project-ref
supabase db push

# Deploy Edge Functions
supabase functions deploy

# View logs
supabase functions logs function-name
```
