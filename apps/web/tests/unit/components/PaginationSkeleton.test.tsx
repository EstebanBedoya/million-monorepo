import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PaginationSkeleton } from '@/presentation/components/molecules/PaginationSkeleton';

describe('PaginationSkeleton', () => {
  it('should render with loading status', () => {
    render(<PaginationSkeleton />);
    expect(screen.getByLabelText('Loading pagination')).toBeInTheDocument();
  });

  it('should render loading text for screen readers', () => {
    render(<PaginationSkeleton />);
    expect(screen.getByText('Loading pagination...')).toHaveClass('sr-only');
  });

  it('should apply custom className', () => {
    const { container } = render(<PaginationSkeleton className="custom-class" />);
    const nav = container.querySelector('nav.custom-class');
    expect(nav).toBeInTheDocument();
  });

  it('should render navigation element', () => {
    const { container } = render(<PaginationSkeleton />);
    const nav = container.querySelector('nav');
    expect(nav).toBeInTheDocument();
  });
});

