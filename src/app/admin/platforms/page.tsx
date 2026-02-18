'use client';

import { useState, useEffect } from 'react';
import { createClientBrowser } from '@/lib/supabase';
import { PLATFORM_CONFIG, type Platform, type PlatformSetting } from '@/types';
import { 
  ToggleLeft, 
  ToggleRight, 
  Settings, 
  Save,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';

const supabase = createClientBrowser();

export default function PlatformsAdmin() {
  const [platforms, setPlatforms] = useState<PlatformSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchPlatforms();
  }, []);

  async function fetchPlatforms() {
    const { data, error } = await supabase
      .from('platform_settings')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching platforms:', error);
      setMessage({ type: 'error', text: 'Failed to load platforms' });
    } else {
      setPlatforms(data || []);
    }
    setLoading(false);
  }

  async function togglePlatform(platformId: string, currentStatus: boolean) {
    setSaving(platformId);
    
    const { error } = await supabase
      .from('platform_settings')
      .update({ is_enabled: !currentStatus })
      .eq('id', platformId);

    if (error) {
      setMessage({ type: 'error', text: `Failed to update platform: ${error.message}` });
    } else {
      setMessage({ type: 'success', text: 'Platform status updated' });
      fetchPlatforms();
    }
    
    setSaving(null);
    setTimeout(() => setMessage(null), 3000);
  }

  async function savePlatformConfig(platformId: string, formData: FormData) {
    setSaving(platformId);

    const updates = {
      client_id: formData.get('client_id') as string,
      client_secret: formData.get('client_secret') as string,
      redirect_uri: formData.get('redirect_uri') as string,
      scope: formData.get('scope') as string,
      auth_url: formData.get('auth_url') as string,
      token_url: formData.get('token_url') as string,
    };

    const { error } = await supabase
      .from('platform_settings')
      .update(updates)
      .eq('id', platformId);

    if (error) {
      setMessage({ type: 'error', text: `Failed to save: ${error.message}` });
    } else {
      setMessage({ type: 'success', text: 'Platform configuration saved' });
      setEditing(null);
      fetchPlatforms();
    }

    setSaving(null);
    setTimeout(() => setMessage(null), 3000);
  }

  const toggleSecretVisibility = (field: string) => {
    setShowSecrets(prev => ({ ...prev, [field]: !prev[field] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Platform Management</h1>
        <p className="text-gray-600 mt-1">
          Enable/disable social media platforms and configure their OAuth credentials
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        {platforms.map((platform) => {
          const config = PLATFORM_CONFIG[platform.platform as Platform];
          const isEditing = editing === platform.id;

          return (
            <div
              key={platform.id}
              className={`bg-white rounded-xl border ${
                platform.is_enabled ? 'border-blue-200' : 'border-gray-200'
              } shadow-sm overflow-hidden`}
            >
              {/* Platform Header */}
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: config?.color || '#666' }}
                  >
                    {config?.name.charAt(0) || '?'}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {config?.name || platform.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {config?.authType === 'oauth' ? 'OAuth 2.0' : 
                       config?.authType === 'token' ? 'API Token' : 'Password'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setEditing(isEditing ? null : platform.id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Settings className="w-4 h-4" />
                    {isEditing ? 'Close' : 'Configure'}
                  </button>

                  <button
                    onClick={() => togglePlatform(platform.id, platform.is_enabled)}
                    disabled={saving === platform.id}
                    className="flex items-center gap-2"
                  >
                    {platform.is_enabled ? (
                      <ToggleRight className="w-12 h-12 text-green-500" />
                    ) : (
                      <ToggleLeft className="w-12 h-12 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Configuration Form */}
              {isEditing && (
                <div className="border-t border-gray-200 bg-gray-50 p-6">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      savePlatformConfig(platform.id, new FormData(e.currentTarget));
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Client ID */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Key className="w-4 h-4 inline mr-1" />
                          Client ID
                        </label>
                        <input
                          type="text"
                          name="client_id"
                          defaultValue={platform.client_id || ''}
                          placeholder="Enter client ID"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      {/* Client Secret */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Key className="w-4 h-4 inline mr-1" />
                          Client Secret
                        </label>
                        <div className="relative">
                          <input
                            type={showSecrets[`${platform.id}_secret`] ? 'text' : 'password'}
                            name="client_secret"
                            defaultValue={platform.client_secret || ''}
                            placeholder="Enter client secret"
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => toggleSecretVisibility(`${platform.id}_secret`)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showSecrets[`${platform.id}_secret`] ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Redirect URI */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <ExternalLink className="w-4 h-4 inline mr-1" />
                          Redirect URI
                        </label>
                        <input
                          type="url"
                          name="redirect_uri"
                          defaultValue={platform.redirect_uri || `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback/${platform.platform}`}
                          placeholder="https://yourdomain.com/auth/callback/twitter"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      {/* Scope */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Scope
                        </label>
                        <input
                          type="text"
                          name="scope"
                          defaultValue={platform.scope || ''}
                          placeholder="e.g., tweet.read tweet.write users.read"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      {/* Auth URL */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Authorization URL
                        </label>
                        <input
                          type="url"
                          name="auth_url"
                          defaultValue={platform.auth_url || ''}
                          placeholder="https://api.twitter.com/2/oauth2/authorize"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      {/* Token URL */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Token URL
                        </label>
                        <input
                          type="url"
                          name="token_url"
                          defaultValue={platform.token_url || ''}
                          placeholder="https://api.twitter.com/2/oauth2/token"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                      <button
                        type="submit"
                        disabled={saving === platform.id}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {saving === platform.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save Configuration
                          </>
                        )}
                      </button>

                      {platform.is_enabled && (
                        <span className="flex items-center gap-1 text-sm text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          Platform is enabled
                        </span>
                      )}
                    </div>
                  </form>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
