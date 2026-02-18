'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClientBrowser } from '@/lib/supabase';
import { 
  Share2, 
  Calendar, 
  BarChart3, 
  Shield,
  ArrowRight,
  CheckCircle,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Github
} from 'lucide-react';

const supabase = createClientBrowser();

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    setLoading(false);
  }

  const features = [
    {
      icon: Share2,
      title: 'Multi-Platform Publishing',
      description: 'Post to Twitter, LinkedIn, Facebook, Instagram, Reddit, and more from one place.'
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Schedule your posts for the optimal time to maximize engagement.'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track performance across all platforms with detailed analytics.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and secure. We never share your information.'
    }
  ];

  const platforms = [
    { icon: Twitter, name: 'Twitter', color: '#000000' },
    { icon: Linkedin, name: 'LinkedIn', color: '#0a66c2' },
    { icon: Facebook, name: 'Facebook', color: '#1877f2' },
    { icon: Instagram, name: 'Instagram', color: '#e4405f' },
    { icon: Github, name: 'GitHub', color: '#181717' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <span className="text-blue-600">My</span>Post
            </Link>

            <nav className="flex items-center gap-6">
              {!loading && user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/admin"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Admin
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/login"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
              Manage all your social media
              <span className="block text-blue-600">in one place</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
              Schedule posts, track analytics, and manage multiple social accounts 
              from a single dashboard. Save time and grow your presence.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
              >
                Start Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/admin/platforms"
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
              >
                Configure Platforms
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Everything you need to manage social media
            </h2>
            <p className="mt-4 text-gray-600">
              Powerful features to help you grow your audience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Platforms */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Connect your favorite platforms
            </h2>
            <p className="mt-4 text-gray-600">
              We support 18+ social media platforms and counting
            </p>
          </div>

          <div className="flex items-center justify-center gap-8 flex-wrap">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full"
              >
                <platform.icon 
                  className="w-5 h-5" 
                  style={{ color: platform.color }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {platform.name}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-12 flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Easy setup
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Secure OAuth
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Auto-refresh tokens
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xl font-bold">
              <span className="text-blue-400">My</span>Post
            </div>
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} MyPost. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
