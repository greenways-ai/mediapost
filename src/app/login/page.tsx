'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClientBrowser } from '@/lib/supabase';
import { Mail, Lock, Loader2, Github, Twitter } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';

const supabase = createClientBrowser();

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleOAuth(provider: 'github' | 'twitter' | 'google') {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setError(error.message);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center pt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold text-text-primary">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="mt-2 text-text-secondary">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-accent hover:text-accent-light font-medium transition-colors"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>

          <div className="card-elevated py-8 px-6">
            {error && (
              <div className="mb-4 p-3 bg-alert/10 text-alert rounded-lg text-sm border border-alert/20">
                {error}
              </div>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 block w-full rounded-lg border border-border bg-surface-sunken px-3 py-2.5 text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 block w-full rounded-lg border border-border bg-surface-sunken px-3 py-2.5 text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-surface-elevated text-text-tertiary">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleOAuth('github')}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 border border-border rounded-lg text-sm font-medium text-text-secondary bg-surface hover:bg-surface-hover transition-colors"
                >
                  <Github className="w-5 h-5" />
                  GitHub
                </button>
                <button
                  onClick={() => handleOAuth('twitter')}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 border border-border rounded-lg text-sm font-medium text-text-secondary bg-surface hover:bg-surface-hover transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                  Twitter
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-text-tertiary">
            By signing in, you agree to our{' '}
            <Link href="#" className="text-accent hover:text-accent-light transition-colors">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" className="text-accent hover:text-accent-light transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
