import { PropertyService, CreatePropertyData } from '../interfaces/PropertyService';
import { Property, Location, Coordinates } from '../../domain/entities/Property';
import { PaginatedResult } from '../../domain/repositories/PropertyRepository';
import { PropertyRepository } from '../../domain/repositories/PropertyRepository';

// Service implementation - simplified without use cases
export class PropertyServiceImpl implements PropertyService {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async getProperty(id: string): Promise<Property | null> {
    // Simple validation
    if (!id || id.trim() === '') {
      throw new Error('Property ID is required');
    }
    return await this.propertyRepository.findById(id);
  }

  async getAllProperties(page?: number, limit?: number): Promise<PaginatedResult<Property>> {
    return await this.propertyRepository.findWithPagination({ 
      page: page || 1, 
      limit: limit || 12 
    });
  }

  async createProperty(propertyData: CreatePropertyData): Promise<Property> {
    // Simple validation
    if (!propertyData.title || propertyData.title.trim() === '') {
      throw new Error('Property title is required');
    }
    if (propertyData.price <= 0) {
      throw new Error('Property price must be greater than 0');
    }

    // Create property entity
    const now = new Date();
    const location = new Location(
      propertyData.location.address,
      propertyData.location.city,
      propertyData.location.state,
      propertyData.location.country,
      propertyData.location.coordinates 
        ? new Coordinates(propertyData.location.coordinates.lat, propertyData.location.coordinates.lng)
        : undefined
    );
    
    const property = new Property(
      crypto.randomUUID(),
      propertyData.title,
      propertyData.description,
      propertyData.price,
      propertyData.currency,
      location,
      propertyData.propertyType as Property['propertyType'],
      propertyData.area,
      propertyData.areaUnit as Property['areaUnit'],
      propertyData.features,
      propertyData.images,
      'available' as Property['status'], // PropertyStatus.AVAILABLE
      now,
      now,
      propertyData.bedrooms,
      propertyData.bathrooms
    );

    return await this.propertyRepository.save(property);
  }

  async getAvailableProperties(): Promise<Property[]> {
    // Simple business logic
    const allProperties = await this.propertyRepository.findAll();
    return allProperties.filter(property => property.isAvailable());
  }

  async getExpensiveProperties(): Promise<Property[]> {
    // Simple business logic
    const allProperties = await this.propertyRepository.findAll();
    return allProperties.filter(property => property.isExpensive());
  }
}
