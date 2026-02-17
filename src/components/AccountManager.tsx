import { useState, useEffect } from 'react';
import type { Account, Subreddit, PinterestBoard, DiscordChannel, Platform } from '../types';
import { PlatformIcon } from './PlatformIcon';
import { PLATFORM_CONFIG } from '../types';

const API_URL = 'http://localhost:3001';

const INTEGRATED_PLATFORMS: Platform[] = ['twitter', 'instagram', 'reddit', 'pinterest', 'discord'];

export function AccountManager() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [connecting, setConnecting] = useState<Platform | null>(null);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  // Reddit
  const [subreddits, setSubreddits] = useState<Subreddit[]>([]);
  const [selectedSubreddit, setSelectedSubreddit] = useState('');
  const [showSubredditModal, setShowSubredditModal] = useState(false);
  
  // Pinterest
  const [boards, setBoards] = useState<PinterestBoard[]>([]);
  const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
  const [showBoardModal, setShowBoardModal] = useState(false);
  
  // Discord
  const [channels, setChannels] = useState<DiscordChannel[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [showChannelModal, setShowChannelModal] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Check for OAuth callback params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connected = params.get('connected');
    const error = params.get('error');
    
    if (connected) {
      setMessage({ type: 'success', text: `Connected to ${PLATFORM_CONFIG[connected as Platform]?.name || connected}!` });
      window.history.replaceState({}, '', window.location.pathname);
      fetchAccounts();
      
      if (connected === 'reddit') fetchSubreddits();
      if (connected === 'pinterest') fetchBoards();
      if (connected === 'discord') fetchChannels();
    } else if (error) {
      setMessage({ type: 'error', text: `Connection failed: ${error}` });
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/accounts`);
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    }
  };

  const fetchSubreddits = async () => {
    try {
      const response = await fetch(`${API_URL}/api/reddit/subreddits`);
      if (response.ok) {
        const data = await response.json();
        setSubreddits(data);
      }
    } catch (error) {
      console.error('Failed to fetch subreddits:', error);
    }
  };

  const fetchBoards = async () => {
    try {
      const response = await fetch(`${API_URL}/api/pinterest/boards`);
      if (response.ok) {
        const data = await response.json();
        setBoards(data);
      }
    } catch (error) {
      console.error('Failed to fetch boards:', error);
    }
  };

  const fetchChannels = async () => {
    try {
      const response = await fetch(`${API_URL}/api/discord/channels`);
      if (response.ok) {
        const data = await response.json();
        setChannels(data);
      }
    } catch (error) {
      console.error('Failed to fetch channels:', error);
    }
  };

  const handleConnect = async (platform: Platform) => {
    setConnecting(platform);
    setMessage(null);
    
    try {
      const response = await fetch(`${API_URL}/api/auth/${platform}/url`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get auth URL');
      }
      
      const { authUrl } = await response.json();
      window.location.href = authUrl;
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
      setConnecting(null);
    }
  };

  const handleDisconnect = async (platform: Platform) => {
    if (!confirm(`Disconnect ${PLATFORM_CONFIG[platform].name}?`)) return;
    
    try {
      await fetch(`${API_URL}/api/accounts/${platform}/disconnect`, { method: 'POST' });
      fetchAccounts();
      setMessage({ type: 'success', text: `Disconnected from ${PLATFORM_CONFIG[platform].name}` });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to disconnect' });
    }
  };

  const saveMetadata = async (platform: Platform, metadata: any) => {
    try {
      await fetch(`${API_URL}/api/accounts/${platform}/metadata`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metadata)
      });
      fetchAccounts();
    } catch (error) {
      console.error('Failed to save metadata:', error);
    }
  };

  const handleSaveSubreddit = async () => {
    if (!selectedSubreddit) return;
    await saveMetadata('reddit', { preferred_subreddit: selectedSubreddit });
    setShowSubredditModal(false);
    setMessage({ type: 'success', text: `Default subreddit set to r/${selectedSubreddit}` });
  };

  const handleSaveBoards = async () => {
    if (selectedBoards.length === 0) return;
    await saveMetadata('pinterest', { selected_boards: selectedBoards });
    setShowBoardModal(false);
    setMessage({ type: 'success', text: `Selected ${selectedBoards.length} board(s)` });
  };

  const handleSaveChannels = async () => {
    if (selectedChannels.length === 0) return;
    await saveMetadata('discord', { selected_channels: selectedChannels });
    setShowChannelModal(false);
    setMessage({ type: 'success', text: `Selected ${selectedChannels.length} channel(s)` });
  };

  const toggleBoard = (boardId: string) => {
    setSelectedBoards(prev => 
      prev.includes(boardId) 
        ? prev.filter(id => id !== boardId)
        : [...prev, boardId]
    );
  };

  const toggleChannel = (channelId: string) => {
    setSelectedChannels(prev => 
      prev.includes(channelId) 
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  const integratedAccounts = accounts.filter(acc => 
    INTEGRATED_PLATFORMS.includes(acc.platform)
  );

  const getConfigButton = (account: Account) => {
    if (!account.is_connected) return null;
    
    switch (account.platform) {
      case 'reddit':
        return (
          <button
            onClick={() => { fetchSubreddits(); setShowSubredditModal(true); }}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Subreddit
          </button>
        );
      case 'pinterest':
        return (
          <button
            onClick={() => { fetchBoards(); setShowBoardModal(true); setSelectedBoards([]); }}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Boards
          </button>
        );
      case 'discord':
        return (
          <button
            onClick={() => { fetchChannels(); setShowChannelModal(true); setSelectedChannels([]); }}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Channels
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Connected Accounts</h2>
      
      {message && (
        <div className={`p-3 rounded-lg text-sm mb-4 ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-3">
        {integratedAccounts.map(account => {
          const config = PLATFORM_CONFIG[account.platform];
          
          return (
            <div 
              key={account.id}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                account.is_connected 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <PlatformIcon platform={account.platform} size={24} />
                <div>
                  <p className="font-medium text-gray-900">{config.name}</p>
                  <p className="text-sm text-gray-500">
                    {account.is_connected ? (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        {account.handle || 'Connected'}
                      </span>
                    ) : (
                      'Not connected'
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {getConfigButton(account)}
                
                {account.is_connected ? (
                  <button
                    onClick={() => handleDisconnect(account.platform)}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnect(account.platform)}
                    disabled={connecting === account.platform}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {connecting === account.platform ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Connecting...
                      </>
                    ) : (
                      'Connect'
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Subreddit Modal */}
      {showSubredditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Select Default Subreddit</h3>
            
            {subreddits.length > 0 ? (
              <div className="space-y-2 mb-4">
                {subreddits.map(sub => (
                  <label
                    key={sub.name}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedSubreddit === sub.name 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="subreddit"
                        value={sub.name}
                        checked={selectedSubreddit === sub.name}
                        onChange={(e) => setSelectedSubreddit(e.target.value)}
                        className="text-blue-600"
                      />
                      <div>
                        <p className="font-medium text-gray-900">r/{sub.name}</p>
                        <p className="text-xs text-gray-500">{sub.subscribers?.toLocaleString()} subscribers</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Loading subreddits...</p>
            )}
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowSubredditModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSubreddit}
                disabled={!selectedSubreddit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Boards Modal */}
      {showBoardModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-2">Select Boards</h3>
            <p className="text-sm text-gray-500 mb-4">Post will be created on all selected boards</p>
            
            {boards.length > 0 ? (
              <div className="space-y-2 mb-4">
                {boards.map(board => (
                  <label
                    key={board.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedBoards.includes(board.id)
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedBoards.includes(board.id)}
                        onChange={() => toggleBoard(board.id)}
                        className="text-blue-600 rounded"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{board.name}</p>
                        {board.description && (
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">{board.description}</p>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Loading boards...</p>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{selectedBoards.length} selected</span>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBoardModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBoards}
                  disabled={selectedBoards.length === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Channels Modal */}
      {showChannelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-2">Select Channels</h3>
            <p className="text-sm text-gray-500 mb-4">Message will be sent to all selected channels</p>
            
            {channels.length > 0 ? (
              <div className="space-y-2 mb-4">
                {channels.map(channel => (
                  <label
                    key={channel.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedChannels.includes(channel.id)
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedChannels.includes(channel.id)}
                        onChange={() => toggleChannel(channel.id)}
                        className="text-blue-600 rounded"
                      />
                      <div>
                        <p className="font-medium text-gray-900">#{channel.name}</p>
                        <p className="text-xs text-gray-500">{channel.guildName}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Loading channels...</p>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{selectedChannels.length} selected</span>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowChannelModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChannels}
                  disabled={selectedChannels.length === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
