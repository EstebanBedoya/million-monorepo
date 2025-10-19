import { render, screen } from '@testing-library/react';
import { PropertyDetailSkeleton } from '../../../src/presentation/components/molecules/PropertyDetailSkeleton';

describe('PropertyDetailSkeleton', () => {
  it('should render skeleton elements', () => {
    render(<PropertyDetailSkeleton />);

    // Check for loading status elements
    const loadingElements = screen.getAllByRole('status');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('should render back button skeleton', () => {
    render(<PropertyDetailSkeleton />);

    // The back button skeleton should be present
    const loadingElements = screen.getAllByRole('status');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('should render breadcrumbs skeleton', () => {
    render(<PropertyDetailSkeleton />);

    // Multiple skeleton elements for breadcrumbs
    const loadingElements = screen.getAllByRole('status');
    expect(loadingElements.length).toBeGreaterThan(5);
  });

  it('should render main content skeleton', () => {
    render(<PropertyDetailSkeleton />);

    // Should have skeleton for hero image, title, price, etc.
    const loadingElements = screen.getAllByRole('status');
    expect(loadingElements.length).toBeGreaterThan(10);
  });

  it('should render sidebar skeleton', () => {
    render(<PropertyDetailSkeleton />);

    // Should have skeleton for sidebar content
    const loadingElements = screen.getAllByRole('status');
    expect(loadingElements.length).toBeGreaterThan(15);
  });

  it('should have proper accessibility attributes', () => {
    render(<PropertyDetailSkeleton />);

    const loadingElements = screen.getAllByRole('status');
    loadingElements.forEach(element => {
      expect(element).toHaveAttribute('aria-label', 'Loading...');
    });
  });

  it('should match snapshot', () => {
    const { container } = render(<PropertyDetailSkeleton />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
