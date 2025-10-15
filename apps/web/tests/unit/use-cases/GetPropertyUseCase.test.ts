import { GetPropertyUseCase } from '../../../src/application/use-cases/GetPropertyUseCase';
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

describe('GetPropertyUseCase', () => {
  let useCase: GetPropertyUseCase;
  let mockRepository: jest.Mocked<PropertyRepository>;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<PropertyRepository>;

    useCase = new GetPropertyUseCase(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return property when found', async () => {
      mockRepository.findById.mockResolvedValue(mockProperty);

      const result = await useCase.execute('1');

      expect(result).toEqual(mockProperty);
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should return null when property not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const result = await useCase.execute('999');

      expect(result).toBeNull();
      expect(mockRepository.findById).toHaveBeenCalledWith('999');
    });

    it('should throw error when ID is empty', async () => {
      await expect(useCase.execute('')).rejects.toThrow('Property ID is required');
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw error when ID is only whitespace', async () => {
      await expect(useCase.execute('   ')).rejects.toThrow('Property ID is required');
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw error when ID is null', async () => {
      await expect(useCase.execute(null as any)).rejects.toThrow('Property ID is required');
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw error when ID is undefined', async () => {
      await expect(useCase.execute(undefined as any)).rejects.toThrow('Property ID is required');
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database connection failed');
      mockRepository.findById.mockRejectedValue(error);

      await expect(useCase.execute('1')).rejects.toThrow('Database connection failed');
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should accept valid ID with whitespace', async () => {
      mockRepository.findById.mockResolvedValue(mockProperty);

      const result = await useCase.execute('  1  ');

      expect(result).toEqual(mockProperty);
      expect(mockRepository.findById).toHaveBeenCalledWith('  1  ');
    });

    it('should handle special characters in ID', async () => {
      mockRepository.findById.mockResolvedValue(mockProperty);

      const result = await useCase.execute('prop-123_test');

      expect(result).toEqual(mockProperty);
      expect(mockRepository.findById).toHaveBeenCalledWith('prop-123_test');
    });

    it('should handle numeric ID as string', async () => {
      mockRepository.findById.mockResolvedValue(mockProperty);

      const result = await useCase.execute('123');

      expect(result).toEqual(mockProperty);
      expect(mockRepository.findById).toHaveBeenCalledWith('123');
    });
  });
});
