import { createClientServer } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClientServer()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const { email } = await request.json()
    const targetEmail = email || user.email
    
    // Get current user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .maybeSingle() // Use maybeSingle instead of single to avoid errors
    
    console.log('Current user profile:', profile, 'Error:', profileError?.message)
    
    // If not admin and trying to make someone else admin, deny
    if (!profile?.is_admin && targetEmail !== user.email) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      )
    }
    
    // Update or insert profile
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        username: user.email?.split('@')[0] || 'user',
        is_admin: true,
        updated_at: new Date().toISOString(),
      }, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })
    
    if (upsertError) {
      console.error('Upsert error:', upsertError)
      return NextResponse.json(
        { error: 'Failed to update profile: ' + upsertError.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'You are now an admin!',
      userId: user.id 
    })
    
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
