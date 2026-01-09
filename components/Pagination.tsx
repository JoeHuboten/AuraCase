'use client';

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: Record<string, string>;
}

export default function Pagination({ currentPage, totalPages, baseUrl, searchParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const showEllipsis = totalPages > 7;
    
    if (!showEllipsis) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('ellipsis');
      }
      
      // Pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Pagination">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={buildUrl(currentPage - 1)}
          className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-700 hover:border-accent text-text-secondary hover:text-accent transition-all"
          aria-label="Previous page"
        >
          <FiChevronLeft size={18} />
          <span className="hidden sm:inline">Previous</span>
        </Link>
      ) : (
        <button
          disabled
          className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-800 text-gray-600 cursor-not-allowed"
          aria-label="Previous page (disabled)"
        >
          <FiChevronLeft size={18} />
          <span className="hidden sm:inline">Previous</span>
        </button>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <span key={`ellipsis-${index}`} className="px-3 py-2 text-text-secondary">
                ...
              </span>
            );
          }

          const isActive = page === currentPage;
          
          return (
            <Link
              key={page}
              href={buildUrl(page)}
              className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg font-medium transition-all ${
                isActive
                  ? 'bg-accent text-white shadow-lg shadow-accent/30'
                  : 'border border-gray-700 text-text-secondary hover:border-accent hover:text-accent'
              }`}
              aria-label={`Page ${page}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {page}
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={buildUrl(currentPage + 1)}
          className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-700 hover:border-accent text-text-secondary hover:text-accent transition-all"
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <FiChevronRight size={18} />
        </Link>
      ) : (
        <button
          disabled
          className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-800 text-gray-600 cursor-not-allowed"
          aria-label="Next page (disabled)"
        >
          <span className="hidden sm:inline">Next</span>
          <FiChevronRight size={18} />
        </button>
      )}
    </nav>
  );
}
