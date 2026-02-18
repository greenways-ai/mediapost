'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Facebook, 
  Youtube,
  Image as ImageIcon,
  Smile,
  Calendar,
  Clock,
  Sparkles,
  Check
} from 'lucide-react';

const platforms = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E4405F', characterLimit: 2200 },
  { id: 'twitter', name: 'Twitter / X', icon: Twitter, color: '#1DA1F2', characterLimit: 280 },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: '#0A66C2', characterLimit: 3000 },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2', characterLimit: 63206 },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: '#FF0000', characterLimit: 5000 },
];

export default function NewPostPage() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram', 'twitter']);
  const [scheduleOption, setScheduleOption] = useState<'now' | 'later'>('later');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleSubmit = async (asDraft: boolean = false) => {
    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform');
      return;
    }
    if (!content.trim()) {
      alert('Please enter some content');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert(asDraft ? 'Draft saved!' : scheduleOption === 'now' ? 'Post published!' : 'Post scheduled!');
    router.push('/dashboard/posts');
  };

  const getMinCharacterLimit = () => {
    return Math.min(...selectedPlatforms.map(p => platforms.find(pl => pl.id === p)?.characterLimit || 2200));
  };

  const characterLimit = getMinCharacterLimit();
  const characterCount = content.length;
  const isOverLimit = characterCount > characterLimit;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/posts" 
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">Create Post</h1>
          <p className="text-text-secondary text-sm">Schedule content across your social platforms</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Content Editor */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium text-text-primary">Content</label>
              <button className="flex items-center gap-1.5 text-xs text-accent hover:text-accent-light transition-colors">
                <Sparkles className="w-3.5 h-3.5" />
                AI Suggestions
              </button>
            </div>
            
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full h-40 bg-surface-sunken border border-border rounded-lg p-4 text-text-primary placeholder:text-text-tertiary resize-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
            />
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-colors">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-colors">
                  <Smile className="w-5 h-5" />
                </button>
              </div>
              <div className={`text-sm ${isOverLimit ? 'text-alert' : 'text-text-tertiary'}`}>
                {characterCount} / {characterLimit}
              </div>
            </div>
          </div>

          {/* Media Upload */}
          <div className="card p-6">
            <label className="text-sm font-medium text-text-primary mb-4 block">Media</label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-accent/50 hover:bg-accent/5 transition-all cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-surface-sunken flex items-center justify-center mx-auto mb-3">
                <ImageIcon className="w-6 h-6 text-text-tertiary" />
              </div>
              <p className="text-text-secondary text-sm mb-1">Drag and drop images or videos</p>
              <p className="text-text-tertiary text-xs">or click to browse</p>
            </div>
          </div>

          {/* Preview */}
          {content && (
            <div className="card p-6">
              <label className="text-sm font-medium text-text-primary mb-4 block">Preview</label>
              <div className="bg-surface-sunken rounded-lg p-4">
                <p className="text-text-primary whitespace-pre-wrap">{content}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Platform Selection */}
          <div className="card p-5">
            <label className="text-sm font-medium text-text-primary mb-4 block">
              Select Platforms
              <span className="text-text-tertiary font-normal ml-1">({selectedPlatforms.length} selected)</span>
            </label>
            <div className="space-y-2">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                const isSelected = selectedPlatforms.includes(platform.id);
                return (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      isSelected
                        ? 'border-accent bg-accent/5'
                        : 'border-border hover:border-accent/30 hover:bg-surface-hover'
                    }`}
                  >
                    <div 
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${platform.color}15` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: platform.color }} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-text-primary">{platform.name}</div>
                      <div className="text-xs text-text-tertiary">{platform.characterLimit} chars</div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected ? 'border-accent bg-accent' : 'border-border'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scheduling */}
          <div className="card p-5">
            <label className="text-sm font-medium text-text-primary mb-4 block">When to Post</label>
            
            <div className="space-y-3">
              <button
                onClick={() => setScheduleOption('now')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  scheduleOption === 'now'
                    ? 'border-accent bg-accent/5'
                    : 'border-border hover:border-accent/30'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  scheduleOption === 'now' ? 'border-accent bg-accent' : 'border-border'
                }`}>
                  {scheduleOption === 'now' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span className="text-sm text-text-primary">Post Now</span>
              </button>

              <button
                onClick={() => setScheduleOption('later')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  scheduleOption === 'later'
                    ? 'border-accent bg-accent/5'
                    : 'border-border hover:border-accent/30'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  scheduleOption === 'later' ? 'border-accent bg-accent' : 'border-border'
                }`}>
                  {scheduleOption === 'later' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span className="text-sm text-text-primary">Schedule for Later</span>
              </button>
            </div>

            {scheduleOption === 'later' && (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-xs text-text-tertiary mb-1.5 block">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-surface-sunken border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-accent/50 focus:border-accent"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-text-tertiary mb-1.5 block">Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-surface-sunken border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-accent/50 focus:border-accent"
                    />
                  </div>
                </div>
                
                {/* Best Time Suggestion */}
                <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg">
                  <div className="flex items-center gap-2 text-xs text-accent mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="font-medium">Best time to post</span>
                  </div>
                  <p className="text-xs text-text-secondary">
                    Based on your audience, 2:00 PM - 4:00 PM has the highest engagement
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting || selectedPlatforms.length === 0 || !content.trim()}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : scheduleOption === 'now' ? (
                'Publish Now'
              ) : (
                'Schedule Post'
              )}
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting || !content.trim()}
              className="w-full btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save as Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
