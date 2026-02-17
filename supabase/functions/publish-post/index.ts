import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { postId } = await req.json()

    // Get post details
    const { data: post, error: postError } = await supabaseClient
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single()

    if (postError || !post) {
      throw new Error('Post not found')
    }

    // Get user's connected accounts for the platforms
    const { data: accounts, error: accountsError } = await supabaseClient
      .from('accounts')
      .select('*')
      .eq('user_id', post.user_id)
      .in('platform', post.platforms)
      .eq('is_connected', true)

    if (accountsError) {
      throw new Error('Failed to fetch accounts')
    }

    const externalIds: Record<string, any> = {}
    const errors: string[] = []

    // Publish to each platform
    for (const account of accounts || []) {
      try {
        const result = await publishToPlatform(account, post)
        externalIds[account.platform] = result
      } catch (err) {
        errors.push(`${account.platform}: ${err.message}`)
      }
    }

    // Update post status
    const status = errors.length === accounts?.length ? 'failed' : 
                   errors.length > 0 ? 'published' : 'published'

    await supabaseClient
      .from('posts')
      .update({
        status,
        external_ids: externalIds,
        error_message: errors.length > 0 ? errors.join(', ') : null,
        published_at: status === 'published' ? new Date().toISOString() : null
      })
      .eq('id', postId)

    return new Response(
      JSON.stringify({ success: true, externalIds, errors }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

async function publishToPlatform(account: any, post: any) {
  // This is a placeholder - each platform would have its own implementation
  // In production, you'd import platform-specific modules here
  
  switch (account.platform) {
    case 'twitter':
      // Twitter API implementation
      return { id: 'twitter_post_id' }
    
    case 'bluesky':
      // Bluesky API implementation
      return { uri: 'at://...' }
    
    case 'mastodon':
      // Mastodon API implementation
      return { id: 'mastodon_post_id' }
    
    case 'telegram':
      // Telegram Bot API implementation
      return { message_id: 12345 }
    
    case 'github':
      // GitHub gist or issue creation
      return { id: 'gist_id' }
    
    default:
      throw new Error(`Platform ${account.platform} not yet implemented in Edge Function`)
  }
}
