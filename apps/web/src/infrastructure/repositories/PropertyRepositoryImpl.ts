import { PropertyRepository, PaginationOptions, PaginatedResult } from '@/domain/repositories/PropertyRepository';
import { Property, PropertyType, PropertyStatus, AreaUnit } from '@/domain/entities/Property';
import { PropertyApiClient } from '@/infrastructure/api/PropertyApiClient';
import { PropertyDto } from '@/shared/contracts/property.dto';

// Infrastructure implementation - handles data persistence with API
export class PropertyRepositoryImpl implements PropertyRepository {
  private apiClient: PropertyApiClient;

  constructor(apiClient: PropertyApiClient) {
    this.apiClient = apiClient;
  }

  async findById(id: string): Promise<Property | null> {
    try {
      const propertyDto = await this.apiClient.fetchPropertyById(id);
      return this.mapDtoToEntity(propertyDto);
    } catch (error) {
      console.error('Error fetching property by ID:', error);
      return null;
    }
  }

  async findAll(): Promise<Property[]> {
    try {
      const response = await this.apiClient.fetchProperties({}, { page: 1, limit: 1000 });
      return response.properties.map(dto => this.mapDtoToEntity(dto));
    } catch (error) {
      console.error('Error fetching all properties:', error);
      return [];
    }
  }

  async findByStatus(status: string): Promise<Property[]> {
    try {
      const response = await this.apiClient.fetchProperties({ status }, { page: 1, limit: 1000 });
      return response.properties.map(dto => this.mapDtoToEntity(dto));
    } catch (error) {
      console.error('Error fetching properties by status:', error);
      return [];
    }
  }

  async findByPriceRange(minPrice: number, maxPrice: number): Promise<Property[]> {
    try {
      const response = await this.apiClient.fetchProperties(
        { minPrice, maxPrice }, 
        { page: 1, limit: 1000 }
      );
      return response.properties.map(dto => this.mapDtoToEntity(dto));
    } catch (error) {
      console.error('Error fetching properties by price range:', error);
      return [];
    }
  }

  async findWithPagination(options: PaginationOptions): Promise<PaginatedResult<Property>> {
    try {
      const response = await this.apiClient.fetchProperties({}, {
        page: options.page || 1,
        limit: options.limit || 12
      });
      
      return {
        data: response.properties.map(dto => this.mapDtoToEntity(dto)),
        pagination: response.pagination
      };
    } catch (error) {
      console.error('Error fetching properties with pagination:', error);
      return {
        data: [],
        pagination: {
          page: options.page || 1,
          limit: options.limit || 12,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        }
      };
    }
  }

  async save(property: Property): Promise<Property> {
    try {
      const propertyDto = this.mapEntityToDto(property);
      const savedDto = await this.apiClient.createProperty(propertyDto);
      return this.mapDtoToEntity(savedDto);
    } catch (error) {
      console.error('Error saving property:', error);
      throw error;
    }
  }

