import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Admin client that bypasses RLS (requires service_role key)
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations')
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Fallback: use regular client with proper error handling
export async function getUserProfile(supabase: any, userId: string) {
  // Try direct query first
  const { data, error } = await supabase
    .from('profiles')
    .select('is_admin, username')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Profile query error:', error.message)
    return null
  }

  return data
}

export async function upsertProfile(supabase: any, profile: {
  id: string
  username: string
  is_admin?: boolean
}) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      ...profile,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('Profile upsert error:', error.message)
    return null
  }

  return data
}
