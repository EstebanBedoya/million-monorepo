import { render, screen } from '@testing-library/react';
import { PropertyCard } from '../../../src/presentation/components/PropertyCard';
import { MockPropertyType } from '../../../src/domain/schemas/property.schema';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('PropertyCard', () => {
  const mockProperty: MockPropertyType = {
    id: 'prop-001',
    idOwner: 'owner-001',
    name: 'Modern Luxury Villa',
    address: '1247 Sunset Boulevard',
    city: 'Los Angeles',
    price: 2800000,
    image: 'https://example.com/image.jpg',
    bedrooms: 5,
    bathrooms: 4,
    area: 84,
    areaUnit: 'm²',
    propertyType: 'Villa',
  };

  it('should render property information correctly', () => {
    render(<PropertyCard property={mockProperty} />);

    expect(screen.getByText('Modern Luxury Villa')).toBeInTheDocument();
    expect(screen.getByText('$2,800,000')).toBeInTheDocument();
    expect(screen.getByText('Los Angeles')).toBeInTheDocument();
    expect(screen.getByText('1247 Sunset Boulevard')).toBeInTheDocument();
  });

  it('should display property details when available', () => {
    render(<PropertyCard property={mockProperty} />);

    // Check for bedrooms, bathrooms, and area with more specific selectors
    expect(screen.getByTitle('5 Bedrooms')).toBeInTheDocument();
    expect(screen.getByTitle('4 Bathrooms')).toBeInTheDocument();
    expect(screen.getByTitle('84 m²')).toBeInTheDocument();
  });

  it('should render without optional fields', () => {
    const minimalProperty: MockPropertyType = {
      id: 'prop-002',
      idOwner: 'owner-002',
      name: 'Simple Apartment',
      address: '123 Main St',
      city: 'New York',
      price: 500000,
      image: 'https://example.com/apt.jpg',
    };

    render(<PropertyCard property={minimalProperty} />);

    expect(screen.getByText('Simple Apartment')).toBeInTheDocument();
    expect(screen.getByText('$500,000')).toBeInTheDocument();
  });

  it('should display property type badge when available', () => {
    render(<PropertyCard property={mockProperty} />);

    expect(screen.getByText('Villa')).toBeInTheDocument();
  });

  it('should call onViewDetails when button is clicked', () => {
    const handleViewDetails = jest.fn();
    render(<PropertyCard property={mockProperty} onViewDetails={handleViewDetails} />);

    const button = screen.getByRole('button', { name: /View details for Modern Luxury Villa/i });
    button.click();

    expect(handleViewDetails).toHaveBeenCalledWith(mockProperty);
  });

  it('should not render View Details button when onViewDetails is not provided', () => {
    render(<PropertyCard property={mockProperty} />);

    const button = screen.queryByRole('button', { name: /View details/i });
    expect(button).not.toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(<PropertyCard property={mockProperty} />);

    const article = screen.getByRole('article');
    expect(article).toBeInTheDocument();

    const image = screen.getByAltText('Modern Luxury Villa');
    expect(image).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = render(<PropertyCard property={mockProperty} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
