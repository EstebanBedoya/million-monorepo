import { PropertyService, CreatePropertyData } from '../interfaces/PropertyService';
import { Property, PropertyStatus } from '../../domain/entities/Property';
import { PaginatedResult } from '../../domain/repositories/PropertyRepository';
import { PropertyRepository } from '../../domain/repositories/PropertyRepository';

/**
 * PropertyServiceImpl provides the application-level implementation for all property-related
 * service operations, including property retrieval, listing, creation, and specialized queries.
 * 
 * This class acts as an intermediary between the domain repository (PropertyRepository)
 * and higher layers (controllers/use cases), encapsulating any business logic required when
 * handling properties.
 *
 * Methods in this implementation:
 * - Ensure input validation for key operations (e.g., property creation, ID presence).
 * - Support pagination for property lists via getAllProperties.
 * - Surface domain and application errors in a manner suitable for use in controllers.
 * - Default to newly created properties being available.
 *
 * Dependencies:
 * - Requires a PropertyRepository instance, which must implement persistence logic for properties.
 */

export class PropertyServiceImpl implements PropertyService {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async getProperty(id: string): Promise<Property | null> {
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
    if (!propertyData.name || propertyData.name.trim() === '') {
      throw new Error('Property name is required');
    }
    if (propertyData.price <= 0) {
      throw new Error('Property price must be greater than 0');
    }

    const now = new Date();
    
    const property = new Property(
      crypto.randomUUID(),
      propertyData.name,
      propertyData.description,
      propertyData.price,
      propertyData.currency,
      propertyData.location,
      propertyData.propertyType as Property['propertyType'],
      propertyData.area,
      propertyData.areaUnit as Property['areaUnit'],
      propertyData.features,
      propertyData.images,
      PropertyStatus.AVAILABLE,
      now,
      now,
      propertyData.bedrooms,
      propertyData.bathrooms
    );

    return await this.propertyRepository.save(property);
  }

  async updateProperty(property: Property): Promise<Property> {
    if (!property.id || property.id.trim() === '') {
      throw new Error('Property ID is required');
    }
    if (!property.name || property.name.trim() === '') {
      throw new Error('Property name is required');
    }
    if (property.price <= 0) {
      throw new Error('Property price must be greater than 0');
    }

    const existingProperty = await this.propertyRepository.findById(property.id);
    if (!existingProperty) {
      throw new Error('Property not found');
    }

    return await this.propertyRepository.update(property);
  }

  async deleteProperty(id: string): Promise<void> {
    if (!id || id.trim() === '') {
      throw new Error('Property ID is required');
    }

    const existingProperty = await this.propertyRepository.findById(id);
    if (!existingProperty) {
      throw new Error('Property not found');
    }

    await this.propertyRepository.delete(id);
  }

  async getAvailableProperties(): Promise<Property[]> {
    const allProperties = await this.propertyRepository.findAll();
    return allProperties.filter(property => property.isAvailable());
  }

  async getExpensiveProperties(): Promise<Property[]> {
    const allProperties = await this.propertyRepository.findAll();
    return allProperties.filter(property => property.isExpensive());
  }
}
