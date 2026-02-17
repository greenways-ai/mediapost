import type { Post } from '../types';
import { PlatformIcon } from './PlatformIcon';

interface PostCardProps {
  post: Post;
  onDelete: () => void;
  onPublish?: () => void;
  showPublish?: boolean;
}

const API_URL = 'http://localhost:3001';

export function PostCard({ post, onDelete, onPublish, showPublish }: PostCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isImage = (url: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  const isVideo = (url: string) => /\.(mp4|mov|webm)$/i.test(url);

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {post.platforms.map(platform => (
            <PlatformIcon 
              key={platform} 
              platform={platform} 
              size={20}
              className="bg-gray-100 p-1"
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          {post.scheduled_at && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatDate(post.scheduled_at)}
            </span>
          )}
          {post.published_at && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {formatDate(post.published_at)}
            </span>
          )}
        </div>
      </div>

      <p className="text-gray-800 mb-3 whitespace-pre-wrap">{post.content}</p>

      {post.media_urls && post.media_urls.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mb-3">
          {post.media_urls.map((url, index) => (
            <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              {isImage(url) && (
                <img 
                  src={`${API_URL}${url}`} 
                  alt={`Media ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
              {isVideo(url) && (
                <video 
                  src={`${API_URL}${url}`}
                  className="w-full h-full object-cover"
                  preload="metadata"
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <span className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${post.status === 'published' ? 'bg-green-100 text-green-800' : ''}
            ${post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : ''}
            ${post.status === 'draft' ? 'bg-gray-100 text-gray-800' : ''}
          `}>
            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {showPublish && onPublish && (
            <button
              onClick={onPublish}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Publish Now
            </button>
          )}
          <button
            onClick={onDelete}
            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
