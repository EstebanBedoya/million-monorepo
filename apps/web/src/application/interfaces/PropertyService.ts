import { Property } from '../../domain/entities/Property';
import { PaginatedResult } from '../../domain/repositories/PropertyRepository';

// Service interface - defines application services
export interface PropertyService {
  getProperty(id: string): Promise<Property | null>;
  getAllProperties(page?: number, limit?: number): Promise<PaginatedResult<Property>>;
  createProperty(propertyData: any): Promise<Property>;
  getAvailableProperties(): Promise<Property[]>;
  getExpensiveProperties(): Promise<Property[]>;
}
