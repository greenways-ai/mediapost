import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!

// Client-side Supabase client (for components)
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

export const signInWithOAuth = (provider: 'twitter' | 'github' | 'google' | 'discord') =>
  supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '/auth/callback'
    }
  })

export const signOut = () => supabase.auth.signOut()

export const getCurrentUser = () => supabase.auth.getUser()

export const getSession = () => supabase.auth.getSession()
