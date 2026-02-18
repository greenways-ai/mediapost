'use client';

import { useState } from 'react';
import { Settings, Globe, Bell, Shield, Save, Loader2 } from 'lucide-react';

export default function SettingsAdmin() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-text-primary">Settings</h1>
        <p className="text-text-secondary mt-1">
          Configure your MyPost instance settings
        </p>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-lg font-display font-semibold text-text-primary">General Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Site Name
              </label>
              <input
                type="text"
                defaultValue="MyPost"
                className="w-full max-w-md px-3 py-2 bg-surface-sunken border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-accent/50 focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Site URL
              </label>
              <input
                type="url"
                defaultValue="https://mypost.greenways.ai"
                className="w-full max-w-md px-3 py-2 bg-surface-sunken border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-accent/50 focus:border-accent"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-alert/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-alert" />
            </div>
            <h2 className="text-lg font-display font-semibold text-text-primary">Security</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-text-primary">Require Email Verification</h3>
                <p className="text-sm text-text-secondary">New users must verify their email before accessing the app</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-surface-sunken peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-text-primary">Two-Factor Authentication</h3>
                <p className="text-sm text-text-secondary">Require 2FA for admin accounts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-surface-sunken peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-warning" />
            </div>
            <h2 className="text-lg font-display font-semibold text-text-primary">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-text-primary">New User Signups</h3>
                <p className="text-sm text-text-secondary">Receive email when a new user signs up</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-surface-sunken peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
