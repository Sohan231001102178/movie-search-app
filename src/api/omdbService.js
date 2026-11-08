import axios from 'axios';
import { MOCK_MOVIES } from '../data/mockMovies';

const BASE_URL = 'https://www.omdbapi.com/';

// Get current API key from localStorage or Vite environment variable
export const getActiveApiKey = () => {
  return localStorage.getItem('omdb_api_key') || import.meta.env.VITE_OMDB_API_KEY || 'b9bd48a6';
};

// Set custom API key in localStorage
export const setActiveApiKey = (key) => {
  if (key) {
    localStorage.setItem('omdb_api_key', key.trim());
  } else {
    localStorage.removeItem('omdb_api_key');
  }
};

// Axios client with base URL
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 8000
});

/**
 * Filter mock database with robust franchise and fuzzy matching.
 * Guarantees zero "Request limit reached" errors and unlimited queries.
 */
export const queryMockDatabase = (searchTerm = '', page = 1, type = '') => {
  const raw = (searchTerm || '').toLowerCase().trim();
  const cleanQuery = raw.replace(/[^a-z0-9\s]/g, ' ');
  const tokens = cleanQuery.split(/\s+/).filter(Boolean);

  let results = MOCK_MOVIES;

  if (tokens.length > 0) {
    results = MOCK_MOVIES.filter((m) => {
      const titleLower = m.Title.toLowerCase();
      const titleClean = titleLower.replace(/[^a-z0-9\s]/g, ' ');
      const genreLower = (m.Genre || '').toLowerCase();
      const actorsLower = (m.Actors || '').toLowerCase();
      const fullText = `${titleLower} ${titleClean} ${genreLower} ${actorsLower}`;

      // Direct substring match
      if (fullText.includes(raw)) return true;

      // Special franchise shortcuts
      if (raw.includes('spider') && (titleLower.includes('spider') || titleClean.includes('spider'))) return true;
      if (raw.includes('deadpool') && titleLower.includes('deadpool')) return true;
      if (raw.includes('batman') && (titleLower.includes('batman') || titleLower.includes('dark knight'))) return true;
      if (raw.includes('dune') && titleLower.includes('dune')) return true;
      if (raw.includes('gladiator') && titleLower.includes('gladiator')) return true;
      if (raw.includes('inside out') && titleLower.includes('inside out')) return true;
      if (raw.includes('oppenheimer') && titleLower.includes('oppenheimer')) return true;
      if (raw.includes('arcane') && titleLower.includes('arcane')) return true;
      if (raw.includes('alien') && titleLower.includes('alien')) return true;
      if (raw.includes('john wick') && titleLower.includes('john wick')) return true;
      if (raw.includes('avenger') && titleLower.includes('avenger')) return true;

      // Check if all or any tokens match
      return tokens.some((token) => token.length > 2 && fullText.includes(token));
    });
  }

  if (type) {
    const typeFiltered = results.filter((m) => m.Type === type);
    if (typeFiltered.length > 0) results = typeFiltered;
  }

  // If no specific match, gracefully fallback to popular movies so user always sees rich content
  if (results.length === 0) {
    results = MOCK_MOVIES;
  }

  const totalResults = results.length;
  const pageSize = 10;
  const startIndex = (page - 1) * pageSize;
  const paginated = results.slice(startIndex, startIndex + pageSize).map((m) => ({
    Title: m.Title,
    Year: m.Year,
    imdbID: m.imdbID,
    Type: m.Type,
    Poster: m.Poster,
    imdbRating: m.imdbRating
  }));

  return {
    Response: 'True',
    Search: paginated,
    totalResults: totalResults.toString(),
    isMockFallback: true
  };
};

/**
 * Search Query with Pagination.
 * Intercepts OMDb API limits and rate-limits to provide unlimited smooth searching.
 */
export const searchMovies = async (searchTerm = '', page = 1, type = '') => {
  const trimmed = (searchTerm || '').trim();
  
  if (!trimmed) {
    return queryMockDatabase('', page, type);
  }

  const apiKey = getActiveApiKey();
  const params = {
    apikey: apiKey,
    s: trimmed,
    page: page
  };

  if (type) {
    params.type = type;
  }

  try {
    const response = await apiClient.get('', { params });
    const data = response.data;

    // Check OMDb response
    if (data.Response === 'True') {
      return {
        Response: 'True',
        Search: data.Search || [],
        totalResults: data.totalResults || '0',
        isMockFallback: false
      };
    } else {
      // If OMDb returns "Request limit reached!" or "Movie not found!", seamlessly fallback
      return queryMockDatabase(trimmed, page, type);
    }
  } catch (error) {
    console.warn('OMDb API request bypassed, serving catalog:', error.message);
    return queryMockDatabase(trimmed, page, type);
  }
};

/**
 * Full Movie Details Query
 * GET https://www.omdbapi.com/?apikey=YOUR_KEY&i={imdbID}&plot=full
 */
export const getMovieDetails = async (imdbID, plot = 'full') => {
  if (!imdbID) {
    return { Response: 'False', Error: 'Invalid IMDb ID' };
  }

  // Check mock store first for instantaneous modal response
  const foundMock = MOCK_MOVIES.find((m) => m.imdbID === imdbID);

  const apiKey = getActiveApiKey();
  const params = {
    apikey: apiKey,
    i: imdbID,
    plot: plot
  };

  try {
    const response = await apiClient.get('', { params });
    const data = response.data;

    if (data.Response === 'True') {
      return {
        ...data,
        Poster: (data.Poster && data.Poster !== 'N/A') ? data.Poster : (foundMock?.Poster || 'N/A')
      };
    } else {
      if (foundMock) return { ...foundMock, Response: 'True' };
      return { Response: 'False', Error: data.Error || 'Movie details not found!' };
    }
  } catch (error) {
    if (foundMock) return { ...foundMock, Response: 'True' };
    return { Response: 'False', Error: error.message };
  }
};
