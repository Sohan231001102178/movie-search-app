import React from 'react';
import MovieCard from './MovieCard';
import { Film, AlertCircle, Search, Sparkles, Database } from 'lucide-react';

/**
 * Responsive poster grid rendering MovieCard items,
 * loading skeletons, and edge-case error states.
 */
export const MovieGrid = ({
  movies = [],
  isLoading = false,
  error = null,
  isFavorite,
  onToggleFavorite,
  onSelectMovie,
  isMockFallback = false
}) => {
  // Loading skeleton placeholder state (10 items matching OMDb page size)
  if (isLoading) {
    return (
      <div className="movie-grid-section">
        <div className="movie-grid">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="movie-card skeleton-card">
              <div className="skeleton-poster shimmer"></div>
              <div className="skeleton-info">
                <div className="skeleton-line shimmer title-line"></div>
                <div className="skeleton-line shimmer subtitle-line"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error / Not Found state
  if (error) {
    return (
      <div className="empty-state-card error-card">
        <div className="empty-icon-wrapper error-icon-bg">
          <AlertCircle size={42} className="text-rose-400" />
        </div>
        <h3 className="empty-title">No Results Found</h3>
        <p className="empty-description">{error}</p>
        <div className="empty-tips">
          <p className="tips-heading">Suggestions:</p>
          <ul>
            <li>Check for spelling errors in your search query</li>
            <li>Try broader keywords (e.g. "Batman", "Spider", "Wars")</li>
            <li>Verify if the content type filter is set to "All Types"</li>
          </ul>
        </div>
      </div>
    );
  }

  // Initial Empty State (e.g. before any search or cleared)
  if (!movies || movies.length === 0) {
    return (
      <div className="empty-state-card welcome-card">
        <div className="empty-icon-wrapper welcome-icon-bg">
          <Film size={46} className="text-indigo-400" />
        </div>
        <h3 className="empty-title">Explore Cinema</h3>
        <p className="empty-description">
          Search over 280,000+ films, television series, and episodes powered by OMDb API.
        </p>
        <div className="welcome-features">
          <span className="feature-pill"><Sparkles size={14} /> 500ms Debouncing</span>
          <span className="feature-pill"><Film size={14} /> Full Ratings & Cast</span>
          <span className="feature-pill"><Database size={14} /> Persistent Favorites</span>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-grid-section">
      {isMockFallback && (
        <div className="mock-notice-pill">
          <Database size={14} />
          <span>Curated Offline Showcase Data (OMDb API limits reached or offline)</span>
        </div>
      )}

      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard
            key={movie.imdbID}
            movie={movie}
            isFavorite={isFavorite(movie.imdbID)}
            onToggleFavorite={onToggleFavorite}
            onSelectMovie={onSelectMovie}
          />
        ))}
      </div>
    </div>
  );
};

export default MovieGrid;
