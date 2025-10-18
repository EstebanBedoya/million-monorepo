import { render, screen, waitFor } from '@testing-library/react';
import { PropertyDetailPage } from '../../../src/presentation/pages/PropertyDetailPage';
import { MockPropertyType } from '../../../src/domain/schemas/property.schema';

const mockPush = jest.fn();
const mockRouter = {
  push: mockPush,
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
};

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('PropertyDetailPage', () => {
  const mockProperty: MockPropertyType = {
    id: 'prop-123',
    idOwner: 'owner-001',
    name: 'Beautiful Villa',
    address: '456 Ocean Drive',
    city: 'Miami',
    price: 3500000,
    image: 'https://example.com/villa.jpg',
    bedrooms: 6,
    bathrooms: 5,
    area: 450,
    areaUnit: 'm²',
    propertyType: 'Villa',
  };

  beforeEach(() => {
    mockPush.mockClear();
    (global.fetch as jest.Mock).mockClear();
  });

  it('should show loading skeleton initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(() => {}) // Never resolves
    );

    render(<PropertyDetailPage id="prop-123" />);
    
    const loadingElements = screen.getAllByRole('status');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('should fetch and display property details', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockProperty,
    });

    render(<PropertyDetailPage id="prop-123" />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Beautiful Villa' })).toBeInTheDocument();
    });

    expect(screen.getAllByText('$3,500,000').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Miami').length).toBeGreaterThan(0);
    expect(screen.getAllByText('456 Ocean Drive').length).toBeGreaterThan(0);
  });

  it('should show 404 when property is not found', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: 'Property not found' }),
    });

    render(<PropertyDetailPage id="non-existent" />);

    await waitFor(() => {
      expect(screen.getByText('Property Not Found')).toBeInTheDocument();
    });

    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('should show 404 on fetch error', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<PropertyDetailPage id="prop-123" />);

    await waitFor(() => {
      expect(screen.getByText('Property Not Found')).toBeInTheDocument();
    });
  });

  it('should navigate back when Back button is clicked', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockProperty,
    });

    render(<PropertyDetailPage id="prop-123" />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Beautiful Villa' })).toBeInTheDocument();
    });

    const backButton = screen.getByRole('button', { name: /Go back to properties list/i });
    backButton.click();

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('should call fetch with correct URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockProperty,
    });

    render(<PropertyDetailPage id="prop-456" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/properties/prop-456');
    });
  });

  it('should display breadcrumbs', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockProperty,
    });

    render(<PropertyDetailPage id="prop-123" />);

    await waitFor(() => {
      expect(screen.getByRole('navigation', { name: /Breadcrumb/i })).toBeInTheDocument();
    });

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Properties')).toBeInTheDocument();
    expect(screen.getAllByText('Beautiful Villa').length).toBeGreaterThan(0);
  });
});

