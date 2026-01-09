import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminPagination from '@/components/admin/AdminPagination';

describe('AdminPagination', () => {
  const mockOnPageChange = vi.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it('should not render when totalPages is 1', () => {
    const { container } = render(
      <AdminPagination 
        currentPage={1} 
        totalPages={1} 
        total={5} 
        limit={20} 
        onPageChange={mockOnPageChange} 
      />
    );
    expect(container.querySelector('nav')).toBeNull();
  });

  it('should render pagination controls when totalPages > 1', () => {
    render(
      <AdminPagination 
        currentPage={1} 
        totalPages={3} 
        total={50} 
        limit={20} 
        onPageChange={mockOnPageChange} 
      />
    );
    expect(screen.getByRole('navigation', { name: /pagination/i })).toBeTruthy();
  });

  it('should show correct range text', () => {
    render(
      <AdminPagination 
        currentPage={2} 
        totalPages={3} 
        total={50} 
        limit={20} 
        onPageChange={mockOnPageChange} 
      />
    );
    
    // Page 2: items 21-40 of 50
    expect(screen.getByText('21')).toBeTruthy();
    expect(screen.getByText('40')).toBeTruthy();
    expect(screen.getByText('50')).toBeTruthy();
  });

  it('should show correct range text for last page', () => {
    render(
      <AdminPagination 
        currentPage={3} 
        totalPages={3} 
        total={50} 
        limit={20} 
        onPageChange={mockOnPageChange} 
      />
    );
    
    // Page 3: items 41-50 of 50
    expect(screen.getByText('41')).toBeTruthy();
    // "50" appears twice (end of range and total), use getAllByText
    expect(screen.getAllByText('50').length).toBe(2);
  });

  it('should call onPageChange when clicking page number', () => {
    render(
      <AdminPagination 
        currentPage={1} 
        totalPages={5} 
        total={100} 
        limit={20} 
        onPageChange={mockOnPageChange} 
      />
    );
    
    const page3Button = screen.getByRole('button', { name: 'Page 3' });
    fireEvent.click(page3Button);
    
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('should call onPageChange when clicking next button', () => {
    render(
      <AdminPagination 
        currentPage={2} 
        totalPages={5} 
        total={100} 
        limit={20} 
        onPageChange={mockOnPageChange} 
      />
    );
    
    const nextButton = screen.getByRole('button', { name: /next page/i });
    fireEvent.click(nextButton);
    
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('should call onPageChange when clicking previous button', () => {
    render(
      <AdminPagination 
        currentPage={2} 
        totalPages={5} 
        total={100} 
        limit={20} 
        onPageChange={mockOnPageChange} 
      />
    );
    
    const prevButton = screen.getByRole('button', { name: /previous page/i });
    fireEvent.click(prevButton);
    
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it('should disable previous button on first page', () => {
    render(
      <AdminPagination 
        currentPage={1} 
        totalPages={5} 
        total={100} 
        limit={20} 
        onPageChange={mockOnPageChange} 
      />
    );
    
    const prevButton = screen.getByRole('button', { name: /previous page/i });
    expect(prevButton).toBeDisabled();
  });

  it('should disable next button on last page', () => {
    render(
      <AdminPagination 
        currentPage={5} 
        totalPages={5} 
        total={100} 
        limit={20} 
        onPageChange={mockOnPageChange} 
      />
    );
    
    const nextButton = screen.getByRole('button', { name: /next page/i });
    expect(nextButton).toBeDisabled();
  });
});
