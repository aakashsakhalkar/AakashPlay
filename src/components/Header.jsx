import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  RefreshCw, 
  Sun, 
  Moon, 
  Sparkles
} from 'lucide-react';
import { GithubIcon, AakashPlayLogo } from './Icons';

export function Header({ 
  searchQuery, 
  setSearchQuery, 
  theme, 
  toggleTheme, 
  isRefreshing, 
  onRefresh, 
  lastUpdated, 
  totalCount
}) {
  const storeName = import.meta.env.VITE_STORE_NAME || 'AakashPlay';
  const developerGithub = import.meta.env.VITE_DEVELOPER_GITHUB || 'https://github.com/aakashsakhalkar';
  const [timeAgoText, setTimeAgoText] = useState('Syncing...');

  useEffect(() => {
    const updateTimeAgo = () => {
      if (!lastUpdated) return;
      const seconds = Math.floor((Date.now() - new Date(lastUpdated).getTime()) / 1000);
      if (seconds < 10) setTimeAgoText('Live');
      else if (seconds < 60) setTimeAgoText(`${seconds}s ago`);
      else setTimeAgoText(`${Math.floor(seconds / 60)}m ago`);
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 5000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  return (
    <header className="store-header">
      <div className="header-content">
        {/* Brand Logo with A-Play Monogram */}
        <div className="brand-wrapper" onClick={() => setSearchQuery('')}>
          <AakashPlayLogo size={40} />
          <div className="brand-title">
            {storeName}
            <span className="brand-badge-clay">OFFICIAL</span>
          </div>
        </div>

        {/* Clay 3D Search Bar */}
        <div className="search-container">
          <div className="search-input-clay">
            <Search size={20} color="var(--text-muted)" />
            <input
              type="text"
              className="search-input"
              placeholder={`Search ${totalCount || 30}+ apps, APKs, tools & libraries...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--text-muted)' }}
                title="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Live Realtime Firebase Status */}
          <div 
            className="clay-live-pill" 
            onClick={onRefresh} 
            title={`Connected to Firebase Realtime DB (Sync: ${timeAgoText})`}
          >
            <span className="clay-pulse-dot"></span>
            <span>{isRefreshing ? 'Syncing...' : `Live (${timeAgoText})`}</span>
            <RefreshCw size={13} className={isRefreshing ? 'spin' : ''} style={{ marginLeft: 3 }} />
          </div>

          {/* Theme Toggle Button */}
          <button 
            className="clay-btn-icon" 
            onClick={toggleTheme} 
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={20} color="#f59e0b" /> : <Moon size={20} color="#8b5cf6" />}
          </button>

          {/* Developer Github Link */}
          <a 
            href={developerGithub} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="clay-btn-icon" 
            title="Developer GitHub Profile"
          >
            <GithubIcon size={20} />
          </a>
        </div>
      </div>
    </header>
  );
}
