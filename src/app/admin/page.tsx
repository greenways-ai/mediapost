import { createClientServer } from '@/lib/supabase-server';
import { 
  Users, 
  Share2, 
  FileText, 
  Activity,
  TrendingUp,
  AlertCircle,
  Zap
} from 'lucide-react';

async function getStats() {
  const supabase = await createClientServer();
  
  const [
    { count: userCount },
    { count: postCount },
    { count: accountCount },
    { data: enabledPlatforms }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('accounts').select('*', { count: 'exact', head: true }),
    supabase.from('platform_settings').select('*').eq('is_enabled', true)
  ]);

  return {
    userCount: userCount || 0,
    postCount: postCount || 0,
    accountCount: accountCount || 0,
    enabledPlatforms: enabledPlatforms?.length || 0
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    { 
      title: 'Total Users', 
      value: stats.userCount.toLocaleString(), 
      icon: Users, 
      trend: '+12%',
      color: 'accent'
    },
    { 
      title: 'Total Posts', 
      value: stats.postCount.toLocaleString(), 
      icon: FileText, 
      trend: '+8%',
      color: 'info'
    },
    { 
      title: 'Connected Accounts', 
      value: stats.accountCount.toLocaleString(), 
      icon: Share2, 
      trend: '+5%',
      color: 'warning'
    },
    { 
      title: 'Active Platforms', 
      value: `${stats.enabledPlatforms}/18`, 
      icon: Activity, 
      trend: 'Enabled',
      color: 'alert'
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary mt-1">Overview of your Statstrade instance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="card p-6 hover:border-accent/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">{stat.title}</p>
                <p className="text-3xl font-display font-bold text-text-primary mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}/10`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}`} style={{ color: `var(--${stat.color})` }} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-accent mr-1" />
              <span className="text-accent font-medium">{stat.trend}</span>
              <span className="text-text-tertiary ml-2">from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-display font-semibold text-text-primary mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/admin/platforms"
              className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-colors group"
            >
              <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20">
                <Share2 className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-medium text-text-primary">Manage Platforms</h3>
                <p className="text-sm text-text-secondary">Enable/disable platforms and configure OAuth</p>
              </div>
            </a>
            <a
              href="/admin/users"
              className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-info hover:bg-info/5 transition-colors group"
            >
              <div className="p-2 bg-info/10 rounded-lg group-hover:bg-info/20">
                <Users className="w-5 h-5 text-info" />
              </div>
              <div>
                <h3 className="font-medium text-text-primary">View Users</h3>
                <p className="text-sm text-text-secondary">Manage users and their permissions</p>
              </div>
            </a>
          </div>
        </div>

        {/* System Status */}
        <div className="card p-6">
          <h2 className="text-lg font-display font-semibold text-text-primary mb-4">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-divider">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span className="text-text-secondary">Supabase Connection</span>
              </div>
              <span className="text-sm font-medium text-accent">Connected</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-divider">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span className="text-text-secondary">Authentication</span>
              </div>
              <span className="text-sm font-medium text-accent">Active</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-warning" />
                <span className="text-text-secondary">Platforms Configured</span>
              </div>
              <span className="text-sm font-medium text-warning">
                {stats.enabledPlatforms} enabled
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
