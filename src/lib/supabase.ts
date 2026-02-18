import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!

// Client-side Supabase client (for components) - uses cookies for PKCE
export const createClientBrowser = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
  )

// Legacy client for compatibility (client-side only)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Auth helpers
export const signInWithEmail = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password })

export const signUpWithEmail = (email: string, password: string) =>
  supabase.auth.signUp({ email, password })

// OAuth with PKCE - uses the browser client to properly store code verifier in cookies
export const signInWithOAuth = async (provider: 'twitter' | 'github' | 'google' | 'discord') => {
  // Use browser client for OAuth to ensure PKCE code verifier is stored in cookies
  const browserClient = createClientBrowser()
  
  return browserClient.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '/auth/callback',
      // PKCE is enabled by default in @supabase/ssr, but we can be explicit
      skipBrowserRedirect: false,
    }
  })
}

export const signOut = () => supabase.auth.signOut()

export const getCurrentUser = () => supabase.auth.getUser()

export const getSession = () => supabase.auth.getSession()
