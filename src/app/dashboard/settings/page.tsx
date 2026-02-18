'use client';

import { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Zap,
  Moon,
  Mail,
  Smartphone,
  Check,
  Loader2
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  const [settings, setSettings] = useState({
    // Profile
    name: 'John Doe',
    email: 'john@example.com',
    bio: '',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    postPublished: true,
    weeklyReport: true,
    mentions: true,
    
    // Preferences
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    language: 'en',
    
    // Security
    twoFactor: false,
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaveMessage('Settings saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-text-primary">Settings</h1>
        <p className="text-text-secondary mt-1">Manage your account preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <nav className="card p-2 space-y-1 sticky top-24">
            <a href="#profile" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-text-primary bg-surface-hover rounded-lg">
              <User className="w-5 h-5 text-text-tertiary" />
              Profile
            </a>
            <a href="#notifications" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-text-tertiary" />
              Notifications
            </a>
            <a href="#preferences" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary rounded-lg transition-colors">
              <Globe className="w-5 h-5 text-text-tertiary" />
              Preferences
            </a>
            <a href="#appearance" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary rounded-lg transition-colors">
              <Moon className="w-5 h-5 text-text-tertiary" />
              Appearance
            </a>
            <a href="#security" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary rounded-lg transition-colors">
              <Shield className="w-5 h-5 text-text-tertiary" />
              Security
            </a>
          </nav>
        </div>

        {/* Settings Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Section */}
          <section id="profile" className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <User className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-text-primary">Profile</h2>
                <p className="text-sm text-text-secondary">Manage your personal information</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) => updateSetting('name', e.target.value)}
                    className="w-full px-4 py-2 bg-surface-sunken border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-accent/50 focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => updateSetting('email', e.target.value)}
                    className="w-full px-4 py-2 bg-surface-sunken border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-accent/50 focus:border-accent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Bio</label>
                <textarea
                  value={settings.bio}
                  onChange={(e) => updateSetting('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  className="w-full px-4 py-2 bg-surface-sunken border border-border rounded-lg text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-accent/50 focus:border-accent resize-none"
                />
              </div>
            </div>
          </section>

          {/* Notifications Section */}
          <section id="notifications" className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-info" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-text-primary">Notifications</h2>
                <p className="text-sm text-text-secondary">Choose how you want to be notified</p>
              </div>
            </div>

            <div className="space-y-4">
              <ToggleSetting
                icon={Mail}
                title="Email Notifications"
                description="Receive updates via email"
                checked={settings.emailNotifications}
                onChange={(checked) => updateSetting('emailNotifications', checked)}
              />
              <ToggleSetting
                icon={Smartphone}
                title="Push Notifications"
                description="Receive push notifications on your device"
                checked={settings.pushNotifications}
                onChange={(checked) => updateSetting('pushNotifications', checked)}
              />
              <div className="pt-4 border-t border-divider">
                <h3 className="text-sm font-medium text-text-primary mb-4">Notify me when:</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-text-secondary">Post is published</span>
                    <input
                      type="checkbox"
                      checked={settings.postPublished}
                      onChange={(e) => updateSetting('postPublished', e.target.checked)}
                      className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-text-secondary">Weekly report is ready</span>
                    <input
                      type="checkbox"
                      checked={settings.weeklyReport}
                      onChange={(e) => updateSetting('weeklyReport', e.target.checked)}
                      className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-text-secondary">Someone mentions me</span>
                    <input
                      type="checkbox"
                      checked={settings.mentions}
                      onChange={(e) => updateSetting('mentions', e.target.checked)}
                      className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                    />
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Preferences Section */}
          <section id="preferences" className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-warning" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-text-primary">Preferences</h2>
                <p className="text-sm text-text-secondary">Customize your experience</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => updateSetting('timezone', e.target.value)}
                  className="w-full px-4 py-2 bg-surface-sunken border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-accent/50 focus:border-accent"
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Europe/Paris">Paris (CET)</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                  <option value="Australia/Sydney">Sydney (AEST)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Date Format</label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) => updateSetting('dateFormat', e.target.value)}
                  className="w-full px-4 py-2 bg-surface-sunken border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-accent/50 focus:border-accent"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => updateSetting('language', e.target.value)}
                  className="w-full px-4 py-2 bg-surface-sunken border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-accent/50 focus:border-accent"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="ja">日本語</option>
                  <option value="zh">中文</option>
                </select>
              </div>
            </div>
          </section>

          {/* Appearance Section */}
          <section id="appearance" className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Moon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-text-primary">Appearance</h2>
                <p className="text-sm text-text-secondary">Customize how MyPost looks</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { value: 'light', label: 'Light', description: 'Light background with dark text' },
                { value: 'dark', label: 'Dark', description: 'Dark background with light text' },
                { value: 'system', label: 'System', description: 'Follow your system preference' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value as any)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    theme === option.value
                      ? 'border-accent bg-accent/5'
                      : 'border-border hover:border-accent/30'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    theme === option.value ? 'border-accent bg-accent' : 'border-border'
                  }`}>
                    {theme === option.value && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-text-primary">{option.label}</div>
                    <div className="text-xs text-text-secondary">{option.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Security Section */}
          <section id="security" className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-alert/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-alert" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-text-primary">Security</h2>
                <p className="text-sm text-text-secondary">Keep your account secure</p>
              </div>
            </div>

            <div className="space-y-4">
              <ToggleSetting
                icon={Shield}
                title="Two-Factor Authentication"
                description="Add an extra layer of security to your account"
                checked={settings.twoFactor}
                onChange={(checked) => updateSetting('twoFactor', checked)}
              />
              <div className="pt-4 border-t border-divider">
                <button className="text-sm text-accent hover:text-accent-light transition-colors">
                  Change Password
                </button>
              </div>
              <div>
                <button className="text-sm text-alert hover:text-alert-light transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          </section>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-4">
            {saveMessage && (
              <div className="flex items-center gap-2 text-sm text-accent">
                <Check className="w-4 h-4" />
                {saveMessage}
              </div>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn-primary ml-auto disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Toggle Setting Component
function ToggleSetting({ 
  icon: Icon, 
  title, 
  description, 
  checked, 
  onChange 
}: { 
  icon: any;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-surface-sunken flex items-center justify-center">
          <Icon className="w-4 h-4 text-text-tertiary" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-text-primary">{title}</h3>
          <p className="text-xs text-text-secondary">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          checked ? 'bg-accent' : 'bg-surface-sunken'
        }`}
      >
        <div
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
