import { PropertyServiceImpl } from '../../../src/application/services/PropertyServiceImpl';
import { PropertyRepository } from '../../../src/domain/repositories/PropertyRepository';
import { Property, PropertyType, PropertyStatus, AreaUnit } from '../../../src/domain/entities/Property';

// Mock property data
const mockProperty: Property = {
  id: '1',
  title: 'Test Property',
  description: 'Test Description',
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
  features: ['Parking', 'Balcony'],
  images: ['image1.jpg'],
  status: PropertyStatus.AVAILABLE,
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
  isAvailable: () => true,
  isExpensive: () => false,
  getFormattedPrice: () => 'USD 100,000',
} as Property;

const mockExpensiveProperty: Property = {
  ...mockProperty,
  id: '2',
  title: 'Expensive Property',
  price: 2000000,
  isExpensive: () => true,
  getFormattedPrice: () => 'USD 2,000,000',
} as Property;

const mockSoldProperty: Property = {
  ...mockProperty,
  id: '3',
  title: 'Sold Property',
  status: PropertyStatus.SOLD,
  isAvailable: () => false,
} as Property;

describe('PropertyServiceImpl', () => {
  let propertyService: PropertyServiceImpl;
  let mockRepository: jest.Mocked<PropertyRepository>;

  beforeEach(() => {
    // Create mock repository
    mockRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<PropertyRepository>;

    propertyService = new PropertyServiceImpl(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProperty', () => {
    it('should return property when found', async () => {
      mockRepository.findById.mockResolvedValue(mockProperty);

      const result = await propertyService.getProperty('1');

      expect(result).toEqual(mockProperty);
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should return null when property not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const result = await propertyService.getProperty('999');

      expect(result).toBeNull();
      expect(mockRepository.findById).toHaveBeenCalledWith('999');
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database error');
      mockRepository.findById.mockRejectedValue(error);

      await expect(propertyService.getProperty('1')).rejects.toThrow('Database error');
    });
  });

  describe('getAllProperties', () => {
    it('should return paginated properties with default pagination', async () => {
      const mockProperties = [mockProperty, mockExpensiveProperty];
      mockRepository.findAll.mockResolvedValue(mockProperties);

      const result = await propertyService.getAllProperties();

      expect(result.data).toEqual(mockProperties);
      expect(result.pagination).toBeDefined();
      expect(mockRepository.findAll).toHaveBeenCalled();
    });

    it('should return paginated properties with custom pagination', async () => {
      const mockProperties = [mockProperty];
      mockRepository.findAll.mockResolvedValue(mockProperties);

      const result = await propertyService.getAllProperties(2, 5);

      expect(result.data).toEqual(mockProperties);
      expect(result.pagination).toBeDefined();
      expect(mockRepository.findAll).toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database error');
      mockRepository.findAll.mockRejectedValue(error);

      await expect(propertyService.getAllProperties()).rejects.toThrow('Database error');
    });
  });

  describe('createProperty', () => {
    it('should create and return new property', async () => {
      const propertyData = {
        title: 'New Property',
        description: 'New Description',
        price: 150000,
        currency: 'USD',
      };

      mockRepository.create.mockResolvedValue(mockProperty);

      const result = await propertyService.createProperty(propertyData);

      expect(result).toEqual(mockProperty);
      expect(mockRepository.create).toHaveBeenCalledWith(propertyData);
    });

    it('should handle repository errors during creation', async () => {
      const error = new Error('Database error');
      mockRepository.create.mockRejectedValue(error);

      await expect(propertyService.createProperty({})).rejects.toThrow('Database error');
    });
  });

  describe('getAvailableProperties', () => {
    it('should return only available properties', async () => {
      const allProperties = [mockProperty, mockSoldProperty, mockExpensiveProperty];
      mockRepository.findAll.mockResolvedValue(allProperties);

      const result = await propertyService.getAvailableProperties();

      expect(result).toHaveLength(2);
      expect(result).toContain(mockProperty);
      expect(result).toContain(mockExpensiveProperty);
      expect(result).not.toContain(mockSoldProperty);
    });

    it('should return empty array when no available properties', async () => {
      const allProperties = [mockSoldProperty];
      mockRepository.findAll.mockResolvedValue(allProperties);

      const result = await propertyService.getAvailableProperties();

      expect(result).toHaveLength(0);
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database error');
      mockRepository.findAll.mockRejectedValue(error);

      await expect(propertyService.getAvailableProperties()).rejects.toThrow('Database error');
    });
  });

  describe('getExpensiveProperties', () => {
    it('should return only expensive properties', async () => {
      const allProperties = [mockProperty, mockExpensiveProperty, mockSoldProperty];
      mockRepository.findAll.mockResolvedValue(allProperties);

      const result = await propertyService.getExpensiveProperties();

      expect(result).toHaveLength(1);
      expect(result).toContain(mockExpensiveProperty);
      expect(result).not.toContain(mockProperty);
      expect(result).not.toContain(mockSoldProperty);
    });

    it('should return empty array when no expensive properties', async () => {
      const allProperties = [mockProperty, mockSoldProperty];
      mockRepository.findAll.mockResolvedValue(allProperties);

      const result = await propertyService.getExpensiveProperties();

      expect(result).toHaveLength(0);
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database error');
      mockRepository.findAll.mockRejectedValue(error);

      await expect(propertyService.getExpensiveProperties()).rejects.toThrow('Database error');
    });
  });

  describe('use case integration', () => {
    it('should use GetPropertyUseCase for getProperty', async () => {
      mockRepository.findById.mockResolvedValue(mockProperty);

      const result = await propertyService.getProperty('1');

      expect(result).toEqual(mockProperty);
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should use GetAllPropertiesUseCase for getAllProperties', async () => {
      const mockProperties = [mockProperty];
      mockRepository.findAll.mockResolvedValue(mockProperties);

      const result = await propertyService.getAllProperties();

      expect(result.data).toEqual(mockProperties);
      expect(mockRepository.findAll).toHaveBeenCalled();
    });

    it('should use CreatePropertyUseCase for createProperty', async () => {
      const propertyData = { title: 'New Property' };
      mockRepository.create.mockResolvedValue(mockProperty);

      const result = await propertyService.createProperty(propertyData);

      expect(result).toEqual(mockProperty);
      expect(mockRepository.create).toHaveBeenCalledWith(propertyData);
    });
  });

  describe('business logic', () => {
    it('should filter available properties correctly', async () => {
      const availableProperty = { ...mockProperty, isAvailable: () => true };
      const soldProperty = { ...mockProperty, isAvailable: () => false };
      
      mockRepository.findAll.mockResolvedValue([availableProperty, soldProperty]);

      const result = await propertyService.getAvailableProperties();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(availableProperty);
    });

    it('should filter expensive properties correctly', async () => {
      const cheapProperty = { ...mockProperty, isExpensive: () => false };
      const expensiveProperty = { ...mockProperty, isExpensive: () => true };
      
      mockRepository.findAll.mockResolvedValue([cheapProperty, expensiveProperty]);

      const result = await propertyService.getExpensiveProperties();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(expensiveProperty);
    });
  });
});
