import { Property } from '../../domain/entities/Property';
import { PaginatedResult } from '../../domain/repositories/PropertyRepository';

export interface CreatePropertyData {
  name: string;
  description: string;
  price: number;
  currency: string;
  location: string;
  propertyType: string;
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  areaUnit: string;
  features: string[];
  images: string[];
  status: string;
}

export interface PropertyService {
  getProperty(id: string): Promise<Property | null>;
  getAllProperties(page?: number, limit?: number): Promise<PaginatedResult<Property>>;
  createProperty(propertyData: CreatePropertyData): Promise<Property>;
  getAvailableProperties(): Promise<Property[]>;
  getExpensiveProperties(): Promise<Property[]>;
}
