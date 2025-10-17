import { PropertyRepository, PaginationOptions, PaginatedResult } from '../../domain/repositories/PropertyRepository';
import { Property, PropertyType, PropertyStatus, AreaUnit } from '../../domain/entities/Property';
import { PropertyApiClient } from '../api/PropertyApiClient';
import { PropertyDto } from '../../../../../shared/contracts/property.dto';

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
    // Note: PropertyApiClient doesn't have update method yet
    // For now, just return the property as-is
    return property;
  }

  async delete(_id: string): Promise<void> {
    // Note: PropertyApiClient doesn't have delete method yet
    // For now, just log
    console.log('Delete method not implemented yet');
  }

  // Mapper methods
  private mapDtoToEntity(dto: any): Property {
    // Handle both PropertyDto and MockPropertyDto formats
    const isMockFormat = 'name' in dto && 'address' in dto;
    
    if (isMockFormat) {
      // Map from MockPropertyDto format
      return new Property(
        dto.id,
        dto.name || 'Untitled Property', // Use name as title
        `Beautiful property located at ${dto.address}, ${dto.city}`, // Generate description
        dto.price,
        'USD', // Default currency
        `${dto.address}, ${dto.city}`, // Combine address and city as location
        this.mapPropertyType(dto.propertyType),
        dto.area || 0,
        this.mapAreaUnit(dto.areaUnit),
        [], // Default empty features array
        dto.image ? [dto.image] : [], // Convert single image to array
        PropertyStatus.AVAILABLE, // Default status
        new Date(),
        new Date(),
        dto.bedrooms,
        dto.bathrooms
      );
    } else {
      // Map from PropertyDto format
      return new Property(
        dto.id,
        dto.name,
        dto.description,
        dto.price,
        dto.currency,
        dto.location,
        dto.propertyType as Property['propertyType'],
        dto.area,
        dto.areaUnit as Property['areaUnit'],
        dto.features,
        dto.images,
        dto.status as Property['status'],
        new Date(dto.createdAt),
        new Date(dto.updatedAt),
        dto.bedrooms,
        dto.bathrooms
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

  private mapEntityToDto(entity: Property): Partial<PropertyDto> {
    return {
      name: entity.name,
      description: entity.description,
      price: entity.price,
      currency: entity.currency,
      location: entity.location,
      propertyType: entity.propertyType as PropertyDto['propertyType'],
      bedrooms: entity.bedrooms,
      bathrooms: entity.bathrooms,
      area: entity.area,
      areaUnit: entity.areaUnit as PropertyDto['areaUnit'],
      features: entity.features,
      images: entity.images,
      status: entity.status as PropertyDto['status']
    };
  }
}
