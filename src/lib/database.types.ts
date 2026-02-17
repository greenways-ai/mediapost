export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      accounts: {
        Row: {
          id: string
          user_id: string
          platform: string
          name: string
          handle: string | null
          avatar_url: string | null
          is_active: boolean
          is_connected: boolean
          access_token: string | null
          refresh_token: string | null
          token_expires_at: string | null
          platform_user_id: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform: string
          name: string
          handle?: string | null
          avatar_url?: string | null
          is_active?: boolean
          is_connected?: boolean
          access_token?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          platform_user_id?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          platform?: string
          name?: string
          handle?: string | null
          avatar_url?: string | null
          is_active?: boolean
          is_connected?: boolean
          access_token?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          platform_user_id?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          content: string
          platforms: string[]
          media_urls: string[]
          scheduled_at: string | null
          status: 'draft' | 'scheduled' | 'published' | 'failed'
          external_ids: Json
          error_message: string | null
          created_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          platforms: string[]
          media_urls?: string[]
          scheduled_at?: string | null
          status?: 'draft' | 'scheduled' | 'published' | 'failed'
          external_ids?: Json
          error_message?: string | null
          created_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          platforms?: string[]
          media_urls?: string[]
          scheduled_at?: string | null
          status?: 'draft' | 'scheduled' | 'published' | 'failed'
          external_ids?: Json
          error_message?: string | null
          created_at?: string
          published_at?: string | null
        }
      }
      post_analytics: {
        Row: {
          id: string
          post_id: string
          platform: string
          impressions: number
          engagements: number
          clicks: number
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          platform: string
          impressions?: number
          engagements?: number
          clicks?: number
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          platform?: string
          impressions?: number
          engagements?: number
          clicks?: number
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
