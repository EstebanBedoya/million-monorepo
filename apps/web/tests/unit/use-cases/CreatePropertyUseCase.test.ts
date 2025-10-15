import { CreatePropertyUseCase } from '../../../src/application/use-cases/CreatePropertyUseCase';
import { PropertyRepository } from '../../../src/domain/repositories/PropertyRepository';
import { Property, PropertyType, PropertyStatus, AreaUnit } from '../../../src/domain/entities/Property';

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: jest.fn(() => 'mock-uuid-123'),
  },
});

describe('CreatePropertyUseCase', () => {
  let useCase: CreatePropertyUseCase;
  let mockRepository: jest.Mocked<PropertyRepository>;

  const validPropertyData = {
    title: 'New Property',
    description: 'A beautiful new property',
    price: 250000,
    currency: 'USD',
    location: {
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      coordinates: { lat: 40.7128, lng: -74.0060 },
    },
    propertyType: PropertyType.APARTMENT,
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    areaUnit: AreaUnit.M2,
    features: ['Parking', 'Balcony'],
    images: ['image1.jpg', 'image2.jpg'],
  };

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      save: jest.fn(),
    } as jest.Mocked<PropertyRepository>;

    useCase = new CreatePropertyUseCase(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create property with valid data', async () => {
      const mockCreatedProperty = {
        id: 'mock-uuid-123',
        ...validPropertyData,
        status: PropertyStatus.AVAILABLE,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      } as Property;

      mockRepository.save.mockResolvedValue(mockCreatedProperty);

      const result = await useCase.execute(validPropertyData);

      expect(result).toEqual(mockCreatedProperty);
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'mock-uuid-123',
          title: 'New Property',
          description: 'A beautiful new property',
          price: 250000,
          currency: 'USD',
          status: PropertyStatus.AVAILABLE,
        })
      );
    });

    it('should create property without coordinates', async () => {
      const propertyDataWithoutCoords = {
        ...validPropertyData,
        location: {
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          country: 'USA',
        },
      };

      const mockCreatedProperty = {
        id: 'mock-uuid-123',
        ...propertyDataWithoutCoords,
        status: PropertyStatus.AVAILABLE,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      } as Property;

      mockRepository.save.mockResolvedValue(mockCreatedProperty);

      const result = await useCase.execute(propertyDataWithoutCoords);

      expect(result).toEqual(mockCreatedProperty);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should create property with minimal required data', async () => {
      const minimalData = {
        title: 'Minimal Property',
        description: 'Minimal description',
        price: 100000,
        currency: 'USD',
        location: {
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          country: 'USA',
        },
        propertyType: PropertyType.APARTMENT,
        area: 50,
        areaUnit: AreaUnit.M2,
        features: [],
        images: [],
      };

      const mockCreatedProperty = {
        id: 'mock-uuid-123',
        ...minimalData,
        status: PropertyStatus.AVAILABLE,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      } as Property;

      mockRepository.save.mockResolvedValue(mockCreatedProperty);

      const result = await useCase.execute(minimalData);

      expect(result).toEqual(mockCreatedProperty);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw error when title is empty', async () => {
      const invalidData = {
        ...validPropertyData,
        title: '',
      };

      await expect(useCase.execute(invalidData)).rejects.toThrow('Property title is required');
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when title is only whitespace', async () => {
      const invalidData = {
        ...validPropertyData,
        title: '   ',
      };

      await expect(useCase.execute(invalidData)).rejects.toThrow('Property title is required');
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when title is null', async () => {
      const invalidData = {
        ...validPropertyData,
        title: null as any,
      };

      await expect(useCase.execute(invalidData)).rejects.toThrow('Property title is required');
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when title is undefined', async () => {
      const invalidData = {
        ...validPropertyData,
        title: undefined as any,
      };

      await expect(useCase.execute(invalidData)).rejects.toThrow('Property title is required');
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when price is zero', async () => {
      const invalidData = {
        ...validPropertyData,
        price: 0,
      };

      await expect(useCase.execute(invalidData)).rejects.toThrow('Property price must be greater than 0');
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when price is negative', async () => {
      const invalidData = {
        ...validPropertyData,
        price: -1000,
      };

      await expect(useCase.execute(invalidData)).rejects.toThrow('Property price must be greater than 0');
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database connection failed');
      mockRepository.save.mockRejectedValue(error);

      await expect(useCase.execute(validPropertyData)).rejects.toThrow('Database connection failed');
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should create property with different property types', async () => {
      const houseData = {
        ...validPropertyData,
        propertyType: PropertyType.HOUSE,
      };

      const mockCreatedProperty = {
        id: 'mock-uuid-123',
        ...houseData,
        status: PropertyStatus.AVAILABLE,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      } as Property;

      mockRepository.save.mockResolvedValue(mockCreatedProperty);

      const result = await useCase.execute(houseData);

      expect(result).toEqual(mockCreatedProperty);
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          propertyType: PropertyType.HOUSE,
        })
      );
    });

    it('should create property with commercial type', async () => {
      const commercialData = {
        ...validPropertyData,
        propertyType: PropertyType.COMMERCIAL,
        bedrooms: undefined, // Commercial properties might not have bedrooms
      };

      const mockCreatedProperty = {
        id: 'mock-uuid-123',
        ...commercialData,
        status: PropertyStatus.AVAILABLE,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      } as Property;

      mockRepository.save.mockResolvedValue(mockCreatedProperty);

      const result = await useCase.execute(commercialData);

      expect(result).toEqual(mockCreatedProperty);
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          propertyType: PropertyType.COMMERCIAL,
        })
      );
    });

    it('should create property with land type', async () => {
      const landData = {
        ...validPropertyData,
        propertyType: PropertyType.LAND,
        bedrooms: undefined,
        bathrooms: undefined,
      };

      const mockCreatedProperty = {
        id: 'mock-uuid-123',
        ...landData,
        status: PropertyStatus.AVAILABLE,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      } as Property;

      mockRepository.save.mockResolvedValue(mockCreatedProperty);

      const result = await useCase.execute(landData);

      expect(result).toEqual(mockCreatedProperty);
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          propertyType: PropertyType.LAND,
        })
      );
    });

    it('should set correct timestamps', async () => {
      const mockCreatedProperty = {
        id: 'mock-uuid-123',
        ...validPropertyData,
        status: PropertyStatus.AVAILABLE,
        createdAt: new Date('2023-01-01T00:00:00Z'),
        updatedAt: new Date('2023-01-01T00:00:00Z'),
      } as Property;

      mockRepository.save.mockResolvedValue(mockCreatedProperty);

      const result = await useCase.execute(validPropertyData);

      expect(result).toEqual(mockCreatedProperty);
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        })
      );
    });

    it('should set status to AVAILABLE by default', async () => {
      const mockCreatedProperty = {
        id: 'mock-uuid-123',
        ...validPropertyData,
        status: PropertyStatus.AVAILABLE,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      } as Property;

      mockRepository.save.mockResolvedValue(mockCreatedProperty);

      const result = await useCase.execute(validPropertyData);

      expect(result).toEqual(mockCreatedProperty);
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: PropertyStatus.AVAILABLE,
        })
      );
    });
  });
});
