'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClientBrowser } from '@/lib/supabase';
import { 
  Plus, 
  Calendar, 
  Share2, 
  Settings,
  LogOut,
  LayoutDashboard,
  ChevronRight
} from 'lucide-react';

const supabase = createClientBrowser();

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setUser(user);
    setLoading(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/posts', label: 'Posts', icon: Calendar },
    { href: '/dashboard/accounts', label: 'Accounts', icon: Share2 },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <span className="text-blue-600">My</span>Post
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Admin
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-white hover:text-gray-900 transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back!
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your social media posts and accounts
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Link
                href="/dashboard/posts/new"
                className="flex items-center gap-4 p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-blue-500 hover:shadow-md transition-all group"
              >
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200">
                  <Plus className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Create New Post</h3>
                  <p className="text-sm text-gray-500">Schedule a post to multiple platforms</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
              </Link>

              <Link
                href="/dashboard/accounts"
                className="flex items-center gap-4 p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-green-500 hover:shadow-md transition-all group"
              >
                <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200">
                  <Share2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Connect Accounts</h3>
                  <p className="text-sm text-gray-500">Link your social media accounts</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
              </Link>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No recent activity</p>
                <p className="text-sm mt-1">Your scheduled posts will appear here</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
