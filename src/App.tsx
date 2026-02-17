import { useState } from 'react';
import { Composer } from './components/Composer';
import { PostQueue } from './components/PostQueue';
import { AccountManager } from './components/AccountManager';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'publish' | 'accounts'>('publish');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Buffer Clone</h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => setActiveTab('publish')}
                className={`text-sm font-medium transition-colors ${
                  activeTab === 'publish' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Publish
              </button>
              <button 
                onClick={() => setActiveTab('accounts')}
                className={`text-sm font-medium transition-colors ${
                  activeTab === 'accounts' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Accounts
              </button>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </nav>

            <button 
              className="md:hidden p-2"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-xl p-4">
            <nav className="space-y-2">
              <button 
                onClick={() => { setActiveTab('publish'); setSidebarOpen(false); }}
                className={`block w-full text-left px-4 py-2 text-sm font-medium rounded-lg ${
                  activeTab === 'publish' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Publish
              </button>
              <button 
                onClick={() => { setActiveTab('accounts'); setSidebarOpen(false); }}
                className={`block w-full text-left px-4 py-2 text-sm font-medium rounded-lg ${
                  activeTab === 'accounts' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Accounts
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'publish' ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left column - Composer */}
            <div className="lg:col-span-2 space-y-6">
              <Composer />
            </div>

            {/* Right column - Queue */}
            <div className="space-y-6">
              <PostQueue />
              
              {/* Quick tips */}
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pro Tips
                </h3>
                <ul className="text-sm space-y-2 text-blue-100">
                  <li>• Best times to post: 9am, 12pm, 3pm</li>
                  <li>• Include images for 2x more engagement</li>
                  <li>• Keep tweets under 280 characters</li>
                  <li>• Use 3-5 hashtags on Instagram</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <AccountManager />
            
            {/* Setup Instructions */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">API Setup Instructions</h3>
              
              <div className="space-y-4 text-sm text-gray-600">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Twitter/X</h4>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Go to <a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Twitter Developer Portal</a></li>
                    <li>Create a new project and app</li>
                    <li>Enable OAuth 2.0 with callback: <code className="bg-gray-200 px-1 rounded">http://localhost:3001/api/auth/twitter/callback</code></li>
                    <li>Copy Client ID and Secret to your <code className="bg-gray-200 px-1 rounded">.env</code> file</li>
                  </ol>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Reddit</h4>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Go to <a href="https://www.reddit.com/prefs/apps" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Reddit App Preferences</a></li>
                    <li>Create a new app (web)</li>
                    <li>Set redirect URI: <code className="bg-gray-200 px-1 rounded">http://localhost:3001/api/auth/reddit/callback</code></li>
                    <li>Copy Client ID and Secret to your <code className="bg-gray-200 px-1 rounded">.env</code> file</li>
                  </ol>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Instagram</h4>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Go to <a href="https://developers.facebook.com/apps" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Meta for Developers</a></li>
                    <li>Create a new app (Business type)</li>
                    <li>Add Instagram Basic Display and Instagram Graph API products</li>
                    <li>Set callback URL: <code className="bg-gray-200 px-1 rounded">http://localhost:3001/api/auth/instagram/callback</code></li>
                    <li>Copy App ID and Secret to your <code className="bg-gray-200 px-1 rounded">.env</code> file</li>
                  </ol>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Pinterest</h4>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Go to <a href="https://developers.pinterest.com/apps/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Pinterest Developers</a></li>
                    <li>Create a new app</li>
                    <li>Set redirect URI: <code className="bg-gray-200 px-1 rounded">http://localhost:3001/api/auth/pinterest/callback</code></li>
                    <li>Copy App ID and Secret to your <code className="bg-gray-200 px-1 rounded">.env</code> file</li>
                  </ol>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Discord</h4>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Go to <a href="https://discord.com/developers/applications" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Discord Developer Portal</a></li>
                    <li>Create a new application</li>
                    <li>Add redirect: <code className="bg-gray-200 px-1 rounded">http://localhost:3001/api/auth/discord/callback</code></li>
                    <li>Copy Client ID and Secret to your <code className="bg-gray-200 px-1 rounded">.env</code> file</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
