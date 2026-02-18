'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Calendar, 
  Clock, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Facebook, 
  MoreHorizontal,
  Search,
  CheckCircle2,
  Clock4,
  Edit3,
  Trash2,
  Copy
} from 'lucide-react';

// Mock data for posts
const mockPosts = [
  {
    id: 1,
    content: 'Excited to share our latest product update! 🚀 We\'ve been working hard on new features that will help you manage your social media more efficiently. Check out the thread below for all the details! 👇',
    platforms: ['twitter', 'linkedin'],
    status: 'scheduled',
    scheduledDate: '2026-02-20',
    scheduledTime: '09:00',
    engagement: null,
  },
  {
    id: 2,
    content: 'Behind the scenes at our team retreat! 🌟 Building great products requires a great team. Here\'s a glimpse of what we\'ve been up to. #TeamWork #CompanyCulture',
    platforms: ['instagram'],
    status: 'scheduled',
    scheduledDate: '2026-02-19',
    scheduledTime: '14:30',
    engagement: null,
  },
  {
    id: 3,
    content: '5 tips for better social media management:\n\n1. Plan your content in advance\n2. Use analytics to understand your audience\n3. Engage with your community\n4. Post consistently\n5. Use the right tools\n\nWhat\'s your #1 tip?',
    platforms: ['twitter', 'linkedin', 'facebook'],
    status: 'published',
    scheduledDate: '2026-02-15',
    scheduledTime: '10:00',
    engagement: { likes: 245, comments: 32, shares: 18 },
  },
  {
    id: 4,
    content: 'New blog post is live! 📝 We dive deep into the future of social media marketing and how AI is changing the game. Link in bio! #SocialMedia #Marketing #AI',
    platforms: ['instagram', 'facebook'],
    status: 'published',
    scheduledDate: '2026-02-12',
    scheduledTime: '11:00',
    engagement: { likes: 189, comments: 24, shares: 12 },
  },
  {
    id: 5,
    content: 'Join us for our webinar next week! We\'ll be discussing social media strategies for 2026. Register now - spots are limited! 🎟️',
    platforms: ['linkedin', 'twitter'],
    status: 'draft',
    scheduledDate: null,
    scheduledTime: null,
    engagement: null,
  },
  {
    id: 6,
    content: 'Thank you to all our amazing customers! Your feedback drives our product development. Here\'s what\'s coming next... 🎉',
    platforms: ['twitter', 'linkedin', 'facebook', 'instagram'],
    status: 'scheduled',
    scheduledDate: '2026-02-22',
    scheduledTime: '16:00',
    engagement: null,
  },
];

const platformIcons: Record<string, any> = {
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  facebook: Facebook,
};

const platformColors: Record<string, string> = {
  instagram: '#E4405F',
  twitter: '#1DA1F2',
  linkedin: '#0A66C2',
  facebook: '#1877F2',
};

const statusConfig = {
  scheduled: { label: 'Scheduled', icon: Clock4, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
  published: { label: 'Published', icon: CheckCircle2, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  draft: { label: 'Draft', icon: Edit3, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
};

export default function PostsPage() {
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'published' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = mockPosts.filter(post => {
    const matchesFilter = filter === 'all' || post.status === filter;
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">Posts</h1>
          <p className="text-text-secondary mt-1">Manage your scheduled and published content</p>
        </div>
        <Link href="/dashboard/posts/new" className="btn-primary">
          <Plus className="w-4 h-4" />
          Create Post
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {(['all', 'scheduled', 'published', 'draft'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                filter === f
                  ? 'bg-accent text-white'
                  : 'bg-surface text-text-secondary hover:bg-surface-hover'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        
        <div className="flex-1 sm:max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-accent/50 focus:border-accent"
            />
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div key={post.id} className="card p-5 hover:border-accent/30 transition-all group">
            <div className="flex items-start gap-4">
              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-text-primary line-clamp-3 mb-3">{post.content}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  {/* Platforms */}
                  <div className="flex items-center gap-1.5">
                    {post.platforms.map((platform) => {
                      const Icon = platformIcons[platform];
                      return (
                        <div
                          key={platform}
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${platformColors[platform]}15` }}
                          title={platform}
                        >
                          <Icon className="w-4 h-4" style={{ color: platformColors[platform] }} />
                        </div>
                      );
                    })}
                  </div>

                  {/* Divider */}
                  <div className="w-px h-4 bg-border hidden sm:block" />

                  {/* Status */}
                  {getStatusBadge(post.status)}

                  {/* Schedule Info */}
                  {post.scheduledDate && (
                    <div className="flex items-center gap-1.5 text-text-secondary">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      <Clock className="w-4 h-4 ml-2" />
                      <span>{post.scheduledTime}</span>
                    </div>
                  )}

                  {/* Engagement (if published) */}
                  {post.engagement && (
                    <div className="flex items-center gap-3 text-text-secondary">
                      <span className="flex items-center gap-1">
                        ❤️ {post.engagement.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        💬 {post.engagement.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        🔄 {post.engagement.shares}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-colors opacity-0 group-hover:opacity-100">
                  <Copy className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-colors opacity-0 group-hover:opacity-100">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg text-text-tertiary hover:text-alert hover:bg-alert/10 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-surface-sunken flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-text-tertiary" />
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-2">No posts found</h3>
          <p className="text-text-secondary mb-6">Get started by creating your first post</p>
          <Link href="/dashboard/posts/new" className="btn-primary">
            <Plus className="w-4 h-4" />
            Create Post
          </Link>
        </div>
      )}
    </div>
  );
}
