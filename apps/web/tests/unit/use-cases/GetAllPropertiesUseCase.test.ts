import { GetAllPropertiesUseCase } from '../../../src/application/use-cases/GetAllPropertiesUseCase';
import { PropertyRepository } from '../../../src/domain/repositories/PropertyRepository';
import { Property, PropertyType, PropertyStatus, AreaUnit } from '../../../src/domain/entities/Property';

// Mock property data
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Property 1',
    description: 'Description 1',
    price: 100000,
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
    features: ['Parking'],
    images: ['image1.jpg'],
    status: PropertyStatus.AVAILABLE,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    isAvailable: () => true,
    isExpensive: () => false,
    getFormattedPrice: () => 'USD 100,000',
  },
  {
    id: '2',
    title: 'Property 2',
    description: 'Description 2',
    price: 200000,
    currency: 'USD',
    location: {
      address: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      getFullAddress: () => '456 Oak Ave, Los Angeles, CA, USA',
    },
    propertyType: PropertyType.HOUSE,
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    areaUnit: AreaUnit.M2,
    features: ['Garden'],
    images: ['image2.jpg'],
    status: PropertyStatus.AVAILABLE,
    createdAt: new Date('2023-01-02'),
    updatedAt: new Date('2023-01-02'),
    isAvailable: () => true,
    isExpensive: () => false,
    getFormattedPrice: () => 'USD 200,000',
  },
  {
    id: '3',
    title: 'Property 3',
    description: 'Description 3',
    price: 300000,
    currency: 'USD',
    location: {
      address: '789 Pine St',
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      getFullAddress: () => '789 Pine St, Chicago, IL, USA',
    },
    propertyType: PropertyType.COMMERCIAL,
    bedrooms: 0,
    bathrooms: 1,
    area: 200,
    areaUnit: AreaUnit.M2,
    features: ['Parking', 'Storage'],
    images: ['image3.jpg'],
    status: PropertyStatus.SOLD,
    createdAt: new Date('2023-01-03'),
    updatedAt: new Date('2023-01-03'),
    isAvailable: () => false,
    isExpensive: () => false,
    getFormattedPrice: () => 'USD 300,000',
  },
] as Property[];

describe('GetAllPropertiesUseCase', () => {
  let useCase: GetAllPropertiesUseCase;
  let mockRepository: jest.Mocked<PropertyRepository>;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<PropertyRepository>;

    useCase = new GetAllPropertiesUseCase(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return all properties with default pagination', async () => {
      mockRepository.findAll.mockResolvedValue(mockProperties);

      const result = await useCase.execute();

      expect(result.data).toEqual(mockProperties);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 3,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      });
      expect(mockRepository.findAll).toHaveBeenCalled();
    });

    it('should return paginated properties with custom page and limit', async () => {
      mockRepository.findAll.mockResolvedValue(mockProperties);

      const result = await useCase.execute({ page: 2, limit: 1 });

      expect(result.data).toEqual([mockProperties[1]]); // Second property
      expect(result.pagination).toEqual({
        page: 2,
        limit: 1,
        total: 3,
        totalPages: 3,
        hasNext: true,
        hasPrev: true,
      });
    });

    it('should return empty array when no properties', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      const result = await useCase.execute();

      expect(result.data).toEqual([]);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      });
    });

    it('should handle pagination correctly for large datasets', async () => {
      const largePropertyList = Array.from({ length: 25 }, (_, i) => ({
        ...mockProperties[0],
        id: `${i + 1}`,
        title: `Property ${i + 1}`,
      }));

      mockRepository.findAll.mockResolvedValue(largePropertyList);

      const result = await useCase.execute({ page: 2, limit: 10 });

      expect(result.data).toHaveLength(10);
      expect(result.data[0].id).toBe('11'); // Second page starts at index 10
      expect(result.pagination).toEqual({
        page: 2,
        limit: 10,
        total: 25,
        totalPages: 3,
        hasNext: true,
        hasPrev: true,
      });
    });

    it('should handle last page correctly', async () => {
      const largePropertyList = Array.from({ length: 25 }, (_, i) => ({
        ...mockProperties[0],
        id: `${i + 1}`,
        title: `Property ${i + 1}`,
      }));

      mockRepository.findAll.mockResolvedValue(largePropertyList);

      const result = await useCase.execute({ page: 3, limit: 10 });

      expect(result.data).toHaveLength(5); // Last page has 5 items
      expect(result.pagination).toEqual({
        page: 3,
        limit: 10,
        total: 25,
        totalPages: 3,
        hasNext: false,
        hasPrev: true,
      });
    });

    it('should handle first page correctly', async () => {
      const largePropertyList = Array.from({ length: 25 }, (_, i) => ({
        ...mockProperties[0],
        id: `${i + 1}`,
        title: `Property ${i + 1}`,
      }));

      mockRepository.findAll.mockResolvedValue(largePropertyList);

      const result = await useCase.execute({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(10);
      expect(result.data[0].id).toBe('1'); // First page starts at index 0
      expect(result.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 25,
        totalPages: 3,
        hasNext: true,
        hasPrev: false,
      });
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database connection failed');
      mockRepository.findAll.mockRejectedValue(error);

      await expect(useCase.execute()).rejects.toThrow('Database connection failed');
      expect(mockRepository.findAll).toHaveBeenCalled();
    });

    it('should handle zero limit gracefully', async () => {
      mockRepository.findAll.mockResolvedValue(mockProperties);

      const result = await useCase.execute({ page: 1, limit: 0 });

      expect(result.data).toEqual([]);
      expect(result.pagination.totalPages).toBe(Infinity); // Math.ceil(3/0) = Infinity
    });

    it('should handle negative page gracefully', async () => {
      mockRepository.findAll.mockResolvedValue(mockProperties);

      const result = await useCase.execute({ page: -1, limit: 10 });

      expect(result.data).toEqual(mockProperties); // Negative page treated as 0, so returns all
      expect(result.pagination.page).toBe(-1);
    });

    it('should handle very large page number', async () => {
      mockRepository.findAll.mockResolvedValue(mockProperties);

      const result = await useCase.execute({ page: 100, limit: 10 });

      expect(result.data).toEqual([]); // Page 100 with 3 total items returns empty
      expect(result.pagination).toEqual({
        page: 100,
        limit: 10,
        total: 3,
        totalPages: 1,
        hasNext: false,
        hasPrev: true,
      });
    });

    it('should handle undefined options', async () => {
      mockRepository.findAll.mockResolvedValue(mockProperties);

      const result = await useCase.execute(undefined);

      expect(result.data).toEqual(mockProperties);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
    });

    it('should handle partial options', async () => {
      mockRepository.findAll.mockResolvedValue(mockProperties);

      const result = await useCase.execute({ page: 2 });

      expect(result.data).toEqual(mockProperties.slice(10, 20)); // Page 2 with default limit 10
      expect(result.pagination.page).toBe(2);
      expect(result.pagination.limit).toBe(10);
    });
  });
});
