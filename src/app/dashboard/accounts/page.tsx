'use client';

import { useState } from 'react';
import { 
  Instagram, 
  Twitter, 
  Linkedin, 
  Facebook, 
  Youtube,
  Plus,
  RefreshCw,
  MoreHorizontal,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

// Mock data for connected accounts
const mockAccounts = [
  {
    id: 1,
    platform: 'instagram',
    name: 'Instagram',
    handle: '@yourbrand',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=insta',
    status: 'connected',
    followers: '12.5K',
    lastSync: '2 min ago',
  },
  {
    id: 2,
    platform: 'twitter',
    name: 'Twitter / X',
    handle: '@yourhandle',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=twitter',
    status: 'connected',
    followers: '8.2K',
    lastSync: '5 min ago',
  },
  {
    id: 3,
    platform: 'linkedin',
    name: 'LinkedIn',
    handle: 'Your Company',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=linkedin',
    status: 'connected',
    followers: '3.1K',
    lastSync: '1 hour ago',
  },
  {
    id: 4,
    platform: 'facebook',
    name: 'Facebook',
    handle: 'Your Brand Page',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=facebook',
    status: 'error',
    followers: '5.8K',
    lastSync: 'Failed',
  },
];

const availablePlatforms = [
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: '#FF0000', description: 'Connect your YouTube channel' },
  { id: 'tiktok', name: 'TikTok', icon: null, color: '#00f2ea', description: 'Connect your TikTok account' },
  { id: 'pinterest', name: 'Pinterest', icon: null, color: '#E60023', description: 'Connect your Pinterest profile' },
];

const platformIcons: Record<string, any> = {
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  facebook: Facebook,
  youtube: Youtube,
};

const platformColors: Record<string, string> = {
  instagram: '#E4405F',
  twitter: '#1DA1F2',
  linkedin: '#0A66C2',
  facebook: '#1877F2',
  youtube: '#FF0000',
};

export default function AccountsPage() {
  const [accounts, setAccounts] = useState(mockAccounts);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  const handleConnect = async (platformId: string) => {
    setIsConnecting(platformId);
    // Simulate OAuth flow
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsConnecting(null);
    alert(`Connecting to ${platformId}... (OAuth flow would start here)`);
  };

  const handleReconnect = async (accountId: number) => {
    // Simulate reconnect
    await new Promise(resolve => setTimeout(resolve, 1000));
    setAccounts(prev => prev.map(acc => 
      acc.id === accountId ? { ...acc, status: 'connected', lastSync: 'Just now' } : acc
    ));
  };

  const handleDisconnect = (accountId: number) => {
    if (confirm('Are you sure you want to disconnect this account?')) {
      setAccounts(prev => prev.filter(acc => acc.id !== accountId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">Connected Accounts</h1>
          <p className="text-text-secondary mt-1">Manage your social media connections</p>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="space-y-4">
        <h2 className="text-sm font-medium text-text-tertiary uppercase tracking-wider">Connected ({accounts.filter(a => a.status === 'connected').length})</h2>
        
        {accounts.map((account) => {
          const Icon = platformIcons[account.platform];
          const isError = account.status === 'error';
          
          return (
            <div key={account.id} className={`card p-5 ${isError ? 'border-alert/30' : ''}`}>
              <div className="flex items-start gap-4">
                {/* Platform Icon */}
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${platformColors[account.platform]}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: platformColors[account.platform] }} />
                </div>

                {/* Account Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-text-primary">{account.name}</h3>
                    {account.status === 'connected' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-alert" />
                    )}
                  </div>
                  <p className="text-sm text-text-secondary">{account.handle}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-text-tertiary">
                    <span className="flex items-center gap-1">
                      <span className="font-medium text-text-primary">{account.followers}</span> followers
                    </span>
                    <span>Last synced: {account.lastSync}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {isError && (
                    <button
                      onClick={() => handleReconnect(account.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-alert bg-alert/10 rounded-lg hover:bg-alert/20 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Reconnect
                    </button>
                  )}
                  <button className="p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDisconnect(account.id)}
                    className="p-2 rounded-lg text-text-tertiary hover:text-alert hover:bg-alert/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Accounts */}
      <div className="space-y-4">
        <h2 className="text-sm font-medium text-text-tertiary uppercase tracking-wider">Add New Account</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availablePlatforms.map((platform) => {
            const Icon = platform.icon || ExternalLink;
            return (
              <button
                key={platform.id}
                onClick={() => handleConnect(platform.id)}
                disabled={isConnecting === platform.id}
                className="card p-4 flex items-center gap-4 text-left hover:border-accent/30 transition-all disabled:opacity-50"
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${platform.color}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: platform.color }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-text-primary">{platform.name}</h3>
                  <p className="text-sm text-text-secondary">{platform.description}</p>
                </div>
                {isConnecting === platform.id ? (
                  <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                ) : (
                  <Plus className="w-5 h-5 text-text-tertiary" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Settings Note */}
      <div className="card p-5 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
            <RefreshCw className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h3 className="font-medium text-text-primary mb-1">Auto-sync enabled</h3>
            <p className="text-sm text-text-secondary">
              Your accounts are automatically synced every 15 minutes. You can manually sync from the settings page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
