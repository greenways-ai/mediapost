export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      accounts: {
        Row: {
          access_token: string | null
          avatar_url: string | null
          created_at: string | null
          handle: string | null
          id: string
          is_active: boolean | null
          is_connected: boolean | null
          metadata: Json | null
          name: string
          platform: string
          platform_user_id: string | null
          refresh_token: string | null
          token_expires_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          avatar_url?: string | null
          created_at?: string | null
          handle?: string | null
          id?: string
          is_active?: boolean | null
          is_connected?: boolean | null
          metadata?: Json | null
          name: string
          platform: string
          platform_user_id?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          avatar_url?: string | null
          created_at?: string | null
          handle?: string | null
          id?: string
          is_active?: boolean | null
          is_connected?: boolean | null
          metadata?: Json | null
          name?: string
          platform?: string
          platform_user_id?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          additional_config: Json | null
          auth_url: string | null
          client_id: string | null
          client_secret: string | null
          created_at: string | null
          id: string
          is_enabled: boolean | null
          name: string
          platform: string
          redirect_uri: string | null
          scope: string | null
          token_url: string | null
          updated_at: string | null
        }
        Insert: {
          additional_config?: Json | null
          auth_url?: string | null
          client_id?: string | null
          client_secret?: string | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          name: string
          platform: string
          redirect_uri?: string | null
          scope?: string | null
          token_url?: string | null
          updated_at?: string | null
        }
        Update: {
          additional_config?: Json | null
          auth_url?: string | null
          client_id?: string | null
          client_secret?: string | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          name?: string
          platform?: string
          redirect_uri?: string | null
          scope?: string | null
          token_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      post_analytics: {
        Row: {
          clicks: number | null
          engagements: number | null
          id: string
          impressions: number | null
          platform: string
          post_id: string
          updated_at: string | null
        }
        Insert: {
          clicks?: number | null
          engagements?: number | null
          id?: string
          impressions?: number | null
          platform: string
          post_id: string
          updated_at?: string | null
        }
        Update: {
          clicks?: number | null
          engagements?: number | null
          id?: string
          impressions?: number | null
          platform?: string
          post_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_analytics_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string
          created_at: string | null
          error_message: string | null
          external_ids: Json | null
          id: string
          media_urls: string[] | null
          platforms: string[]
          published_at: string | null
          scheduled_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          error_message?: string | null
          external_ids?: Json | null
          id?: string
          media_urls?: string[] | null
          platforms: string[]
          published_at?: string | null
          scheduled_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          error_message?: string | null
          external_ids?: Json | null
          id?: string
          media_urls?: string[] | null
          platforms?: string[]
          published_at?: string | null
          scheduled_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          is_admin: boolean | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
