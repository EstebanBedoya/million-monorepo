import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PropertyList } from '@/presentation/components/PropertyList';
import { MockPropertyType } from '@/domain/schemas/property.schema';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/en/properties',
  useSearchParams: () => new URLSearchParams(),
}));

const mockProperties: MockPropertyType[] = [
  {
    id: '1',
    name: 'Test Property 1',
    description: 'Test description',
    price: 100000,
    currency: 'USD',
    location: 'Test Location',
    propertyType: 'house',
    area: 100,
    areaUnit: 'm2',
    features: ['feature1'],
    images: ['image1.jpg'],
    status: 'available',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Test Property 2',
    description: 'Test description 2',
    price: 200000,
    currency: 'USD',
    location: 'Test Location 2',
    propertyType: 'apartment',
    area: 80,
    areaUnit: 'm2',
    features: ['feature2'],
    images: ['image2.jpg'],
    status: 'available',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

describe('PropertyList', () => {
  it('should render property cards when properties are provided', async () => {
    render(<PropertyList properties={mockProperties} />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Property 1')).toBeInTheDocument();
      expect(screen.getByText('Test Property 2')).toBeInTheDocument();
    });
  });

  it('should render loading skeletons when loading is true', async () => {
    render(<PropertyList properties={[]} loading={true} />);
    
    await waitFor(() => {
      const skeletons = screen.getAllByRole('status');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  it('should render error state when error is provided', async () => {
    const error = new Error('Test error');
    const onRetry = jest.fn();
    render(<PropertyList properties={[]} error={error} onRetry={onRetry} />);
    
    await waitFor(() => {
      const retryButton = screen.getByText('Retry');
      expect(retryButton).toBeInTheDocument();
    });
  });

  it('should render empty state when no properties and not loading', async () => {
    render(<PropertyList properties={[]} />);
    
    await waitFor(() => {
      expect(screen.getByText("We couldn't find any properties matching your criteria")).toBeInTheDocument();
    });
  });

  it('should call onRetry when retry button is clicked in error state', async () => {
    const onRetry = jest.fn();
    render(<PropertyList properties={[]} error="Error" onRetry={onRetry} />);
    
    await waitFor(() => {
      const retryButton = screen.getByText('Retry');
      retryButton.click();
      expect(onRetry).toHaveBeenCalled();
    });
  });

  it('should render empty state when no properties', async () => {
    render(<PropertyList properties={[]} />);
    
    await waitFor(() => {
      expect(screen.getByText("We couldn't find any properties matching your criteria")).toBeInTheDocument();
    });
  });

});

