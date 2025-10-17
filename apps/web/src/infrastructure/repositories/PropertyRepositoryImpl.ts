import { PropertyRepository, PaginationOptions, PaginatedResult } from '../../domain/repositories/PropertyRepository';
import { Property, Location, Coordinates } from '../../domain/entities/Property';
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
  private mapDtoToEntity(dto: PropertyDto): Property {
    // Create Location instance
    const location = new Location(
      dto.location.address,
      dto.location.city,
      dto.location.state,
      dto.location.country,
      dto.location.coordinates 
        ? new Coordinates(dto.location.coordinates.lat, dto.location.coordinates.lng)
        : undefined
    );

    return new Property(
      dto.id,
      dto.title,
      dto.description,
      dto.price,
      dto.currency,
      location,
      dto.propertyType as Property['propertyType'], // You might need to map this properly
      dto.area,
      dto.areaUnit as Property['areaUnit'], // You might need to map this properly
      dto.features,
      dto.images,
      dto.status as Property['status'], // You might need to map this properly
      new Date(dto.createdAt),
      new Date(dto.updatedAt),
      dto.bedrooms,
      dto.bathrooms
    );
  }

  private mapEntityToDto(entity: Property): Partial<PropertyDto> {
    return {
      title: entity.title,
      description: entity.description,
      price: entity.price,
      currency: entity.currency,
      location: {
        address: entity.location.address,
        city: entity.location.city,
        state: entity.location.state,
        country: entity.location.country,
        coordinates: entity.location.coordinates
      },
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
