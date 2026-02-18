'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';

const supabase = createClientBrowser();

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/posts', label: 'Posts', icon: Calendar },
  { href: '/dashboard/accounts', label: 'Accounts', icon: Share2 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
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

      <div className="max-w-[1400px] mx-auto px-6 pt-24 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <nav className="space-y-1 card p-2">
              {navItems.map((item) => {
                // For Dashboard, only match exact path. For others, match exact or subpaths
                const isActive = item.href === '/dashboard' 
                  ? pathname === '/dashboard'
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-accent/10 text-accent' 
                        : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Quick Stats */}
            <div className="mt-6 card p-4">
              <div className="text-xs uppercase tracking-wider text-text-tertiary mb-3">Quick Stats</div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Plan Status</span>
                  <span className="badge-accent text-xs">Pro</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Posts This Month</span>
                  <span className="text-sm font-medium text-text-primary">47/100</span>
                </div>
              </div>
            </div>

            {/* New Post CTA */}
            <Link
              href="/dashboard/posts/new"
              className="flex items-center gap-3 mt-4 p-4 card bg-accent/5 border-accent/20 hover:bg-accent/10 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <Plus className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-text-primary">Create Post</div>
                <div className="text-xs text-text-secondary">Schedule new content</div>
              </div>
            </Link>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

// Plus icon component
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}
