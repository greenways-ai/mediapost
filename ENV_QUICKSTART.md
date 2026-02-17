# Environment Quick Start

Minimal setup to get running quickly.

## Phase 1: Local Development (5 minutes)

### 1. Install Supabase CLI
```bash
npm install -g supabase
supabase login
```

### 2. Start Local Supabase
```bash
supabase start
```

### 3. Copy credentials to .env
Copy these from the `supabase start` output:
```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=<anon_key_from_output>
```

### 4. Start the app
```bash
npm run dev
```

✅ **Local development is ready!**

---

## Phase 2: Staging (15 minutes)

### 1. Create Staging Project
- Go to [supabase.com](https://supabase.com)
- Click "New Project"
- Name it: `your-app-staging`
- Note the project URL and anon key

### 2. Add to GitHub Secrets
Go to Settings > Secrets and variables > Actions:

```
STAGING_SUPABASE_PROJECT_REF=your_project_ref
STAGING_SUPABASE_URL=https://your_project.supabase.co
STAGING_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_ACCESS_TOKEN=your_personal_token
```

### 3. Push to develop branch
```bash
git checkout -b develop
git push origin develop
```

✅ **Staging auto-deploys!**

---

## Phase 3: Production (15 minutes)

### 1. Create Production Project
- Create another Supabase project: `your-app-production`
- Note credentials

### 2. Add to GitHub Secrets
```
PRODUCTION_SUPABASE_PROJECT_REF=your_project_ref
PRODUCTION_SUPABASE_URL=https://your_project.supabase.co
PRODUCTION_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Set up environments
Go to Settings > Environments:
- Create `staging` environment
- Create `production` environment (add required reviewers)

### 4. Protect main branch
Go to Settings > Branches:
- Protect `main`: require PR reviews, require status checks
- Protect `develop`: require status checks

### 5. Deploy to production
```bash
git checkout main
git merge develop
git push origin main
```

✅ **Production is live!**

---

## Phase 4: Social Platforms (Optional, per platform)

For each platform you want to support:

1. **Get credentials** from developer portal
2. **Add to Supabase Auth** (Dashboard > Authentication > Providers)
3. **Add to Edge Functions secrets** (if posting via backend)
4. **Test connection** in the app

Priority order:
1. GitHub (easiest OAuth)
2. Twitter
3. Discord
4. Others as needed

---

## One-Command Summary

```bash
# 1. Install
npm install -g supabase
supabase login

# 2. Start local
supabase start

# 3. Copy .env
cp .env.example .env
# Edit .env with values from `supabase start`

# 4. Run app
npm run dev

# 5. Push to deploy
git push origin develop  # Staging
git push origin main     # Production
```

---

## Files to Configure

| File | Purpose | Priority |
|------|---------|----------|
| `.env` | Local development | Required |
| GitHub Secrets | CI/CD deployment | Required |
| Supabase Dashboard Auth | OAuth providers | Medium |
| Supabase Edge Secrets | Platform API keys | Low |

---

## Quick Checks

### Verify Local Setup
```bash
curl http://localhost:54321/health
# Should return {"status":"ok"}
```

### Verify GitHub Actions
1. Go to Actions tab
2. Check "CI" workflow passed
3. Push to develop, check "Deploy Staging" runs

### Verify Supabase
```bash
supabase status
# Should show all services running
```

---

## Need Help?

- **Full checklist**: See `ENV_SETUP_CHECKLIST.md`
- **Deployment guide**: See `DEPLOYMENT.md`
- **Supabase docs**: https://supabase.com/docs
- **GitHub Actions docs**: https://docs.github.com/en/actions
