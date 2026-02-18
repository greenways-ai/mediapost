# Deployment Guide

This document explains how to deploy the Buffer Clone application using GitHub Actions with dot-secrets for environment management.

## Overview

The project uses GitHub Actions for continuous integration and deployment:

1. **CI Workflow** - Runs on every PR and push to main/develop
2. **Staging Deployment** - Auto-deploys when pushing to `develop` branch
3. **Production Deployment** - Deploys when pushing to `main` or creating a tag
4. **Database Migrations** - Manual workflow for running Supabase migrations
5. **Release** - Creates GitHub releases with build artifacts

## Environment Management with dot-secrets

Environment variables and secrets are managed through the `dot-secrets` GitHub repository, included as a submodule at `.secrets/`.

### Directory Structure

```
.secrets/mypost/
├── prod/               # Production environment
├── staging/            # Staging environment
└── local-sample/       # Local development templates
```

### Setting up dot-secrets Access

1. **Generate SSH Key** for GitHub Actions:
   ```bash
   ssh-keygen -t ed25519 -C "github-actions@mypost" -f deploy_key
   ```

2. **Add Deploy Key** to dot-secrets repository:
   - Go to `github.com/greenways-ai/dot-secrets/settings/keys`
   - Add the **public key** (`deploy_key.pub`) with read access

3. **Add Secret** to mypost repository:
   - Go to Settings > Secrets and variables > Actions
   - Create secret `DEPLOY_SSH_KEY` with the **private key** content

## Required GitHub Secrets

Configure these secrets in your GitHub repository (Settings > Secrets and variables > Actions):

### Required for dot-secrets

| Secret | Description | How to Get |
|--------|-------------|------------|
| `DEPLOY_SSH_KEY` | SSH private key for dot-secrets repo access | Generate with `ssh-keygen` |

### Supabase Secrets

| Secret | Description | How to Get |
|--------|-------------|------------|
| `SUPABASE_ACCESS_TOKEN` | Your personal Supabase access token | [Account Settings](https://supabase.com/dashboard/account/tokens) |
| `STAGING_SUPABASE_PROJECT_REF` | Staging project reference | Project Settings > General |
| `PRODUCTION_SUPABASE_PROJECT_REF` | Production project reference | Project Settings > General |

### Netlify Secrets

| Secret | Description | How to Get |
|--------|-------------|------------|
| `NETLIFY_AUTH_TOKEN` | Netlify personal access token | [Applications](https://app.netlify.com/user/applications/personal) |
| `NETLIFY_SITE_ID` | Production site ID | Site Settings > General |
| `NETLIFY_STAGING_SITE_ID` | Staging site ID (optional) | Site Settings > General |

### Alternative: Individual Secrets

If you prefer not to use dot-secrets, you can set individual secrets:

| Secret | Description |
|--------|-------------|
| `PRODUCTION_SUPABASE_URL` | Production Supabase URL |
| `PRODUCTION_SUPABASE_ANON_KEY` | Production Supabase anon key |
| `STAGING_SUPABASE_URL` | Staging Supabase URL |
| `STAGING_SUPABASE_ANON_KEY` | Staging Supabase anon key |

## Updating dot-secrets

To update environment variables in dot-secrets:

1. Navigate to the submodule:
   ```bash
   cd .secrets
   ```

2. Edit the appropriate environment file:
   ```bash
   vim mypost/prod/.env
   ```

3. Commit and push:
   ```bash
   git add .
   git commit -m "Update production env vars"
   git push
   ```

4. Update the submodule reference in main repo:
   ```bash
   cd ..
   git add .secrets
   git commit -m "Update dot-secrets submodule"
   git push
   ```

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
2. **Deploy Frontend** - Builds and deploys to Netlify staging environment
3. **Notify** - Reports deployment status

**Environment Loading:**
- Attempts to load from `.secrets/mypost/staging/.env`
- Falls back to GitHub Secrets if dot-secrets unavailable

### Production Deployment (`deploy-production.yml`)

Can be triggered by:
- Push to `main` branch
- Pushing a tag (e.g., `v1.0.0`)
- Manual trigger with confirmation

**Jobs:**
1. **Verify** - Validates deployment conditions
2. **Deploy Supabase** - Production database migrations
3. **Deploy Frontend** - Production build and Netlify deploy
4. **Create Release** - Creates GitHub release (for tags)
5. **Notify** - Reports deployment status

**Environment Loading:**
- Attempts to load from `.secrets/mypost/prod/.env`
- Falls back to GitHub Secrets if dot-secrets unavailable

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

### dot-secrets Not Found

If the workflow can't access dot-secrets:
1. Verify `DEPLOY_SSH_KEY` is set in GitHub Secrets
2. Check that the deploy key has read access to dot-secrets repo
3. Ensure the submodule is properly initialized: `git submodule update --init`

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

1. Check environment variables (dot-secrets or GitHub Secrets)
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

For Netlify:
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
- Use dot-secrets submodule or GitHub Secrets for all sensitive data
- Protect production environment with required reviewers
- Rotate Supabase access tokens regularly
- Use separate Supabase projects for staging and production
- Limit SSH deploy key access to read-only
- Rotate SSH keys periodically
