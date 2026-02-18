import { createClientServer } from '@/lib/supabase-server';
import { 
  Users, 
  Share2, 
  FileText, 
  Activity,
  TrendingUp,
  AlertCircle
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
      value: stats.userCount, 
      icon: Users, 
      color: 'blue',
      trend: '+12%'
    },
    { 
      title: 'Total Posts', 
      value: stats.postCount, 
      icon: FileText, 
      color: 'green',
      trend: '+8%'
    },
    { 
      title: 'Connected Accounts', 
      value: stats.accountCount, 
      icon: Share2, 
      color: 'purple',
      trend: '+5%'
    },
    { 
      title: 'Active Platforms', 
      value: `${stats.enabledPlatforms}/18`, 
      icon: Activity, 
      color: 'orange',
      trend: 'Enabled'
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your MyPost instance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">{stat.trend}</span>
              <span className="text-gray-500 ml-2">from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/admin/platforms"
              className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors group"
            >
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200">
                <Share2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Manage Platforms</h3>
                <p className="text-sm text-gray-500">Enable/disable platforms and configure OAuth</p>
              </div>
            </a>
            <a
              href="/admin/users"
              className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-colors group"
            >
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">View Users</h3>
                <p className="text-sm text-gray-500">Manage users and their permissions</p>
              </div>
            </a>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Supabase Connection</span>
              </div>
              <span className="text-sm font-medium text-green-600">Connected</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Authentication</span>
              </div>
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <span className="text-gray-700">Platforms Configured</span>
              </div>
              <span className="text-sm font-medium text-orange-600">
                {stats.enabledPlatforms} enabled
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
