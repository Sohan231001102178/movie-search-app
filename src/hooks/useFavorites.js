import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'cinevault_omdb_favorites';

/**
 * Manages favorites collection persisted in localStorage.
 * Ensures all saved favorite items contain at least imdbID, Title, Year, and Poster.
 */
export const useFavorites = () => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error('Failed to load favorites from localStorage:', err);
      return [];
    }
  });

  // Keep localStorage in sync whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (err) {
      console.error('Failed to save favorites to localStorage:', err);
    }
  }, [favorites]);

  /**
   * Check if a movie is bookmarked as favorite
   */
  const isFavorite = useCallback(
    (imdbID) => {
      if (!imdbID) return false;
      return favorites.some((item) => item.imdbID === imdbID);
    },
    [favorites]
  );

  /**
   * Toggle movie favorite state.
   * Enforces Persistent Favorites Rule:
   * "Ensure all favorites objects contain at least imdbID, Title, Year, and Poster
   * so the favorites gallery can render offline without repeated API calls."
   */
  const toggleFavorite = useCallback((movie) => {
    if (!movie || !movie.imdbID) return;

    setFavorites((prev) => {
      const exists = prev.some((item) => item.imdbID === movie.imdbID);
      if (exists) {
        return prev.filter((item) => item.imdbID !== movie.imdbID);
      } else {
        // Guarantee minimal offline schema
        const normalizedItem = {
          imdbID: movie.imdbID,
          Title: movie.Title || 'Unknown Title',
          Year: movie.Year || 'N/A',
          Poster: movie.Poster || 'N/A',
          Type: movie.Type || 'movie',
          Genre: movie.Genre || '',
          imdbRating: movie.imdbRating || ''
        };
        return [normalizedItem, ...prev];
      }
    });
  }, []);

  /**
   * Remove a specific movie by imdbID
   */
  const removeFavorite = useCallback((imdbID) => {
    setFavorites((prev) => prev.filter((item) => item.imdbID !== imdbID));
  }, []);

  /**
   * Clear all favorites
   */
  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearFavorites,
    count: favorites.length
  };
};

export default useFavorites;
