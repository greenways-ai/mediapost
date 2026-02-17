import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

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
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })

export const signOut = () => supabase.auth.signOut()

export const getCurrentUser = () => supabase.auth.getUser()

export const getSession = () => supabase.auth.getSession()

// Database helpers
export const getAccounts = () =>
  supabase.from('accounts').select('*').order('platform')

export const updateAccount = (id: string, updates: any) =>
  supabase.from('accounts').update(updates).eq('id', id)

export const getPosts = (status?: string) => {
  let query = supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (status) {
    query = query.eq('status', status)
  }
  
  return query
}

export const createPost = (post: any) =>
  supabase.from('posts').insert(post).select().single()

export const updatePost = (id: string, updates: any) =>
  supabase.from('posts').update(updates).eq('id', id)

export const deletePost = (id: string) =>
  supabase.from('posts').delete().eq('id', id)

// Storage helpers
export const uploadMedia = async (file: File, path: string) => {
  const { data, error } = await supabase.storage
    .from('media')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    })
  
  if (error) throw error
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('media')
    .getPublicUrl(data.path)
  
  return publicUrl
}

export const deleteMedia = (path: string) =>
  supabase.storage.from('media').remove([path])
