import React from 'react';
import { Film, Heart, Key, BookOpen, Sparkles } from 'lucide-react';
import { getActiveApiKey } from '../api/omdbService';

export const Navbar = ({
  favoritesCount = 0,
  onOpenFavorites,
  onOpenApiKeyModal,
  onOpenArchModal
}) => {
  const currentKey = getActiveApiKey();
  const maskedKey = currentKey ? `${currentKey.substring(0, 3)}...` : 'Not Set';

  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Logo and Brand */}
        <div className="brand-group">
          <div className="brand-logo-glow">
            <Film size={26} className="brand-icon" />
          </div>
          <div className="brand-text-block">
            <div className="brand-name-row">
              <h1 className="brand-title">CINEVAULT</h1>
            </div>
            <span className="brand-subtitle">OMDb Exploration & Discovery Engine</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="header-actions">
          {/* Architecture & Spec Guide Button */}
          <button
            type="button"
            className="header-action-btn"
            onClick={onOpenArchModal}
            title="View Architecture & Specifications Guide"
          >
            <BookOpen size={16} />
            <span className="btn-label-desktop">Architecture Guide</span>
          </button>

          {/* API Key Modal Button */}
          <button
            type="button"
            className="header-action-btn api-btn"
            onClick={onOpenApiKeyModal}
            title="Configure OMDb API Key"
          >
            <Key size={16} className="text-amber-400" />
            <span className="btn-label-desktop">Key: {maskedKey}</span>
          </button>

          {/* Favorites Drawer Toggle */}
          <button
            type="button"
            className="header-action-btn favorites-header-btn"
            onClick={onOpenFavorites}
            title="Open Saved Favorites"
            aria-label={`Open Saved Favorites (${favoritesCount} saved)`}
          >
            <Heart size={16} className="text-rose-400" fill={favoritesCount > 0 ? 'currentColor' : 'none'} />
            <span className="btn-label-desktop">Favorites</span>
            <span className="header-counter-badge">{favoritesCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
