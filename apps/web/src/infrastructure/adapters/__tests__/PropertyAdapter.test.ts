import { PropertyAdapter } from '../PropertyAdapter';

// Mock fetch for testing
global.fetch = jest.fn();

describe('PropertyAdapter', () => {
  let adapter: PropertyAdapter;

  beforeEach(() => {
    adapter = new PropertyAdapter();
    jest.clearAllMocks();
  });

  describe('getProperties', () => {
    it('should fetch properties with default parameters', async () => {
      const mockResponse = {
        properties: [
          {
            id: 'prop-001',
            idOwner: 'owner-001',
            name: 'Test Property',
            address: '123 Test Street',
            price: 500000,
            image: 'https://example.com/image.jpg',
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await adapter.getProperties();

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith('/api/mock/properties?');
    });

    it('should fetch properties with custom parameters', async () => {
      const mockResponse = {
        properties: [],
        pagination: {
          page: 2,
          limit: 5,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: true,
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await adapter.getProperties({
        page: 2,
        limit: 5,
        search: 'test',
        minPrice: 100000,
        maxPrice: 1000000,
      });

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/mock/properties?page=2&limit=5&search=test&minPrice=100000&maxPrice=1000000'
      );
    });

    it('should handle HTTP errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(adapter.getProperties()).rejects.toThrow('Failed to fetch properties');
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(adapter.getProperties()).rejects.toThrow('Failed to fetch properties');
    });
  });

  describe('getPropertyById', () => {
    it('should fetch a single property by ID', async () => {
      const mockProperty = {
        id: 'prop-001',
        idOwner: 'owner-001',
        name: 'Test Property',
        address: '123 Test Street',
        price: 500000,
        image: 'https://example.com/image.jpg',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProperty),
      });

      const result = await adapter.getPropertyById('prop-001');

      expect(result).toEqual(mockProperty);
      expect(global.fetch).toHaveBeenCalledWith('/api/mock/properties/prop-001');
    });

    it('should handle 404 errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(adapter.getPropertyById('nonexistent')).rejects.toThrow('Property not found');
    });

    it('should handle other HTTP errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(adapter.getPropertyById('prop-001')).rejects.toThrow('Failed to fetch property with id: prop-001');
    });
  });

  describe('healthCheck', () => {
    it('should check health status', async () => {
      const mockHealth = {
        status: 'ok',
        timestamp: '2024-01-01T00:00:00Z',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockHealth),
      });

      const result = await adapter.healthCheck();

      expect(result).toEqual(mockHealth);
      expect(global.fetch).toHaveBeenCalledWith('/api/mock/health');
    });

    it('should handle health check errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(adapter.healthCheck()).rejects.toThrow('Failed to check health');
    });
  });
});
