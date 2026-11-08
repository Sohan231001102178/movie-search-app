import React, { useEffect, useState } from 'react';
import { getMovieDetails } from '../api/omdbService';
import { MOCK_MOVIES } from '../data/mockMovies';
import {
  X,
  Star,
  Heart,
  Clock,
  Calendar,
  Award,
  Globe,
  DollarSign,
  Film,
  ExternalLink,
  Users,
  UserCheck,
  Clapperboard,
  Loader2,
  AlertTriangle
} from 'lucide-react';

/**
 * Detailed overlay modal presenting full plot, cast, crew,
 * and comprehensive ratings table (IMDb, Metacritic, Rotten Tomatoes).
 */
export const MovieModal = ({
  imdbID,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite
}) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [posterError, setPosterError] = useState(false);

  useEffect(() => {
    if (!isOpen || !imdbID) {
      setMovie(null);
      setError(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);
    setPosterError(false);

    getMovieDetails(imdbID, 'full')
      .then((data) => {
        if (!isMounted) return;
        if (data && data.Response === 'True') {
          setMovie(data);
        } else {
          setError(data?.Error || 'Failed to load movie details');
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || 'Error fetching movie details');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [imdbID, isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Rating badge helpers
  const getRatingSourceColor = (source) => {
    if (source.includes('Internet Movie')) return 'rating-imdb';
    if (source.includes('Rotten Tomatoes')) return 'rating-rotten';
    if (source.includes('Metacritic')) return 'rating-metacritic';
    return 'rating-generic';
  };

  const matchedMock = movie ? MOCK_MOVIES.find((m) => m.imdbID === movie.imdbID || m.Title.toLowerCase() === movie.Title.toLowerCase()) : null;
  const posterUrl = (movie?.Poster && movie.Poster !== 'N/A' && !posterError) ? movie.Poster : (matchedMock?.Poster || 'N/A');
  const hasValidPoster = posterUrl && posterUrl !== 'N/A';
  const isFav = movie ? isFavorite(movie.imdbID) : false;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {loading ? (
          <div className="modal-loading-state">
            <Loader2 size={38} className="spin-icon text-indigo-400" />
            <p>Fetching full movie details from OMDb...</p>
          </div>
        ) : error ? (
          <div className="modal-error-state">
            <AlertTriangle size={36} className="text-amber-400" />
            <h3>Unable to Load Movie Details</h3>
            <p>{error}</p>
            <button type="button" className="retry-btn" onClick={onClose}>
              Close
            </button>
          </div>
        ) : movie ? (
          <div className="modal-content">
            {/* Top Banner / Poster & Main Title */}
            <div className="modal-hero">
              <div className="modal-poster-col">
                {hasValidPoster ? (
                  <img
                    src={posterUrl}
                    alt={movie.Title}
                    className="modal-poster"
                    onError={() => setPosterError(true)}
                  />
                ) : (
                  <div className="modal-poster-placeholder">
                    <Film size={44} className="placeholder-icon" />
                    <span>No Poster</span>
                  </div>
                )}
              </div>

              <div className="modal-header-info">
                <div className="modal-title-row">
                  <h2 className="modal-title">{movie.Title}</h2>
                  <button
                    type="button"
                    className={`modal-fav-btn ${isFav ? 'active' : ''}`}
                    onClick={() => onToggleFavorite(movie)}
                    title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
                    <span>{isFav ? 'Favorited' : 'Bookmark'}</span>
                  </button>
                </div>

                {/* Subheader Metadata Chips */}
                <div className="modal-meta-pills">
                  {movie.Year && (
                    <span className="meta-pill">
                      <Calendar size={13} /> {movie.Year}
                    </span>
                  )}
                  {movie.Rated && movie.Rated !== 'N/A' && (
                    <span className="meta-pill pill-rated">{movie.Rated}</span>
                  )}
                  {movie.Runtime && movie.Runtime !== 'N/A' && (
                    <span className="meta-pill">
                      <Clock size={13} /> {movie.Runtime}
                    </span>
                  )}
                  {movie.Type && (
                    <span className="meta-pill pill-type">{movie.Type.toUpperCase()}</span>
                  )}
                </div>

                {/* Genre Tags */}
                {movie.Genre && movie.Genre !== 'N/A' && (
                  <div className="genre-tag-list">
                    {movie.Genre.split(',').map((g) => (
                      <span key={g.trim()} className="genre-tag">
                        {g.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Synopsis / Plot */}
                <div className="modal-synopsis">
                  <h4 className="section-label">Plot Synopsis</h4>
                  <p className="plot-text">
                    {movie.Plot && movie.Plot !== 'N/A'
                      ? movie.Plot
                      : 'No detailed plot summary is currently available.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Ratings Grid (IMDb, Metacritic, Rotten Tomatoes) */}
            <div className="modal-section ratings-section">
              <h4 className="section-label">Ratings & Scores</h4>
              <div className="ratings-grid">
                {/* Primary IMDb Rating */}
                <div className="rating-card card-imdb">
                  <div className="rating-source-title">
                    <Star size={16} className="star-icon" fill="currentColor" />
                    <span>IMDb Score</span>
                  </div>
                  <div className="rating-score">
                    {movie.imdbRating !== 'N/A' ? `${movie.imdbRating}/10` : 'N/A'}
                  </div>
                  <div className="rating-votes">
                    {movie.imdbVotes !== 'N/A' ? `${movie.imdbVotes} votes` : ''}
                  </div>
                </div>

                {/* Ratings from OMDb Ratings Array (Rotten Tomatoes, Metacritic, etc.) */}
                {movie.Ratings && movie.Ratings.length > 0 ? (
                  movie.Ratings.map((rating) => (
                    <div
                      key={rating.Source}
                      className={`rating-card ${getRatingSourceColor(rating.Source)}`}
                    >
                      <div className="rating-source-title">
                        <span>{rating.Source}</span>
                      </div>
                      <div className="rating-score">{rating.Value}</div>
                      <div className="rating-sub">Verified Critic Consensus</div>
                    </div>
                  ))
                ) : (
                  <div className="rating-card">
                    <span className="rating-source-title">Metascore</span>
                    <div className="rating-score">{movie.Metascore || 'N/A'}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Cast & Crew Section */}
            <div className="modal-section">
              <h4 className="section-label">Cast & Filmmakers</h4>
              <div className="crew-grid">
                <div className="crew-item">
                  <span className="crew-label">
                    <Clapperboard size={14} /> Director:
                  </span>
                  <span className="crew-value">{movie.Director || 'N/A'}</span>
                </div>
                <div className="crew-item">
                  <span className="crew-label">
                    <UserCheck size={14} /> Writer(s):
                  </span>
                  <span className="crew-value">{movie.Writer || 'N/A'}</span>
                </div>
                <div className="crew-item cast-span">
                  <span className="crew-label">
                    <Users size={14} /> Starring:
                  </span>
                  <span className="crew-value">{movie.Actors || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Additional Production Details */}
            <div className="modal-section extra-details-section">
              <div className="extra-details-grid">
                {movie.Awards && movie.Awards !== 'N/A' && (
                  <div className="detail-item">
                    <Award size={16} className="text-amber-400" />
                    <div>
                      <span className="detail-title">Awards & Honors</span>
                      <p className="detail-desc">{movie.Awards}</p>
                    </div>
                  </div>
                )}

                {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
                  <div className="detail-item">
                    <DollarSign size={16} className="text-emerald-400" />
                    <div>
                      <span className="detail-title">Box Office</span>
                      <p className="detail-desc">{movie.BoxOffice}</p>
                    </div>
                  </div>
                )}

                {movie.Language && movie.Language !== 'N/A' && (
                  <div className="detail-item">
                    <Globe size={16} className="text-cyan-400" />
                    <div>
                      <span className="detail-title">Languages</span>
                      <p className="detail-desc">{movie.Language}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer with external link */}
            <div className="modal-footer">
              <a
                href={`https://www.imdb.com/title/${movie.imdbID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="imdb-link-btn"
              >
                <span>View Full Page on IMDb</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MovieModal;
