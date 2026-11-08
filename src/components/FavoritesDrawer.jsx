import React, { useState } from 'react';
import {
  X,
  Heart,
  Trash2,
  Film,
  Search,
  ExternalLink,
  BookmarkCheck,
  HardDrive
} from 'lucide-react';

/**
 * Slide-over side drawer displaying bookmarked movies persisted in localStorage.
 * Includes instant search within favorites, quick removal, and details inspection.
 */
export const FavoritesDrawer = ({
  isOpen,
  onClose,
  favorites = [],
  onRemoveFavorite,
  onSelectMovie,
  onClearAll
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  if (!isOpen) return null;

  const filteredFavorites = favorites.filter((m) =>
    m.Title.toLowerCase().includes(filterQuery.toLowerCase()) ||
    (m.Year && m.Year.includes(filterQuery))
  );

  return (
    <div className="drawer-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <div className="drawer-title-row">
              <Heart size={20} className="text-rose-400" fill="currentColor" />
              <h2 className="drawer-title">Saved Collection</h2>
              <span className="drawer-count-badge">{favorites.length}</span>
            </div>
            <p className="drawer-subtitle">
              Persisted in <code>localStorage</code> for offline review
            </p>
          </div>

          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close favorites drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search within favorites */}
        {favorites.length > 0 && (
          <div className="drawer-search-box">
            <Search size={14} className="drawer-search-icon" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter your saved collection..."
              className="drawer-search-input"
            />
            {filterQuery && (
              <button
                type="button"
                className="drawer-search-clear"
                onClick={() => setFilterQuery('')}
              >
                <X size={12} />
              </button>
            )}
          </div>
        )}

        {/* Drawer Body */}
        <div className="drawer-body">
          {favorites.length === 0 ? (
            <div className="drawer-empty-state">
              <div className="empty-icon-circle">
                <Heart size={36} className="text-slate-600" />
              </div>
              <h4>No Movies Saved Yet</h4>
              <p>
                Browse through search results and tap the heart icon on any movie card to add it to your personal watchlist.
              </p>
            </div>
          ) : filteredFavorites.length === 0 ? (
            <div className="drawer-no-match">
              <Search size={28} className="text-slate-500" />
              <p>No saved titles match "{filterQuery}"</p>
            </div>
          ) : (
            <div className="drawer-cards-list">
              {filteredFavorites.map((item) => {
                const hasPoster = item.Poster && item.Poster !== 'N/A';
                return (
                  <div
                    key={item.imdbID}
                    className="drawer-movie-item"
                    onClick={() => {
                      onSelectMovie(item.imdbID);
                    }}
                  >
                    <div className="drawer-thumb-wrap">
                      {hasPoster ? (
                        <img
                          src={item.Poster}
                          alt={item.Title}
                          className="drawer-thumb"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className="drawer-thumb-fallback"
                        style={{ display: hasPoster ? 'none' : 'flex' }}
                      >
                        <Film size={16} />
                      </div>
                    </div>

                    <div className="drawer-movie-details">
                      <h4 className="drawer-movie-title" title={item.Title}>
                        {item.Title}
                      </h4>
                      <div className="drawer-movie-meta">
                        <span className="drawer-meta-pill">{item.Year}</span>
                        {item.Type && (
                          <span className="drawer-type-pill">{item.Type.toUpperCase()}</span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="drawer-remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFavorite(item.imdbID);
                      }}
                      title="Remove from collection"
                      aria-label={`Remove ${item.Title} from collection`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        {favorites.length > 0 && (
          <div className="drawer-footer">
            <div className="storage-indicator">
              <HardDrive size={13} className="text-emerald-400" />
              <span>Offline Ready</span>
            </div>
            <button
              type="button"
              className="drawer-clear-all-btn"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all saved movies?')) {
                  onClearAll();
                }
              }}
            >
              Clear All ({favorites.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesDrawer;
