import { useState, useEffect } from 'react';
import type { Post } from '../types';
import { PostCard } from './PostCard';

const API_URL = 'http://localhost:3001';

export function PostQueue() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'scheduled' | 'published' | 'drafts'>('scheduled');
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const statusMap = {
        scheduled: 'scheduled',
        published: 'published',
        drafts: 'draft'
      };
      const response = await fetch(`${API_URL}/api/posts?status=${statusMap[activeTab]}`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await fetch(`${API_URL}/api/posts/${id}`, { method: 'DELETE' });
      setPosts(posts.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await fetch(`${API_URL}/api/posts/${id}/publish`, { method: 'POST' });
      fetchPosts();
    } catch (error) {
      console.error('Failed to publish post:', error);
    }
  };

  const tabs = [
    { id: 'scheduled', label: 'Scheduled', count: null },
    { id: 'published', label: 'Published', count: null },
    { id: 'drafts', label: 'Drafts', count: null }
  ] as const;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-6 py-4 text-sm font-medium border-b-2 transition-colors
                ${activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-gray-900 font-medium mb-1">
              {activeTab === 'scheduled' && 'No scheduled posts'}
              {activeTab === 'published' && 'No published posts'}
              {activeTab === 'drafts' && 'No drafts'}
            </h3>
            <p className="text-gray-500 text-sm">
              {activeTab === 'scheduled' && 'Posts you schedule will appear here'}
              {activeTab === 'published' && 'Your published posts will appear here'}
              {activeTab === 'drafts' && 'Draft posts will appear here'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <PostCard 
                key={post.id} 
                post={post} 
                onDelete={() => handleDelete(post.id)}
                onPublish={() => handlePublish(post.id)}
                showPublish={activeTab === 'drafts'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
