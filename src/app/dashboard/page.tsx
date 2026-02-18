'use client';

import Link from 'next/link';
import { 
  Plus, 
  Calendar, 
  Share2, 
  TrendingUp,
  Users,
  BarChart3,
  Clock,
  Instagram,
  Twitter,
  Linkedin,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';

const stats = [
  { label: 'Scheduled Posts', value: '12', change: '+3', icon: Calendar },
  { label: 'Engagement Rate', value: '8.5%', change: '+1.2%', icon: TrendingUp },
  { label: 'Total Reach', value: '24.8K', change: '+18%', icon: Users },
];

const connectedAccounts = [
  { platform: 'Instagram', handle: '@yourbrand', icon: Instagram, status: 'connected', color: '#E4405F' },
  { platform: 'Twitter', handle: '@yourhandle', icon: Twitter, status: 'connected', color: '#1DA1F2' },
  { platform: 'LinkedIn', handle: 'Your Company', icon: Linkedin, status: 'connected', color: '#0A66C2' },
];

const upcomingPosts = [
  { 
    id: 1, 
    content: 'Excited to share our latest product update! 🚀', 
    platform: 'Instagram', 
    scheduled: 'Today, 2:00 PM',
    status: 'scheduled'
  },
  { 
    id: 2, 
    content: 'Thread: 5 tips for better social media management...', 
    platform: 'Twitter', 
    scheduled: 'Tomorrow, 9:00 AM',
    status: 'scheduled'
  },
  { 
    id: 3, 
    content: 'Join us for our webinar next week!', 
    platform: 'LinkedIn', 
    scheduled: 'Oct 24, 11:00 AM',
    status: 'draft'
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">
            Dashboard
          </h1>
          <p className="text-text-secondary mt-1">
            Here's what's happening with your social media
          </p>
        </div>
        <Link href="/dashboard/posts/new" className="btn-primary">
          <Plus className="w-4 h-4" />
          Create Post
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <stat.icon className="w-5 h-5 text-accent" />
              </div>
              <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">{stat.change}</span>
            </div>
            <div className="text-2xl font-display font-bold text-text-primary">{stat.value}</div>
            <div className="text-sm text-text-secondary mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Posts */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-text-primary">Upcoming Posts</h2>
            <Link href="/dashboard/posts" className="text-sm text-accent hover:text-accent-light transition-colors">
              View all
            </Link>
          </div>
          
          <div className="space-y-3">
            {upcomingPosts.map((post) => (
              <div key={post.id} className="flex items-start gap-4 p-4 rounded-lg bg-surface-sunken hover:bg-surface-hover transition-colors group">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  post.platform === 'Instagram' ? 'bg-[#E4405F]/10' :
                  post.platform === 'Twitter' ? 'bg-[#1DA1F2]/10' :
                  'bg-[#0A66C2]/10'
                }`}>
                  {post.platform === 'Instagram' && <Instagram className="w-5 h-5" style={{ color: '#E4405F' }} />}
                  {post.platform === 'Twitter' && <Twitter className="w-5 h-5" style={{ color: '#1DA1F2' }} />}
                  {post.platform === 'LinkedIn' && <Linkedin className="w-5 h-5" style={{ color: '#0A66C2' }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary text-sm line-clamp-2">{post.content}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-xs text-text-tertiary">
                      <Clock className="w-3 h-3" />
                      {post.scheduled}
                    </span>
                    {post.status === 'draft' && (
                      <span className="text-xs px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded-full">Draft</span>
                    )}
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-5 h-5 text-text-tertiary" />
                </button>
              </div>
            ))}
          </div>

          <Link 
            href="/dashboard/posts/new"
            className="flex items-center justify-center gap-2 w-full mt-4 py-2.5 border border-dashed border-border rounded-lg text-sm text-text-secondary hover:border-accent hover:text-accent transition-colors"
          >
            <Plus className="w-4 h-4" />
            Schedule New Post
          </Link>
        </div>

        {/* Connected Accounts */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-text-primary">Connected Accounts</h2>
            <Link href="/dashboard/accounts" className="text-sm text-accent hover:text-accent-light transition-colors">
              Manage
            </Link>
          </div>

          <div className="space-y-3">
            {connectedAccounts.map((account) => (
              <div key={account.platform} className="flex items-center gap-3 p-3 rounded-lg bg-surface-sunken">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${account.color}15` }}
                >
                  <account.icon className="w-5 h-5" style={{ color: account.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-primary">{account.platform}</div>
                  <div className="text-xs text-text-tertiary truncate">{account.handle}</div>
                </div>
                <div className="w-2 h-2 rounded-full bg-accent" />
              </div>
            ))}
          </div>

          <Link 
            href="/dashboard/accounts"
            className="flex items-center justify-center gap-2 w-full mt-4 py-2.5 border border-dashed border-border rounded-lg text-sm text-text-secondary hover:border-accent hover:text-accent transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Connect Account
          </Link>
        </div>
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
    </div>
  );
}
