import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '@/components/Pagination';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe('Pagination', () => {
  it('should not render when totalPages is 1', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} baseUrl="/shop" />
    );
    expect(container.querySelector('nav')).toBeNull();
  });

  it('should render pagination when totalPages > 1', () => {
    render(
      <Pagination currentPage={1} totalPages={5} baseUrl="/shop" />
    );
    expect(screen.getByRole('navigation', { name: /pagination/i })).toBeTruthy();
  });

  it('should show correct page numbers', () => {
    render(
      <Pagination currentPage={3} totalPages={5} baseUrl="/shop" />
    );
    
    // Should show pages 1-5 since totalPages <= 7
    // Links have aria-label="Page N"
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByRole('link', { name: `Page ${i}` })).toBeTruthy();
    }
  });

  it('should highlight current page with aria-current', () => {
    render(
      <Pagination currentPage={3} totalPages={5} baseUrl="/shop" />
    );
    
    const currentPageLink = screen.getByRole('link', { name: 'Page 3' });
    expect(currentPageLink.getAttribute('aria-current')).toBe('page');
  });

  it('should disable previous button on first page', () => {
    render(
      <Pagination currentPage={1} totalPages={5} baseUrl="/shop" />
    );
    
    const prevButton = screen.getByRole('button', { name: /previous page \(disabled\)/i });
    expect(prevButton).toBeTruthy();
    expect(prevButton).toBeDisabled();
  });

  it('should disable next button on last page', () => {
    render(
      <Pagination currentPage={5} totalPages={5} baseUrl="/shop" />
    );
    
    const nextButton = screen.getByRole('button', { name: /next page \(disabled\)/i });
    expect(nextButton).toBeTruthy();
    expect(nextButton).toBeDisabled();
  });

  it('should include search params in links', () => {
    render(
      <Pagination 
        currentPage={2} 
        totalPages={5} 
        baseUrl="/shop" 
        searchParams={{ category: 'phones', sort: 'price-low' }}
      />
    );
    
    const page3Link = screen.getByRole('link', { name: 'Page 3' });
    expect(page3Link.getAttribute('href')).toContain('page=3');
    expect(page3Link.getAttribute('href')).toContain('category=phones');
    expect(page3Link.getAttribute('href')).toContain('sort=price-low');
  });

  it('should show ellipsis for large page counts', () => {
    render(
      <Pagination currentPage={5} totalPages={10} baseUrl="/shop" />
    );
    
    // Should show first page, ellipsis, pages around current, ellipsis, last page
    const ellipses = screen.getAllByText('...');
    expect(ellipses.length).toBeGreaterThanOrEqual(1);
  });
});
