# PKCE Code Verifier Fix

## Problem
The error `AuthPKCECodeVerifierMissingError` occurs when the OAuth flow cannot find the PKCE code verifier in storage. This typically happens with SSR frameworks like Next.js.

## Solution Applied

### 1. Updated `createClientBrowser` to use `@supabase/ssr`
The browser client now uses `@supabase/ssr`'s `createBrowserClient` which properly stores the PKCE code verifier in cookies.

### 2. Fixed OAuth Sign-In
The `signInWithOAuth` function now uses the browser client explicitly:
```typescript
export const signInWithOAuth = async (provider: 'twitter' | 'github' | 'google' | 'discord') => {
  const browserClient = createClientBrowser()
  return browserClient.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    }
  })
}
```

### 3. Fixed Auth Callback Page
The callback page now:
- Extracts the `code` parameter directly from the URL
- Calls `exchangeCodeForSession(code)` with just the code (not the full search string)
- Uses the browser client which has access to the PKCE code verifier in cookies

### 4. Updated Proxy
The proxy now includes `/auth/callback` in its matcher to ensure cookies are properly handled.

## Important: Supabase Configuration

Ensure your Supabase project has the correct redirect URI configured:

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your site URL: `https://yourdomain.com`
3. Add redirect URLs:
   - `https://yourdomain.com/auth/callback`
   - `http://localhost:3000/auth/callback` (for local dev)

## Platform-Specific OAuth Settings

When configuring OAuth providers in `/admin/platforms`, ensure:

1. **Redirect URI** matches exactly what's in Supabase
2. **PKCE** is enabled (if the platform supports it)
3. **Client ID** and **Client Secret** are correct

## Testing OAuth Flow

1. Go to `/login`
2. Click an OAuth provider (GitHub, Twitter, etc.)
3. You should be redirected to the provider
4. After authorization, you should return to `/auth/callback`
5. Then be redirected to `/dashboard`

## Troubleshooting

If you still see the PKCE error:

1. **Clear cookies** for your domain
2. **Try incognito mode** to rule out browser extensions
3. **Check Supabase logs** in the Dashboard
4. **Verify the redirect URI** matches exactly in both Supabase and the OAuth provider

## References

- [Supabase SSR Documentation](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [PKCE Flow Explanation](https://supabase.com/docs/guides/auth/server-side/pkce)
