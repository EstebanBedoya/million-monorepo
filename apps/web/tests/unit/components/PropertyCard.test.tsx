import { render, screen } from '@testing-library/react';
import { PropertyCard } from '../../../src/presentation/components/organisms/PropertyCard';
import { MockPropertyType } from '../../../src/domain/schemas/property.schema';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: { src: string; alt: string; [key: string]: unknown }) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('PropertyCard', () => {
  const mockProperty: MockPropertyType = {
    id: 'prop-123',
    idOwner: 'owner-001',
    name: 'Beautiful Villa',
    address: '123 Main St',
    city: 'Miami',
    price: 500000,
    image: 'https://example.com/image.jpg',
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    areaUnit: 'm²',
    propertyType: 'Villa',
  };

  it('should render property name', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('Beautiful Villa')).toBeInTheDocument();
  });

  it('should render property price', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('$500,000')).toBeInTheDocument();
  });

  it('should render property location', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('123 Main St, Miami')).toBeInTheDocument();
  });

  it('should render property type badge', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('Villa')).toBeInTheDocument();
  });

  it('should render property details (bedrooms, bathrooms, area)', () => {
    const { container } = render(<PropertyCard property={mockProperty} />);
    // Check that the property details are rendered somewhere in the component
    expect(container.textContent).toContain('3');
    expect(container.textContent).toContain('2');
    expect(container.textContent).toContain('150');
  });

  it('should render property image', () => {
    render(<PropertyCard property={mockProperty} />);
    const image = screen.getByAltText('Beautiful Villa');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('should use placeholder image when no image is provided', () => {
    const propertyWithoutImage = { ...mockProperty, image: '' };
    render(<PropertyCard property={propertyWithoutImage} />);
    const image = screen.getByAltText('Beautiful Villa');
    expect(image).toHaveAttribute('src', '/placeholder-property.jpg');
  });

  it('should have proper accessibility attributes', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('should render view details button', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByRole('button', { name: /View details/i })).toBeInTheDocument();
  });
});

