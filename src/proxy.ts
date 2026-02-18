import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  // Create a response to modify
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Set cookies on the response
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  // This ensures the PKCE code verifier cookie is properly handled
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  // Protected routes check
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (authError || !user) {
      console.log('Auth error or no user:', authError?.message)
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    console.log('User authenticated:', user.email, 'ID:', user.id)

    // Check if user is admin - use maybeSingle to avoid errors
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin, username')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError) {
      console.error('Profile query error:', profileError.message)
      console.log('Redirecting to admin-setup due to query error')
      return NextResponse.redirect(new URL('/admin-setup', request.url))
    }

    console.log('Profile query result:', profile)

    if (!profile) {
      console.log('No profile found, creating one...')
      
      // Create profile
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username: user.email?.split('@')[0] || 'user',
          is_admin: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select('is_admin')
        .maybeSingle()
      
      if (createError) {
        console.error('Failed to create profile:', createError.message)
        return NextResponse.redirect(new URL('/admin-setup?error=create_failed', request.url))
      }
      
      console.log('Profile created with is_admin:', newProfile?.is_admin)
      
      if (newProfile?.is_admin) {
        console.log('Admin access granted after profile creation')
        return response
      }
      
      return NextResponse.redirect(new URL('/admin-setup', request.url))
    }

    if (!profile.is_admin) {
      console.log('User is not admin, redirecting to setup:', user.email)
      return NextResponse.redirect(new URL('/admin-setup', request.url))
    }
    
    console.log('Admin access granted:', user.email)
  }

  // Auth callback route - ensure cookies are properly set
  if (request.nextUrl.pathname === '/auth/callback') {
    // The response will contain the cookies set by Supabase
    // Ensure they are forwarded properly
    return response
  }

  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/auth/callback',
  ],
}
