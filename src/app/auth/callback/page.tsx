'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientBrowser } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClientBrowser();
    
    // Handle the OAuth callback
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        router.push('/dashboard');
      }
    });

    // Exchange the code for a session
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(
        window.location.search
      );
      
      if (error) {
        console.error('Auth callback error:', error);
        router.push('/login?error=auth');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900">Completing sign in...</h2>
        <p className="text-gray-600 mt-2">Please wait while we redirect you.</p>
      </div>
    </div>
  );
}
