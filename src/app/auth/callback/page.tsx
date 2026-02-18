'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientBrowser } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClientBrowser();
    
    const handleAuthCallback = async () => {
      try {
        // Get the code from the URL
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        
        if (!code) {
          console.error('No code found in URL');
          router.push('/login?error=no_code');
          return;
        }

        // Exchange the code for a session
        // The PKCE code verifier is automatically handled by the Supabase client
        // when using @supabase/ssr with proper cookie configuration
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (error) {
          console.error('Auth callback error:', error);
          router.push('/login?error=auth&details=' + encodeURIComponent(error.message));
          return;
        }

        if (data.session) {
          // Successfully signed in
          router.push('/dashboard');
        } else {
          console.error('No session returned');
          router.push('/login?error=no_session');
        }
      } catch (err) {
        console.error('Unexpected error during auth callback:', err);
        router.push('/login?error=unknown');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-2 border-accent border-t-transparent animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-display font-semibold text-text-primary">Completing sign in...</h2>
        <p className="text-text-secondary mt-2">Please wait while we redirect you.</p>
      </div>
    </div>
  );
}
