# CineVault — React Movie Search Application
### Assignment 10: OMDb API Integration, Debouncing Optimization, Pagination, & Persistent Favorites

A cinematic, modern, high-performance React application built according to the official **Architecture & Implementation Guide (Assignment 10)** specifications.

---

## ✨ Key Features & Technical Highlights

1. **Debounced Search Optimization (`useDebounce.js`)**:
   - Immediate input feedback in controlled search bar
   - Custom `useDebounce(searchTerm, 500)` hook delays network API calls until 500ms of user inactivity
   - Visual status badges: `Debouncing...`, `Fetching`, and `Ready`

2. **Full Movie Details & Ratings Modal (`MovieModal.jsx`)**:
   - Detailed lookup via `?i={imdbID}&plot=full`
   - Complete Plot synopsis, Genre tags, Box Office, Awards, and Cast & Crew breakdown
   - Comprehensive Ratings Matrix displaying IMDb star score & votes, Rotten Tomatoes tomato badge, and Metacritic score

3. **Conditional Poster Presentation & Fallbacks (`MovieCard.jsx`)**:
   - Displays high-resolution movie posters with skeleton shimmer animation
   - Conditional fallback element with custom SVG placeholder banner when poster is `"N/A"` or fails to load

4. **State-Driven Multi-Page Pagination (`PaginationBar.jsx`)**:
   - `Math.ceil(totalResults / 10)` state-driven page navigator
   - Smart numbered page buttons, first/last shortcuts, and item count indicators

5. **Persistent Favorites Watchlist (`useFavorites.js` & `FavoritesDrawer.jsx`)**:
   - Add/remove favorites directly with interactive heart bookmark toggle
   - Adheres to **Persistent Favorites Rule**: all saved items contain at least `imdbID`, `Title`, `Year`, and `Poster`
   - Persisted across reloads in `localStorage`
   - Slide-over drawer with instant search within favorites, quick delete, and clear all

6. **OMDb REST API & Resilient Fallback Engine (`omdbService.js`)**:
   - Axios client with base URL & API key parameter injection
   - Handles OMDb 200 HTTP response with `{ Response: "False", Error: "Movie not found!" }`
   - Built-in curated offline fallback database ensures the application works smoothly even offline or when hitting daily API quotas

---

## 📂 Project Architecture

```
src/
├── api/
│   └── omdbService.js        # Axios client with base URL & API key parameter injection
├── hooks/
│   ├── useDebounce.js        # Delays search term updates until typing stops
│   └── useFavorites.js       # Manages localStorage sync and toggle actions
├── components/
│   ├── SearchInput.jsx       # Controlled input bar with clear icon and status indicator
│   ├── MovieGrid.jsx         # Responsive poster grid rendering MovieCard items
│   ├── MovieCard.jsx         # Poster, title, year, bookmark/favorite button
│   ├── MovieModal.jsx        # Detailed overlay: plot, full ratings table, cast, crew
│   ├── PaginationBar.jsx     # Prev/Next controls, total count, current page indicators
│   ├── FavoritesDrawer.jsx   # Side drawer or filtered view of bookmarked movies
│   ├── ApiKeyModal.jsx       # In-app OMDb API key switcher & test dialog
│   ├── ArchitectureModal.jsx # Visual blueprint and rubric walkthrough
│   └── Navbar.jsx            # Header navigation & counters
├── data/
│   └── mockMovies.js         # Curated offline fallback records
├── App.jsx                   # Core coordination: active tab, debounced state, dialogs
├── main.jsx                  # Root render container
└── index.css                 # Cinema glassmorphism design system
```

---

## 🚀 Getting Started

### 1. Run Development Server
```bash
npm run dev
```
The app will be accessible at `http://localhost:3000`.

### 2. Build for Production
```bash
npm run build
```

### 3. API Key Configuration
You can configure your key in `.env`:
```env
VITE_OMDB_API_KEY=your_key_here
```
Or click the **Key** button in the app navigation bar to set a custom key dynamically at runtime!
