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
  ChevronRight,
  TrendingUp,
  Users,
  BarChart3
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/posts', label: 'Posts', icon: Calendar },
    { href: '/dashboard/accounts', label: 'Accounts', icon: Share2 },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  const stats = [
    { label: 'Total Posts', value: '24', change: '+12%', icon: BarChart3 },
    { label: 'Engagement', value: '8.5K', change: '+24%', icon: TrendingUp },
    { label: 'Followers', value: '1.2K', change: '+8%', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />

          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Admin
            </Link>
            <ThemeToggle />
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-6 pt-24 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <nav className="space-y-1 card p-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-text-secondary rounded-lg hover:bg-surface-hover hover:text-text-primary transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Mini Stats */}
            <div className="mt-6 card p-4">
              <div className="text-xs uppercase tracking-wider text-text-tertiary mb-3">Quick Stats</div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Uptime</span>
                  <span className="text-sm font-bold text-accent">99.9%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Status</span>
                  <span className="badge-accent text-xs">Active</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-6">
            {/* Welcome */}
            <div>
              <h1 className="text-2xl font-display font-bold text-text-primary">
                Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
              </h1>
              <p className="text-text-secondary mt-1">
                Manage your social media posts and accounts
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <stat.icon className="w-5 h-5 text-accent" />
                    </div>
                    <span className="stat-delta-positive text-sm">{stat.change}</span>
                  </div>
                  <div className="stat-value text-2xl">{stat.value}</div>
                  <div className="stat-label mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/dashboard/posts/new"
                className="flex items-center gap-4 p-5 card hover:border-accent/50 hover:shadow-glow transition-all group"
              >
                <div className="p-3 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                  <Plus className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Create New Post</h3>
                  <p className="text-sm text-text-secondary">Schedule a post to multiple platforms</p>
                </div>
                <ChevronRight className="w-5 h-5 text-text-tertiary ml-auto group-hover:text-accent transition-colors" />
              </Link>

              <Link
                href="/dashboard/accounts"
                className="flex items-center gap-4 p-5 card hover:border-accent/50 transition-all group"
              >
                <div className="p-3 rounded-lg bg-info/10 group-hover:bg-info/20 transition-colors">
                  <Share2 className="w-6 h-6 text-info" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Connect Accounts</h3>
                  <p className="text-sm text-text-secondary">Link your social media accounts</p>
                </div>
                <ChevronRight className="w-5 h-5 text-text-tertiary ml-auto group-hover:text-info transition-colors" />
              </Link>
            </div>

            {/* Recent Activity */}
            <div className="card p-6">
              <h2 className="text-lg font-display font-semibold text-text-primary mb-4">Recent Activity</h2>
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-surface-sunken flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-text-tertiary" />
                </div>
                <p className="text-text-secondary">No recent activity</p>
                <p className="text-sm text-text-tertiary mt-1">Your scheduled posts will appear here</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
