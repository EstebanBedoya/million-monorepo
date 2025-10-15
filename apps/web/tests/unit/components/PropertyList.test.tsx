import { render, screen } from '@testing-library/react';
import { PropertyList } from '../../../src/presentation/components/PropertyList';
import { MockPropertyType } from '../../../src/domain/schemas/property.schema';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('PropertyList', () => {
  const mockProperties: MockPropertyType[] = [
    {
      id: 'prop-001',
      idOwner: 'owner-001',
      name: 'Modern Villa',
      address: '123 Main St',
      city: 'Los Angeles',
      price: 1000000,
      image: 'https://example.com/villa.jpg',
      bedrooms: 4,
      bathrooms: 3,
      area: 200,
      areaUnit: 'm²',
      propertyType: 'Villa',
    },
    {
      id: 'prop-002',
      idOwner: 'owner-002',
      name: 'Downtown Apartment',
      address: '456 Oak Ave',
      city: 'New York',
      price: 500000,
      image: 'https://example.com/apartment.jpg',
      bedrooms: 2,
      bathrooms: 1,
      area: 85,
      areaUnit: 'm²',
      propertyType: 'Apartment',
    },
  ];

  it('should render list of properties', () => {
    render(<PropertyList properties={mockProperties} />);

    expect(screen.getByText('Modern Villa')).toBeInTheDocument();
    expect(screen.getByText('Downtown Apartment')).toBeInTheDocument();
    expect(screen.getByText('$1,000,000')).toBeInTheDocument();
    expect(screen.getByText('$500,000')).toBeInTheDocument();
  });

  it('should render loading skeletons when loading is true', () => {
    render(<PropertyList properties={[]} loading={true} />);

    const loadingElements = screen.getAllByLabelText('Loading property');
    expect(loadingElements.length).toBe(12); // Default skeleton count
  });

  it('should render empty state when no properties and not loading', () => {
    render(<PropertyList properties={[]} loading={false} />);

    expect(screen.getByText('No Properties Found')).toBeInTheDocument();
  });

  it('should call onClearFilters when empty state button is clicked', () => {
    const mockOnClearFilters = jest.fn();
    render(<PropertyList properties={[]} loading={false} onClearFilters={mockOnClearFilters} />);

    const clearButton = screen.getByRole('button', { name: /Clear all filters/i });
    clearButton.click();

    expect(mockOnClearFilters).toHaveBeenCalledTimes(1);
  });

  it('should have proper grid layout', () => {
    const { container } = render(<PropertyList properties={mockProperties} />);

    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4');
  });

  it('should match snapshot', () => {
    const { container } = render(<PropertyList properties={mockProperties} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

