import { render, screen } from '@testing-library/react';
import { PropertyList } from '../../../src/presentation/components/PropertyList';
import { Property, PropertyType, PropertyStatus, AreaUnit } from '../../../src/domain/entities/Property';

// Mock property data
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Beautiful Apartment',
    description: 'A beautiful apartment in the city center',
    price: 250000,
    currency: 'USD',
    location: {
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      getFullAddress: () => '123 Main St, New York, NY, USA',
    },
    propertyType: PropertyType.APARTMENT,
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    areaUnit: AreaUnit.M2,
    features: ['Parking', 'Balcony'],
    images: ['image1.jpg'],
    status: PropertyStatus.AVAILABLE,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    isAvailable: () => true,
    isExpensive: () => false,
    getFormattedPrice: () => 'USD 250,000',
  },
  {
    id: '2',
    title: 'Luxury House',
    description: 'A luxury house with garden',
    price: 500000,
    currency: 'USD',
    location: {
      address: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      getFullAddress: () => '456 Oak Ave, Los Angeles, CA, USA',
    },
    propertyType: PropertyType.HOUSE,
    bedrooms: 4,
    bathrooms: 3,
    area: 200,
    areaUnit: AreaUnit.M2,
    features: ['Garden', 'Pool', 'Garage'],
    images: ['image2.jpg'],
    status: PropertyStatus.SOLD,
    createdAt: new Date('2023-01-02'),
    updatedAt: new Date('2023-01-02'),
    isAvailable: () => false,
    isExpensive: () => true,
    getFormattedPrice: () => 'USD 500,000',
  },
] as Property[];

describe('PropertyList', () => {
  it('should render properties correctly', () => {
    render(<PropertyList properties={mockProperties} />);

    expect(screen.getByText('Beautiful Apartment')).toBeInTheDocument();
    expect(screen.getByText('Luxury House')).toBeInTheDocument();
    expect(screen.getByText('USD 250,000')).toBeInTheDocument();
    expect(screen.getByText('USD 500,000')).toBeInTheDocument();
  });

  it('should render loading skeleton when loading is true', () => {
    render(<PropertyList properties={[]} loading={true} />);

    // Should render 6 skeleton loading cards
    const skeletonCards = screen.getAllByRole('generic');
    expect(skeletonCards).toHaveLength(6);
    
    // Check for loading animation classes
    skeletonCards.forEach(card => {
      expect(card).toHaveClass('animate-pulse', 'bg-gray-200');
    });
  });

  it('should render empty state when no properties', () => {
    render(<PropertyList properties={[]} loading={false} />);

    expect(screen.getByText('No properties found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search criteria')).toBeInTheDocument();
  });

  it('should render empty state when properties array is empty and loading is false', () => {
    render(<PropertyList properties={[]} />);

    expect(screen.getByText('No properties found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search criteria')).toBeInTheDocument();
  });

  it('should not render empty state when loading is true', () => {
    render(<PropertyList properties={[]} loading={true} />);

    expect(screen.queryByText('No properties found')).not.toBeInTheDocument();
    expect(screen.queryByText('Try adjusting your search criteria')).not.toBeInTheDocument();
  });

  it('should pass onPropertyClick to PropertyCard components', () => {
    const mockOnPropertyClick = jest.fn();
    render(<PropertyList properties={mockProperties} onPropertyClick={mockOnPropertyClick} />);

    // Check that PropertyCard components are rendered with the callback
    expect(screen.getByText('Beautiful Apartment')).toBeInTheDocument();
    expect(screen.getByText('Luxury House')).toBeInTheDocument();
  });

  it('should render correct grid layout classes', () => {
    const { container } = render(<PropertyList properties={mockProperties} />);
    
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass(
      'grid-cols-1',
      'md:grid-cols-2',
      'lg:grid-cols-3',
      'gap-6'
    );
  });

  it('should render loading skeleton with correct grid layout', () => {
    const { container } = render(<PropertyList properties={[]} loading={true} />);
    
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass(
      'grid-cols-1',
      'md:grid-cols-2',
      'lg:grid-cols-3',
      'gap-6'
    );
  });

  it('should render empty state with correct styling', () => {
    render(<PropertyList properties={[]} />);

    const emptyStateContainer = screen.getByText('No properties found').closest('div');
    expect(emptyStateContainer).toHaveClass('text-center', 'py-12');
    
    const titleElement = screen.getByText('No properties found');
    expect(titleElement).toHaveClass('text-gray-500', 'text-lg', 'mb-4');
    
    const subtitleElement = screen.getByText('Try adjusting your search criteria');
    expect(subtitleElement).toHaveClass('text-gray-400');
  });

  it('should render skeleton cards with correct styling', () => {
    render(<PropertyList properties={[]} loading={true} />);

    const skeletonCards = screen.getAllByRole('generic');
    skeletonCards.forEach(card => {
      expect(card).toHaveClass(
        'bg-gray-200',
        'animate-pulse',
        'rounded-lg',
        'h-80'
      );
    });
  });

  it('should handle single property correctly', () => {
    const singleProperty = [mockProperties[0]];
    render(<PropertyList properties={singleProperty} />);

    expect(screen.getByText('Beautiful Apartment')).toBeInTheDocument();
    expect(screen.queryByText('Luxury House')).not.toBeInTheDocument();
  });

  it('should render all properties when multiple properties provided', () => {
    render(<PropertyList properties={mockProperties} />);

    expect(screen.getByText('Beautiful Apartment')).toBeInTheDocument();
    expect(screen.getByText('Luxury House')).toBeInTheDocument();
    expect(screen.getByText('USD 250,000')).toBeInTheDocument();
    expect(screen.getByText('USD 500,000')).toBeInTheDocument();
  });

  it('should not render loading skeleton when loading is false', () => {
    render(<PropertyList properties={mockProperties} loading={false} />);

    const skeletonCards = screen.queryAllByRole('generic');
    expect(skeletonCards).toHaveLength(0);
  });

  it('should not render loading skeleton when loading is undefined', () => {
    render(<PropertyList properties={mockProperties} />);

    const skeletonCards = screen.queryAllByRole('generic');
    expect(skeletonCards).toHaveLength(0);
  });
});
