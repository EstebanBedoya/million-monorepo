import { PropertyServiceClient } from '../../../src/application/services/PropertyServiceClient';

// Mock fetch
global.fetch = jest.fn();

describe('PropertyServiceClient', () => {
  let service: PropertyServiceClient;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PropertyServiceClient({
      baseUrl: 'http://localhost:3000/api/properties',
      simulateErrors: false,
    });
  });

  describe('getProperties', () => {
    it('should fetch properties successfully', async () => {
      const mockResponse = {
        properties: [{ id: '1', name: 'Test Property' }],
        pagination: {
          page: 1,
          limit: 12,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await service.getProperties({ search: 'test' }, { page: 1, limit: 12 });

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/properties?page=1&limit=12&search=test',
        expect.objectContaining({
          signal: expect.any(AbortSignal),
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    });

    it('should handle HTTP errors', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(service.getProperties()).rejects.toThrow('HTTP 500: Internal Server Error');
    });

    it('should handle network errors', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(service.getProperties()).rejects.toThrow('Network error - please check your connection');
    });

    it('should handle timeout errors', async () => {
      const controller = new AbortController();
      controller.abort();

      (fetch as jest.Mock).mockImplementationOnce(() => {
        return new Promise((_, reject) => {
          setTimeout(() => reject(new Error('AbortError')), 100);
        });
      });

      // Mock AbortController to simulate timeout
      jest.spyOn(global, 'AbortController').mockImplementation(() => ({
        abort: jest.fn(),
        signal: { aborted: true } as AbortSignal,
      }));

      await expect(service.getProperties()).rejects.toThrow('Request timeout - please try again');
    });

    it('should build correct query parameters', async () => {
      const mockResponse = { properties: [], pagination: {} };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await service.getProperties(
        {
          search: 'test',
          minPrice: 100000,
          maxPrice: 500000,
          propertyType: 'house',
        },
        { page: 2, limit: 10 }
      );

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/properties?page=2&limit=10&search=test&minPrice=100000&maxPrice=500000&propertyType=house',
        expect.any(Object)
      );
    });
  });

  describe('error simulation', () => {
    beforeEach(() => {
      service = new PropertyServiceClient({
        baseUrl: 'http://localhost:3000/api/properties',
        simulateErrors: true,
        errorRate: 1.0, // 100% error rate for testing
        errorTypes: ['server'],
      });
    });

    it('should simulate server errors when enabled', async () => {
      await expect(service.getProperties()).rejects.toThrow('HTTP 500: Internal Server Error');
    });

    it('should simulate timeout errors', async () => {
      service.setErrorTypes(['timeout']);
      
      await expect(service.getProperties()).rejects.toThrow('Request timeout - please try again');
    });

    it('should simulate network errors', async () => {
      service.setErrorTypes(['network']);
      
      await expect(service.getProperties()).rejects.toThrow('Network error - please check your connection');
    });

    it('should allow disabling error simulation', async () => {
      service.setErrorSimulation(false);

      const mockResponse = { properties: [], pagination: {} };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await service.getProperties();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('configuration', () => {
    it('should use default configuration values', () => {
      const defaultService = new PropertyServiceClient({
        baseUrl: 'http://localhost:3000/api/properties',
      });

      expect(defaultService).toBeDefined();
    });

    it('should allow setting error simulation', () => {
      service.setErrorSimulation(true, 0.5);
      service.setErrorTypes(['server', 'timeout']);
      
      expect(service).toBeDefined();
    });
  });
});
