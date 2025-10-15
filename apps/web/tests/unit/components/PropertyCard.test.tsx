import { render, screen, fireEvent } from '@testing-library/react';
import { PropertyCard } from '../../../src/presentation/components/PropertyCard';
import { Property, PropertyType, PropertyStatus, AreaUnit } from '../../../src/domain/entities/Property';

// Mock property data
const mockProperty: Property = {
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
  features: ['Parking', 'Balcony', 'Gym', 'Pool'],
  images: ['image1.jpg', 'image2.jpg'],
  status: PropertyStatus.AVAILABLE,
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
  isAvailable: () => true,
  isExpensive: () => false,
  getFormattedPrice: () => 'USD 250,000',
} as Property;

describe('PropertyCard', () => {
  it('should render property information correctly', () => {
    render(<PropertyCard property={mockProperty} />);

    expect(screen.getByText('Beautiful Apartment')).toBeInTheDocument();
    expect(screen.getByText('A beautiful apartment in the city center')).toBeInTheDocument();
    expect(screen.getByText('123 Main St, New York, NY, USA')).toBeInTheDocument();
    expect(screen.getByText('USD 250,000')).toBeInTheDocument();
    expect(screen.getByText('available')).toBeInTheDocument();
  });

  it('should display property details correctly', () => {
    render(<PropertyCard property={mockProperty} />);

    expect(screen.getByText('2 bedrooms')).toBeInTheDocument();
    expect(screen.getByText('1 bathrooms')).toBeInTheDocument();
    expect(screen.getByText('85 m2')).toBeInTheDocument();
  });

  it('should display features correctly', () => {
    render(<PropertyCard property={mockProperty} />);

    expect(screen.getByText('Parking')).toBeInTheDocument();
    expect(screen.getByText('Balcony')).toBeInTheDocument();
    expect(screen.getByText('Gym')).toBeInTheDocument();
    expect(screen.getByText('+1 more')).toBeInTheDocument(); // 4 features, showing 3 + "1 more"
  });

  it('should show "View Details" button when onViewDetails is provided', () => {
    const mockOnViewDetails = jest.fn();
    render(<PropertyCard property={mockProperty} onViewDetails={mockOnViewDetails} />);

    const viewDetailsButton = screen.getByText('View Details');
    expect(viewDetailsButton).toBeInTheDocument();
    expect(viewDetailsButton).toHaveClass('w-full', 'bg-blue-600', 'text-white');
  });

  it('should not show "View Details" button when onViewDetails is not provided', () => {
    render(<PropertyCard property={mockProperty} />);

    expect(screen.queryByText('View Details')).not.toBeInTheDocument();
  });

  it('should call onViewDetails when "View Details" button is clicked', () => {
    const mockOnViewDetails = jest.fn();
    render(<PropertyCard property={mockProperty} onViewDetails={mockOnViewDetails} />);

    const viewDetailsButton = screen.getByText('View Details');
    fireEvent.click(viewDetailsButton);

    expect(mockOnViewDetails).toHaveBeenCalledTimes(1);
    expect(mockOnViewDetails).toHaveBeenCalledWith(mockProperty);
  });

  it('should display correct status styling for available property', () => {
    render(<PropertyCard property={mockProperty} />);

    const statusElement = screen.getByText('available');
    expect(statusElement).toHaveClass('bg-green-100', 'text-green-800');
  });

  it('should display correct status styling for sold property', () => {
    const soldProperty = {
      ...mockProperty,
      status: PropertyStatus.SOLD,
      isAvailable: () => false,
    };

    render(<PropertyCard property={soldProperty} />);

    const statusElement = screen.getByText('sold');
    expect(statusElement).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('should handle property without bedrooms and bathrooms', () => {
    const propertyWithoutRooms = {
      ...mockProperty,
      bedrooms: undefined,
      bathrooms: undefined,
    };

    render(<PropertyCard property={propertyWithoutRooms} />);

    expect(screen.queryByText(/bedrooms/)).not.toBeInTheDocument();
    expect(screen.queryByText(/bathrooms/)).not.toBeInTheDocument();
    expect(screen.getByText('85 m2')).toBeInTheDocument();
  });

  it('should handle property with many features', () => {
    const propertyWithManyFeatures = {
      ...mockProperty,
      features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5', 'Feature 6'],
    };

    render(<PropertyCard property={propertyWithManyFeatures} />);

    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Feature 2')).toBeInTheDocument();
    expect(screen.getByText('Feature 3')).toBeInTheDocument();
    expect(screen.getByText('+3 more')).toBeInTheDocument(); // 6 features, showing 3 + "3 more"
  });

  it('should handle property with no features', () => {
    const propertyWithNoFeatures = {
      ...mockProperty,
      features: [],
    };

    render(<PropertyCard property={propertyWithNoFeatures} />);

    expect(screen.queryByText(/more/)).not.toBeInTheDocument();
  });

  it('should have correct CSS classes for card styling', () => {
    render(<PropertyCard property={mockProperty} />);

    const cardElement = screen.getByText('Beautiful Apartment').closest('div');
    expect(cardElement).toHaveClass(
      'bg-white',
      'rounded-lg',
      'shadow-md',
      'p-6',
      'border',
      'border-gray-200',
      'hover:shadow-lg',
      'transition-shadow'
    );
  });

  it('should display price with correct styling', () => {
    render(<PropertyCard property={mockProperty} />);

    const priceElement = screen.getByText('USD 250,000');
    expect(priceElement).toHaveClass('text-2xl', 'font-bold', 'text-green-600');
  });

  it('should display property title with correct styling', () => {
    render(<PropertyCard property={mockProperty} />);

    const titleElement = screen.getByText('Beautiful Apartment');
    expect(titleElement).toHaveClass('text-xl', 'font-semibold', 'text-gray-900');
  });
});
