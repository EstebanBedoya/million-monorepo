import { Property, PropertyType, PropertyStatus, Location, Coordinates, AreaUnit } from '../../domain/entities/Property';
import { PropertyRepository } from '../../domain/repositories/PropertyRepository';

// Use Case for creating a new property
export class CreatePropertyUseCase {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async execute(propertyData: {
    title: string;
    description: string;
    price: number;
    currency: string;
    location: {
      address: string;
      city: string;
      state: string;
      country: string;
      coordinates?: { lat: number; lng: number };
    };
    propertyType: PropertyType;
    bedrooms?: number;
    bathrooms?: number;
    area: number;
    areaUnit: AreaUnit;
    features: string[];
    images: string[];
  }): Promise<Property> {
    // Simple validation
    if (!propertyData.title || propertyData.title.trim() === '') {
      throw new Error('Property title is required');
    }

    if (propertyData.price <= 0) {
      throw new Error('Property price must be greater than 0');
    }

    // Create domain objects
    const location = new Location(
      propertyData.location.address,
      propertyData.location.city,
      propertyData.location.state,
      propertyData.location.country,
      propertyData.location.coordinates 
        ? new Coordinates(propertyData.location.coordinates.lat, propertyData.location.coordinates.lng)
        : undefined
    );

    const now = new Date();
    const property = new Property(
      crypto.randomUUID(), // Simple ID generation
      propertyData.title,
      propertyData.description,
      propertyData.price,
      propertyData.currency,
      location,
      propertyData.propertyType,
      propertyData.bedrooms,
      propertyData.bathrooms,
      propertyData.area,
      propertyData.areaUnit,
      propertyData.features,
      propertyData.images,
      PropertyStatus.AVAILABLE,
      now,
      now
    );

    return await this.propertyRepository.save(property);
  }
}
