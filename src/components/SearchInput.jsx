import React from 'react';
import { Search, X, Loader2, Film, Sparkles, Filter } from 'lucide-react';

/**
 * Controlled search input bar with debounce status indicator,
 * clear action, type filter, and trending suggestions.
 */
export const SearchInput = ({
  searchTerm,
  onSearchChange,
  onClear,
  isDebouncing,
  isLoading,
  selectedType,
  onTypeChange,
  onSelectSuggestion
}) => {
  const suggestions = [
    'Deadpool',
    'Dune 2',
    'Oppenheimer',
    'The Batman',
    'Inside Out 2',
    'Gladiator II',
    'Spider-Man',
    'Arcane'
  ];

  return (
    <div className="search-section">
      <div className="search-bar-wrapper">
        <div className="search-input-container">
          <Search className="search-icon" size={20} />
          
          <input
            type="text"
            className="search-input"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search movies, series, franchises... (e.g., Inception, Batman)"
            autoComplete="off"
            spellCheck="false"
          />

          {/* Right-side status indicator & clear button */}
          <div className="search-actions">
            {isLoading ? (
              <span className="status-badge status-loading" title="Fetching results from OMDb API">
                <Loader2 size={15} className="spin-icon" />
                <span className="status-text">Fetching</span>
              </span>
            ) : isDebouncing ? (
              <span className="status-badge status-debouncing" title="Debounce timer active (500ms)">
                <span className="pulse-dot"></span>
                <span className="status-text">Debouncing...</span>
              </span>
            ) : searchTerm ? (
              <span className="status-badge status-ready" title="Debounced query synced">
                <span className="ready-dot"></span>
                <span className="status-text">Ready</span>
              </span>
            ) : null}

            {searchTerm && (
              <button
                type="button"
                className="clear-btn"
                onClick={onClear}
                title="Clear search"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Type Filter Select */}
        <div className="filter-wrapper">
          <Filter size={15} className="filter-icon" />
          <select
            className="type-select"
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            aria-label="Filter by content type"
          >
            <option value="">All Types</option>
            <option value="movie">Movies</option>
            <option value="series">TV Series</option>
            <option value="episode">Episodes</option>
          </select>
        </div>
      </div>

      {/* Suggested Quick Search Tags */}
      <div className="suggestions-container">
        <span className="suggestions-label">
          <Sparkles size={13} className="sparkle-icon" /> Trending:
        </span>
        <div className="suggestions-list">
          {suggestions.map((item) => (
            <button
              key={item}
              type="button"
              className={`suggestion-chip ${searchTerm.toLowerCase() === item.toLowerCase() ? 'active' : ''}`}
              onClick={() => onSelectSuggestion(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
