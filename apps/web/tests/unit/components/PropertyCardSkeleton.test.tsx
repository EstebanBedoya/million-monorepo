import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PropertyCardSkeleton, PropertyListSkeleton } from '@/presentation/components/molecules/PropertyCardSkeleton';

describe('PropertyCardSkeleton', () => {
  it('should render skeleton with loading status', () => {
    render(<PropertyCardSkeleton />);
    expect(screen.getByLabelText('Loading property')).toBeInTheDocument();
  });

  it('should render loading text for screen readers', () => {
    render(<PropertyCardSkeleton />);
    expect(screen.getByText('Loading...')).toHaveClass('sr-only');
  });

  it('should apply custom className', () => {
    const { container } = render(<PropertyCardSkeleton className="custom-class" />);
    const card = container.querySelector('.custom-class');
    expect(card).toBeInTheDocument();
  });

  it('should have animation pulse class', () => {
    const { container } = render(<PropertyCardSkeleton />);
    const card = container.querySelector('.animate-pulse');
    expect(card).toBeInTheDocument();
  });
});

describe('PropertyListSkeleton', () => {
  it('should render 12 skeleton cards by default', () => {
    render(<PropertyListSkeleton />);
    const skeletons = screen.getAllByText('Loading...');
    expect(skeletons).toHaveLength(12);
  });

  it('should render custom count of skeleton cards', () => {
    render(<PropertyListSkeleton count={5} />);
    const skeletons = screen.getAllByText('Loading...');
    expect(skeletons).toHaveLength(5);
  });

  it('should apply custom className to container', () => {
    const { container } = render(<PropertyListSkeleton className="custom-grid" />);
    const grid = container.querySelector('.custom-grid');
    expect(grid).toBeInTheDocument();
  });

  it('should render in grid layout', () => {
    const { container } = render(<PropertyListSkeleton count={3} />);
    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
  });
});

