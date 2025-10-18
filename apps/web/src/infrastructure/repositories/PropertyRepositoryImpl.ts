import { PropertyRepository, PaginationOptions, PaginatedResult } from '../../domain/repositories/PropertyRepository';
import { Property, PropertyType, PropertyStatus, AreaUnit } from '../../domain/entities/Property';
import { PropertyApiClient } from '../api/PropertyApiClient';

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapDtoToEntity(dto: any): Property {
    // Check if it's the new backend format with idProperty
    const isNewBackendFormat = 'idProperty' in dto;
    
    if (isNewBackendFormat) {
      // Map from new backend format (.NET API)
      const images = dto.images?.map((img: any) => ({
        idPropertyImage: img.idPropertyImage,
        idProperty: img.idProperty,
        file: img.file,
        enabled: img.enabled
      })) || (dto.image ? [{
        idPropertyImage: 'img-0',
        idProperty: dto.idProperty,
        file: dto.image,
        enabled: true
      }] : []);

      const owner = dto.owner ? {
        idOwner: dto.owner.idOwner,
        name: dto.owner.name,
        address: dto.owner.address,
        birthday: dto.owner.birthday,
        photo: dto.owner.photo
      } : undefined;

      const traces = dto.traces?.map((trace: any) => ({
        idPropertyTrace: trace.idPropertyTrace,
        dateSale: trace.dateSale,
        idProperty: trace.idProperty,
        name: trace.name,
        tax: trace.tax,
        value: trace.value
      })) || undefined;

      return new Property(
        dto.idProperty || dto.id,
        dto.name || 'Untitled Property',
        dto.name || 'Property description',
        dto.price || 0,
        'USD',
        dto.address || 'Unknown location',
        this.mapPropertyType('House'),
        0,
        AreaUnit.M2,
        [],
        images,
        PropertyStatus.AVAILABLE,
        dto.year ? new Date(dto.year, 0, 1) : new Date(),
        new Date(),
        0,
        0,
        dto.year,
        owner,
        traces
      );
    }
    
    // Handle old MockPropertyDto format
    const isMockFormat = 'name' in dto && 'address' in dto && !isNewBackendFormat;
    
    if (isMockFormat) {
      // Map from MockPropertyDto format
      return new Property(
        dto.id,
        dto.name || 'Untitled Property',
        `Beautiful property located at ${dto.address}, ${dto.city}`,
        dto.price,
        'USD',
        `${dto.address}, ${dto.city}`,
        this.mapPropertyType(dto.propertyType),
        dto.area || 0,
        this.mapAreaUnit(dto.areaUnit),
        [],
        dto.image ? [dto.image] : [],
        PropertyStatus.AVAILABLE,
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapEntityToDto(entity: Property): any {
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
