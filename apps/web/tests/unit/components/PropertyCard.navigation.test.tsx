import { render, screen, fireEvent } from '@testing-library/react';
import { PropertyCard } from '../../../src/presentation/components/organisms/PropertyCard';
import { MockPropertyType } from '../../../src/domain/schemas/property.schema';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('PropertyCard - Navigation', () => {
  const mockProperty: MockPropertyType = {
    id: 'prop-123',
    idOwner: 'owner-001',
    name: 'Test Property',
    address: '123 Test St',
    city: 'Test City',
    price: 500000,
    image: 'https://example.com/image.jpg',
    bedrooms: 3,
    bathrooms: 2,
    area: 100,
    areaUnit: 'm²',
    propertyType: 'House',
  };

  beforeEach(() => {
    mockPush.mockClear();
  });

  it('should navigate to property detail page when View Details is clicked', () => {
    render(<PropertyCard property={mockProperty} />);
    
    const button = screen.getByRole('button', { name: /View details Test Property/i });
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith('/en/properties/prop-123');
  });

  it('should call onViewDetails callback instead of navigation when provided', () => {
    const onViewDetails = jest.fn();
    render(<PropertyCard property={mockProperty} onViewDetails={onViewDetails} />);
    
    const button = screen.getByRole('button', { name: /View details Test Property/i });
    fireEvent.click(button);

    expect(onViewDetails).toHaveBeenCalledWith(mockProperty);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should navigate with correct property ID', () => {
    const propertyWithDifferentId = { ...mockProperty, id: 'different-id' };
    render(<PropertyCard property={propertyWithDifferentId} />);
    
    const button = screen.getByRole('button', { name: /View details/i });
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith('/en/properties/different-id');
  });
});

