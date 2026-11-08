import React, { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './hooks/useDebounce';
import { useFavorites } from './hooks/useFavorites';
import { searchMovies } from './api/omdbService';
import Navbar from './components/Navbar';
import SearchInput from './components/SearchInput';
import MovieGrid from './components/MovieGrid';
import PaginationBar from './components/PaginationBar';
import MovieModal from './components/MovieModal';
import FavoritesDrawer from './components/FavoritesDrawer';
import ApiKeyModal from './components/ApiKeyModal';
import ArchitectureModal from './components/ArchitectureModal';
import { Film, Sparkles, Compass } from 'lucide-react';

export function App() {
  // Raw immediate input text state (empty defaults to full curated new movies showcase)
  const [searchTerm, setSearchTerm] = useState('');
  // Type filter: '' (All), 'movie', 'series', 'episode'
  const [selectedType, setSelectedType] = useState('');
  // Current page number for OMDb pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Debounced search term hook (500ms delay)
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Status flags
  const isDebouncing = searchTerm.trim() !== debouncedSearchTerm.trim();
  const [isLoading, setIsLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState(null);
  const [isMockFallback, setIsMockFallback] = useState(false);

  // Modal dialog states
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isArchModalOpen, setIsArchModalOpen] = useState(false);

  // Persistent Favorites Custom Hook
  const {
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearFavorites,
    count: favoritesCount
  } = useFavorites();

  // Reset pagination to page 1 whenever search query or type changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedType]);

  // Execute API query strictly attached to debounced output to conserve API calls
  const fetchSearchResults = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await searchMovies(debouncedSearchTerm, currentPage, selectedType);

      // Verify data.Response === "True" before accessing results array
      if (data.Response === 'True') {
        setMovies(data.Search || []);
        setTotalResults(parseInt(data.totalResults, 10) || 0);
        setIsMockFallback(Boolean(data.isMockFallback));
        setError(null);
      } else {
        setMovies([]);
        setTotalResults(0);
        setIsMockFallback(false);
        setError(data.Error || 'Movie not found!');
      }
    } catch (err) {
      setMovies([]);
      setTotalResults(0);
      setError(err.message || 'An unexpected error occurred while fetching movies.');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, currentPage, selectedType]);

  useEffect(() => {
    fetchSearchResults();
  }, [fetchSearchResults]);

  // Open movie details modal
  const handleOpenMovie = (imdbID) => {
    setSelectedMovieId(imdbID);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovieId(null);
  };

  return (
    <div className="app-layout">
      {/* Top Navigation Bar */}
      <Navbar
        favoritesCount={favoritesCount}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenArchModal={() => setIsArchModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="main-container">
        {/* Hero Section */}
        <section className="hero-banner">
          <div className="hero-glow"></div>
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={14} className="text-amber-400" />
              <span>React • OMDb REST API Engine</span>
            </div>
            <h2 className="hero-title">
              Discover Cinematic <span className="gradient-text">Masterpieces</span>
            </h2>
            <p className="hero-description">
              Debounced client-side queries, detailed ratings breakdown, persistent favorites, and responsive page navigation.
            </p>
          </div>

          {/* Controlled Search Bar */}
          <SearchInput
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onClear={() => setSearchTerm('')}
            isDebouncing={isDebouncing}
            isLoading={isLoading}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            onSelectSuggestion={(term) => setSearchTerm(term)}
          />
        </section>

        {/* Results Section */}
        <section className="results-section">
          <div className="results-header">
            <h3 className="results-title">
              {isLoading ? (
                'Fetching movies...'
              ) : debouncedSearchTerm ? (
                <>
                  Results for <span className="query-highlight">"{debouncedSearchTerm}"</span>
                  {totalResults > 0 && <span className="count-pill">{totalResults} found</span>}
                </>
              ) : (
                <>
                  <span>Popular Blockbusters & Curated Movies</span>
                  {totalResults > 0 && <span className="count-pill">{totalResults} titles</span>}
                </>
              )}
            </h3>
          </div>

          {/* Movie Grid */}
          <MovieGrid
            movies={movies}
            isLoading={isLoading}
            error={error}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            onSelectMovie={handleOpenMovie}
            isMockFallback={isMockFallback}
          />

          {/* State-driven Pagination Navigator */}
          {!isLoading && !error && movies.length > 0 && (
            <PaginationBar
              currentPage={currentPage}
              totalResults={totalResults}
              pageSize={10}
              onPageChange={setCurrentPage}
            />
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-left">
            <Film size={18} className="text-indigo-400" />
            <span>CineVault — React Movie Search Application</span>
          </div>
          <div className="footer-right">
            <span>OMDb REST API Integration • React.js</span>
          </div>
        </div>
      </footer>

      {/* Movie Details Modal Overlay */}
      <MovieModal
        imdbID={selectedMovieId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
      />

      {/* Bookmarked Favorites Side Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onRemoveFavorite={removeFavorite}
        onSelectMovie={(id) => {
          setIsFavoritesOpen(false);
          handleOpenMovie(id);
        }}
        onClearAll={clearFavorites}
      />

      {/* OMDb API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeyUpdated={() => fetchSearchResults()}
      />

      {/* Architecture & Implementation Guide Modal */}
      <ArchitectureModal
        isOpen={isArchModalOpen}
        onClose={() => setIsArchModalOpen(false)}
      />
    </div>
  );
}

export default App;
