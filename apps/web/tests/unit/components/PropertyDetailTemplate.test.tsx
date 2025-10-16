import { render, screen } from '@testing-library/react';
import { PropertyDetailTemplate } from '../../../src/presentation/components/templates/PropertyDetailTemplate';
import { MockPropertyType } from '../../../src/domain/schemas/property.schema';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('PropertyDetailTemplate', () => {
  const mockProperty: MockPropertyType = {
    id: 'prop-789',
    idOwner: 'owner-002',
    name: 'Luxury Penthouse',
    address: '789 Park Avenue',
    city: 'New York',
    price: 8500000,
    image: 'https://example.com/penthouse.jpg',
    bedrooms: 4,
    bathrooms: 3,
    area: 300,
    areaUnit: 'm²',
    propertyType: 'Apartment',
  };

  const mockOnBack = jest.fn();

  beforeEach(() => {
    mockOnBack.mockClear();
  });

  it('should render property details correctly', () => {
    render(<PropertyDetailTemplate property={mockProperty} onBack={mockOnBack} />);

    expect(screen.getByRole('heading', { name: 'Luxury Penthouse' })).toBeInTheDocument();
    expect(screen.getAllByText('$8,500,000').length).toBeGreaterThan(0);
    expect(screen.getAllByText('New York').length).toBeGreaterThan(0);
    expect(screen.getAllByText('789 Park Avenue').length).toBeGreaterThan(0);
  });

  it('should render breadcrumbs', () => {
    render(<PropertyDetailTemplate property={mockProperty} onBack={mockOnBack} />);

    const breadcrumb = screen.getByRole('navigation', { name: /Breadcrumb/i });
    expect(breadcrumb).toBeInTheDocument();
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Properties')).toBeInTheDocument();
  });

  it('should render back button', () => {
    render(<PropertyDetailTemplate property={mockProperty} onBack={mockOnBack} />);

    const backButton = screen.getByRole('button', { name: /Go back to properties list/i });
    expect(backButton).toBeInTheDocument();
  });

  it('should call onBack when back button is clicked', () => {
    render(<PropertyDetailTemplate property={mockProperty} onBack={mockOnBack} />);

    const backButton = screen.getByRole('button', { name: /Go back to properties list/i });
    backButton.click();

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('should render property type badge', () => {
    render(<PropertyDetailTemplate property={mockProperty} onBack={mockOnBack} />);

    const badges = screen.getAllByText('Apartment');
    expect(badges.length).toBeGreaterThan(0);
  });

  it('should render contact and schedule buttons', () => {
    render(<PropertyDetailTemplate property={mockProperty} onBack={mockOnBack} />);

    expect(screen.getByRole('button', { name: /Contact about this property/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Schedule a viewing/i })).toBeInTheDocument();
  });

  it('should render property details section', () => {
    render(<PropertyDetailTemplate property={mockProperty} onBack={mockOnBack} />);

    expect(screen.getByText('Property Details')).toBeInTheDocument();
    expect(screen.getByText('Property ID')).toBeInTheDocument();
    expect(screen.getByText('prop-789')).toBeInTheDocument();
  });

  it('should render description section', () => {
    render(<PropertyDetailTemplate property={mockProperty} onBack={mockOnBack} />);

    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('should match snapshot with full property data', () => {
    const { container } = render(
      <PropertyDetailTemplate property={mockProperty} onBack={mockOnBack} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with minimal property data', () => {
    const minimalProperty: MockPropertyType = {
      id: 'prop-minimal',
      idOwner: 'owner-003',
      name: 'Simple House',
      address: '123 Simple St',
      city: 'Simple City',
      price: 250000,
      image: 'https://example.com/simple.jpg',
    };

    const { container } = render(
      <PropertyDetailTemplate property={minimalProperty} onBack={mockOnBack} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render without property type', () => {
    const propertyWithoutType: MockPropertyType = {
      ...mockProperty,
      propertyType: undefined,
    };

    render(<PropertyDetailTemplate property={propertyWithoutType} onBack={mockOnBack} />);

    expect(screen.getByRole('heading', { name: 'Luxury Penthouse' })).toBeInTheDocument();
  });

  it('should render property details in sidebar', () => {
    render(<PropertyDetailTemplate property={mockProperty} onBack={mockOnBack} />);

    const priceElements = screen.getAllByText('$8,500,000');
    expect(priceElements.length).toBeGreaterThan(0);
  });
});

