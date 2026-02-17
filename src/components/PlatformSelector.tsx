import { useState, useEffect } from 'react';
import type { Platform, Account } from '../types';
import { PLATFORM_CONFIG } from '../types';
import { PlatformIcon } from './PlatformIcon';

interface PlatformSelectorProps {
  selectedPlatforms: Platform[];
  onChange: (platforms: Platform[]) => void;
}

const API_URL = 'http://localhost:3001';

export function PlatformSelector({ selectedPlatforms, onChange }: PlatformSelectorProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/accounts`)
      .then(res => res.json())
      .then(setAccounts)
      .catch(console.error);
  }, []);

  const togglePlatform = (platform: Platform) => {
    if (selectedPlatforms.includes(platform)) {
      onChange(selectedPlatforms.filter(p => p !== platform));
    } else {
      onChange([...selectedPlatforms, platform]);
    }
  };

  const getMinCharacterLimit = () => {
    if (selectedPlatforms.length === 0) return Infinity;
    return Math.min(...selectedPlatforms.map(p => PLATFORM_CONFIG[p].characterLimit));
  };

  const requiresMedia = selectedPlatforms.some(p => PLATFORM_CONFIG[p].requiresMedia);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Select Platforms</label>
        {selectedPlatforms.length > 0 && (
          <span className="text-xs text-gray-500">
            Limit: {getMinCharacterLimit().toLocaleString()} chars
          </span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {accounts.map(account => {
          const isSelected = selectedPlatforms.includes(account.platform);
          const config = PLATFORM_CONFIG[account.platform];
          
          return (
            <button
              key={account.id}
              onClick={() => togglePlatform(account.platform)}
              disabled={!account.is_connected && ['twitter', 'reddit', 'instagram', 'pinterest', 'discord'].includes(account.platform)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all duration-200
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }
                ${!account.is_connected && ['twitter', 'reddit', 'instagram', 'pinterest', 'discord'].includes(account.platform)
                  ? 'opacity-50 cursor-not-allowed' 
                  : ''
                }
              `}
            >
              <PlatformIcon platform={account.platform} size={18} />
              <span className="text-sm font-medium">{config.name}</span>
              {account.is_connected ? (
                <span className="w-2 h-2 bg-green-500 rounded-full ml-1" title="Connected"></span>
              ) : ['twitter', 'reddit', 'instagram', 'pinterest', 'discord'].includes(account.platform) ? (
                <span className="w-2 h-2 bg-gray-400 rounded-full ml-1" title="Not connected"></span>
              ) : null}
              {isSelected && (
                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
      
      {requiresMedia && (
        <p className="text-xs text-orange-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Some platforms require images (Instagram, Pinterest)
        </p>
      )}
    </div>
  );
}