  async update(property: Property): Promise<Property> {
    try {
      const propertyDto = this.mapEntityToDto(property);
      const updatedDto = await this.apiClient.updateProperty(property.id, propertyDto);
      return this.mapDtoToEntity(updatedDto);
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.apiClient.deleteProperty(id);
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  }

  // Mapper methods
  private mapDtoToEntity(dto: Record<string, unknown> | PropertyDto): Property {
    // Check if it's the new backend format with idProperty
    const isNewBackendFormat = 'idProperty' in dto;
    
    if (isNewBackendFormat) {
      // Map from new backend format (.NET API)
      const dtoWithImages = dto as Record<string, unknown>;
      const images = (dtoWithImages.images as Array<Record<string, unknown>>)?.map((img: Record<string, unknown>) => ({
        idPropertyImage: img.idPropertyImage as string,
        idProperty: img.idProperty as string,
        file: img.file as string,
        enabled: img.enabled as boolean
      })) || (dtoWithImages.image ? [{
        idPropertyImage: 'img-0',
        idProperty: dtoWithImages.idProperty as string,
        file: dtoWithImages.image as string,
        enabled: true
      }] : []);

      const owner = dtoWithImages.owner ? {
        idOwner: (dtoWithImages.owner as Record<string, unknown>).idOwner as string,
        name: (dtoWithImages.owner as Record<string, unknown>).name as string,
        address: (dtoWithImages.owner as Record<string, unknown>).address as string,
        birthday: (dtoWithImages.owner as Record<string, unknown>).birthday as string,
        photo: (dtoWithImages.owner as Record<string, unknown>).photo as string
      } : undefined;

      const traces = (dtoWithImages.traces as Array<Record<string, unknown>>)?.map((trace: Record<string, unknown>) => ({
        idPropertyTrace: trace.idPropertyTrace as string,
        dateSale: trace.dateSale as string,
        idProperty: trace.idProperty as string,
        name: trace.name as string,
        tax: trace.tax as number,
        value: trace.value as number
      })) || undefined;

      return new Property(
        dtoWithImages.idProperty as string || (dto as Record<string, unknown>).id as string,
        dtoWithImages.name as string || 'Untitled Property',
        dtoWithImages.name as string || 'Property description',
        dtoWithImages.price as number || 0,
        'USD',
        dtoWithImages.address as string || 'Unknown location',
        this.mapPropertyType('House'),
        0,
        AreaUnit.M2,
        [],
        images,
        PropertyStatus.AVAILABLE,
        dtoWithImages.year ? new Date(dtoWithImages.year as number, 0, 1) : new Date(),
        new Date(),
        0,
        0,
        dtoWithImages.year as number,
        owner,
        traces
      );
    }
    
    // Handle old MockPropertyDto format
    const isMockFormat = 'name' in dto && 'address' in dto && !isNewBackendFormat;
    
    if (isMockFormat) {
      // Map from MockPropertyDto format
      const mockDto = dto as Record<string, unknown>;
      return new Property(
        mockDto.id as string,
        (mockDto.name as string) || 'Untitled Property',
        `Beautiful property located at ${mockDto.address}, ${mockDto.city}`,
        mockDto.price as number,
        'USD',
        `${mockDto.address}, ${mockDto.city}`,
        this.mapPropertyType(mockDto.propertyType as string),
        (mockDto.area as number) || 0,
        this.mapAreaUnit(mockDto.areaUnit as string),
        [],
        mockDto.image ? [mockDto.image as string] : [],
        PropertyStatus.AVAILABLE,
        new Date(),
        new Date(),
        mockDto.bedrooms as number,
        mockDto.bathrooms as number
      );
    } else {
      // Map from PropertyDto format
      const propertyDto = dto as unknown as PropertyDto;
      return new Property(
        propertyDto.idProperty,
        propertyDto.name,
        propertyDto.name, // Use name as description for PropertyDto
        propertyDto.price,
        'USD', // Default currency
        propertyDto.address,
        PropertyType.HOUSE, // Default property type
        0, // Default area
        AreaUnit.M2, // Default area unit
        [], // Default features
        [], // Default images
        PropertyStatus.AVAILABLE, // Default status
        new Date(), // Default createdAt
        new Date(), // Default updatedAt
        undefined, // Default bedrooms
        undefined // Default bathrooms
      );
    }
  }

  private mapPropertyType(propertyType: string): PropertyType {
    const typeMap: Record<string, PropertyType> = {
      'House': PropertyType.HOUSE,
      'Apartment': PropertyType.APARTMENT, 
      'Villa': PropertyType.HOUSE,
      'Condo': PropertyType.APARTMENT,
      'Townhouse': PropertyType.HOUSE,
      'Studio': PropertyType.APARTMENT
    };
    return typeMap[propertyType] || PropertyType.HOUSE;
  }

  private mapAreaUnit(areaUnit: string): AreaUnit {
    return areaUnit === 'm²' ? AreaUnit.M2 : AreaUnit.SQFT;
  }

  private mapEntityToDto(entity: Property): Record<string, unknown> {
    return {
      name: entity.name,
      address: entity.location.split(',')[0] || entity.location,
      city: entity.location.split(',').slice(1).join(',').trim() || '',
      price: entity.price,
      idOwner: 'owner-001',
      bedrooms: entity.bedrooms,
      bathrooms: entity.bathrooms,
      area: entity.area,
      areaUnit: entity.areaUnit === 'm2' ? 'm²' : 'sqft',
      propertyType: entity.propertyType,
      image: entity.images[0] || ''
    };
  }
}
