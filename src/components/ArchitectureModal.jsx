import React from 'react';
import { X, BookOpen, Layers, Zap, Database, ShieldAlert, Cpu } from 'lucide-react';

export const ArchitectureModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container arch-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="arch-header">
          <div className="arch-icon-wrapper">
            <BookOpen size={26} className="text-indigo-400" />
          </div>
          <div>
            <span className="arch-badge">Architecture Guide</span>
            <h3 className="arch-title">Architecture & Implementation Blueprint</h3>
          </div>
        </div>

        <div className="arch-content">
          <div className="arch-section">
            <h4 className="arch-section-title">
              <Zap size={16} className="text-amber-400" /> 1. Debounced Search Optimization
            </h4>
            <p>
              To conserve limited OMDb API quotas and prevent network flooding on every keystroke, raw user input is stored in immediate state and processed via <code>useDebounce(searchTerm, 500)</code>. The API query <code>useEffect</code> listens solely to the debounced output.
            </p>
          </div>

          <div className="arch-section">
            <h4 className="arch-section-title">
              <Layers size={16} className="text-cyan-400" /> 2. Component Architecture Tree
            </h4>
            <div className="code-block-view">
              <pre>{`src/
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
│   └── FavoritesDrawer.jsx   # Side drawer or filtered view of bookmarked movies
├── App.jsx                   # Core coordination: active tab, debounced state, dialogs
└── main.jsx                  # Root render container`}</pre>
            </div>
          </div>

          <div className="arch-section">
            <h4 className="arch-section-title">
              <ShieldAlert size={16} className="text-rose-400" /> 3. Error Handling & Edge Cases
            </h4>
            <p>
              OMDb returns <code>{`{ Response: "False", Error: "Movie not found!" }`}</code> with an HTTP 200 OK status instead of standard 404 HTTP errors. Our custom Axios client verifies <code>data.Response === "True"</code> before reading the results array.
            </p>
          </div>

          <div className="arch-section">
            <h4 className="arch-section-title">
              <Database size={16} className="text-emerald-400" /> 4. Persistent Favorites Rule
            </h4>
            <p>
              Ensures all favorite objects strictly maintain at least <code>imdbID</code>, <code>Title</code>, <code>Year</code>, and <code>Poster</code> so the saved gallery can render offline instantly without repeated API lookups.
            </p>
          </div>
        </div>

        <div className="arch-footer">
          <button type="button" className="save-btn" onClick={onClose}>
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureModal;
