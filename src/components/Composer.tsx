import { useState, useRef, useCallback } from 'react';
import type { Platform, Post } from '../types';
import { PLATFORM_CONFIG } from '../types';
import { PlatformSelector } from './PlatformSelector';
import { MediaUploader } from './MediaUploader';

const API_URL = 'http://localhost:3001';

export function Composer() {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getMinCharacterLimit = () => {
    if (selectedPlatforms.length === 0) return Infinity;
    return Math.min(...selectedPlatforms.map(p => PLATFORM_CONFIG[p].characterLimit));
  };

  const characterLimit = getMinCharacterLimit();
  const characterCount = content.length;
  const isOverLimit = characterLimit !== Infinity && characterCount > characterLimit;
  
  const requiresMedia = selectedPlatforms.some(p => PLATFORM_CONFIG[p].requiresMedia);
  const hasMedia = mediaUrls.length > 0;
  
  const canPost = selectedPlatforms.length > 0 && 
    content.trim().length > 0 && 
    !isOverLimit &&
    (!requiresMedia || hasMedia);

  const adjustTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, []);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    adjustTextareaHeight();
  };

  const handleMediaUpload = (urls: string[]) => {
    setMediaUrls(prev => [...prev, ...urls]);
  };

  const removeMedia = (index: number) => {
    setMediaUrls(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setContent('');
    setMediaUrls([]);
    setScheduledDate('');
    setScheduledTime('');
    setSelectedPlatforms([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleSubmit = async (action: 'post' | 'schedule') => {
    if (!canPost) return;

    setIsPosting(true);
    setMessage(null);

    try {
      const scheduledAt = action === 'schedule' && scheduledDate && scheduledTime
        ? new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
        : null;

      const response = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          platforms: selectedPlatforms,
          scheduledAt
        })
      });

      if (!response.ok) throw new Error('Failed to create post');
      const post: Post = await response.json();

      // Upload media if any
      if (mediaUrls.length > 0) {
        await fetch(`${API_URL}/api/posts/${post.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ media_urls: JSON.stringify(mediaUrls) })
        });
      }

      // If immediate post, publish it
      if (action === 'post') {
        const publishResponse = await fetch(`${API_URL}/api/posts/${post.id}/publish`, { method: 'POST' });
        const publishData = await publishResponse.json();
        
        if (publishData.errors && publishData.errors.length > 0) {
          setMessage({ 
            type: 'error', 
            text: `Posted with errors: ${publishData.errors.join(', ')}` 
          });
        } else {
          setMessage({ type: 'success', text: 'Posted successfully to all platforms!' });
        }
      } else {
        setMessage({ type: 'success', text: 'Scheduled successfully!' });
      }
      
      resetForm();
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setIsPosting(false);
    }
  };

  const getCharacterColor = () => {
    if (isOverLimit) return 'text-red-500';
    if (characterLimit !== Infinity && characterCount > characterLimit * 0.9) return 'text-yellow-600';
    return 'text-gray-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
      <h2 className="text-lg font-semibold text-gray-800">Create Post</h2>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <PlatformSelector 
        selectedPlatforms={selectedPlatforms} 
        onChange={setSelectedPlatforms} 
      />

      <div className="space-y-2">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          placeholder="What would you like to share?"
          className="w-full min-h-[120px] p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
          rows={4}
        />
        <div className="flex justify-end items-center gap-4">
          {characterLimit !== Infinity && (
            <span className={`text-xs font-medium ${getCharacterColor()}`}>
              {characterCount.toLocaleString()} / {characterLimit.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      <MediaUploader 
        onUpload={handleMediaUpload} 
        existingMedia={mediaUrls} 
        onRemove={removeMedia}
        required={requiresMedia}
      />

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-3">
          {scheduledDate && scheduledTime ? (
            <button
              onClick={() => handleSubmit('schedule')}
              disabled={!canPost || isPosting}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isPosting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Scheduling...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Schedule
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => handleSubmit('post')}
              disabled={!canPost || isPosting}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isPosting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Posting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Post Now
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
