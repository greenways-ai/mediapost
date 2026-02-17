# Deployment Guide

This document explains how to deploy the Buffer Clone application using GitHub Actions.

## Overview

The project uses GitHub Actions for continuous integration and deployment:

1. **CI Workflow** - Runs on every PR and push to main/develop
2. **Staging Deployment** - Auto-deploys when pushing to `develop` branch
3. **Production Deployment** - Deploys when pushing to `main` or creating a tag
4. **Database Migrations** - Manual workflow for running Supabase migrations
5. **Release** - Creates GitHub releases with build artifacts

## Required Secrets

Configure these secrets in your GitHub repository (Settings > Secrets and variables > Actions):

### Supabase Secrets

| Secret | Description | How to Get |
|--------|-------------|------------|
| `SUPABASE_ACCESS_TOKEN` | Your personal Supabase access token | [Account Settings](https://supabase.com/dashboard/account/tokens) |
| `STAGING_SUPABASE_PROJECT_REF` | Staging project reference | Project Settings > General |
| `STAGING_SUPABASE_URL` | Staging project URL | Project Settings > API |
| `STAGING_SUPABASE_ANON_KEY` | Staging anon/public key | Project Settings > API |
| `PRODUCTION_SUPABASE_PROJECT_REF` | Production project reference | Project Settings > General |
| `PRODUCTION_SUPABASE_URL` | Production project URL | Project Settings > API |
| `PRODUCTION_SUPABASE_ANON_KEY` | Production anon/public key | Project Settings > API |

### Deployment Platform Secrets (Optional)

For Vercel deployment:
- `VERCEL_TOKEN` - Vercel API token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID

For Netlify deployment:
- `NETLIFY_AUTH_TOKEN` - Netlify personal access token
- `NETLIFY_SITE_ID` - Netlify site ID

## Workflows

### CI Workflow (`ci.yml`)

Runs automatically on:
- Push to `main` or `develop`
- Pull requests to `main`

**Jobs:**
1. **Lint and Build** - Runs ESLint and builds the application
2. **Test** - Runs test suite (if configured)
3. **Supabase Checks** - Validates Supabase configuration

### Staging Deployment (`deploy-staging.yml`)

Runs automatically when pushing to `develop` branch.

**Jobs:**
1. **Deploy Supabase** - Pushes database migrations and deploys Edge Functions
2. **Deploy Frontend** - Builds and deploys to staging environment
3. **Notify** - Reports deployment status

### Production Deployment (`deploy-production.yml`)

Can be triggered by:
- Push to `main` branch
- Pushing a tag (e.g., `v1.0.0`)
- Manual trigger with confirmation

**Jobs:**
1. **Verify** - Validates deployment conditions
2. **Deploy Supabase** - Production database migrations
3. **Deploy Frontend** - Production build and deploy
4. **Create Release** - Creates GitHub release (for tags)
5. **Notify** - Reports deployment status

### Database Migrations (`migrate.yml`)

Manual workflow for running database migrations safely.

**Usage:**
1. Go to Actions > Database Migrations
2. Click "Run workflow"
3. Select environment (staging/production)
4. Choose dry run first to preview changes
5. Run again with dry run disabled to apply

### Release (`release.yml`)

Runs when pushing a version tag (e.g., `v1.0.0`).

Creates:
- GitHub Release with changelog
- Build artifacts (.tar.gz and .zip)
- Draft or pre-release based on tag name

## Environment Setup

### Creating Environments

1. Go to Settings > Environments
2. Create `staging` and `production` environments
3. Add protection rules:
   - Required reviewers for production
   - Wait timer (optional)
   - Deployment branches

### Branch Protection

Configure in Settings > Branches:

**Main branch:**
- Require pull request reviews
- Require status checks to pass (CI workflow)
- Require branches to be up to date

**Develop branch:**
- Require status checks to pass

## Deployment Process

### Standard Development Flow

1. Create feature branch from `develop`
   ```bash
   git checkout -b feature/my-feature develop
   ```

2. Make changes and push
   ```bash
   git push origin feature/my-feature
   ```

3. Create PR to `develop`
   - CI runs automatically
   - Review required
   - Merge when approved

4. Staging auto-deploys

5. Test on staging

6. Create PR from `develop` to `main`

7. Merge to deploy to production

### Hotfix Flow

For urgent production fixes:

1. Create hotfix branch from `main`
   ```bash
   git checkout -b hotfix/urgent-fix main
   ```

2. Fix and test locally

3. Create PR to both `main` and `develop`

4. Fast-track review and merge

### Manual Database Migration

1. Go to Actions > Database Migrations
2. Select environment
3. Run with dry run first
4. Review changes
5. Run without dry run to apply

## Troubleshooting

### Deployment Fails

Check:
1. All secrets are configured correctly
2. Supabase project is active
3. Migrations are valid SQL
4. Build passes locally: `npm run build`

### Migration Fails

1. Check migration SQL syntax
2. Ensure no conflicting changes
3. Run `supabase db reset` locally to test
4. Check Supabase logs in dashboard

### Frontend Build Fails

1. Check environment variables
2. Run `npm ci` and `npm run build` locally
3. Check for TypeScript errors
4. Verify all dependencies are installed

## Rollback

### Database Rollback

Currently, Supabase doesn't support automatic down migrations. To rollback:

1. Create a new migration that reverses the changes:
   ```bash
   supabase migration new rollback_changes
   ```

2. Write SQL to undo the previous migration

3. Push the new migration:
   ```bash
   supabase db push
   ```

### Frontend Rollback

For Vercel/Netlify:
1. Go to deployment dashboard
2. Find previous working deployment
3. Click "Promote to production"

## Local Testing

Test workflows locally with [act](https://github.com/nektos/act):

```bash
# Install act
brew install act

# Run CI workflow locally
act push

# Run specific workflow
act workflow_dispatch -W .github/workflows/migrate.yml
```

## Security Considerations

- Never commit secrets to the repository
- Use GitHub Secrets for all sensitive data
- Protect production environment with required reviewers
- Rotate Supabase access tokens regularly
- Use separate Supabase projects for staging and production
