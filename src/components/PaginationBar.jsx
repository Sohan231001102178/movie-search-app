import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

/**
 * State-driven pagination bar.
 * Calculates total pages from totalResults / 10 and renders
 * Prev/Next controls, item counters, and smart numbered page indicators.
 */
export const PaginationBar = ({
  currentPage = 1,
  totalResults = 0,
  pageSize = 10,
  onPageChange
}) => {
  const count = parseInt(totalResults, 10) || 0;
  const totalPages = Math.ceil(count / pageSize);

  // If there are no results or only 1 page, hide pagination
  if (totalPages <= 1) return null;

  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, count);

  // Generate page numbers with ellipses for long lists
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2; // Number of pages before and after current
    const left = currentPage - delta;
    const right = currentPage + delta + 1;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i < right)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  const handlePageClick = (page) => {
    if (page === '...' || page === currentPage) return;
    onPageChange(page);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <nav className="pagination-bar" aria-label="Movie search pagination">
      <div className="pagination-info">
        Showing <span className="highlight">{startRecord}</span>–
        <span className="highlight">{endRecord}</span> of{' '}
        <span className="highlight">{count.toLocaleString()}</span> results
      </div>

      <div className="pagination-controls">
        {/* First Page Button */}
        <button
          type="button"
          className="page-nav-btn"
          onClick={() => handlePageClick(1)}
          disabled={currentPage === 1}
          aria-label="First page"
          title="Go to first page"
        >
          <ChevronsLeft size={16} />
        </button>

        {/* Previous Button */}
        <button
          type="button"
          className="page-nav-btn text-nav-btn"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
          <span>Prev</span>
        </button>

        {/* Page Numbers */}
        <div className="page-numbers-list">
          {getPageNumbers().map((page, idx) =>
            page === '...' ? (
              <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
                …
              </span>
            ) : (
              <button
                key={`page-${page}`}
                type="button"
                className={`page-num-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageClick(page)}
                aria-current={currentPage === page ? 'page' : undefined}
                aria-label={`Page ${page}`}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* Next Button */}
        <button
          type="button"
          className="page-nav-btn text-nav-btn"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </button>

        {/* Last Page Button */}
        <button
          type="button"
          className="page-nav-btn"
          onClick={() => handlePageClick(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Last page"
          title="Go to last page"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </nav>
  );
};

export default PaginationBar;
