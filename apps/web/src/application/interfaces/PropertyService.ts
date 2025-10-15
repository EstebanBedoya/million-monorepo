import { Property } from '../../domain/entities/Property';
import { PaginatedResult } from '../../domain/repositories/PropertyRepository';

// Type for creating new properties
export interface CreatePropertyData {
  title: string;
  description: string;
  price: number;
  currency: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  propertyType: string;
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  areaUnit: string;
  features: string[];
  images: string[];
  status: string;
}

// Service interface - defines application services
export interface PropertyService {
  getProperty(id: string): Promise<Property | null>;
  getAllProperties(page?: number, limit?: number): Promise<PaginatedResult<Property>>;
  createProperty(propertyData: CreatePropertyData): Promise<Property>;
  getAvailableProperties(): Promise<Property[]>;
  getExpensiveProperties(): Promise<Property[]>;
}
