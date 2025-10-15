import { Property, PropertyType, PropertyStatus, Location, Coordinates, AreaUnit } from '../../domain/entities/Property';
import { PropertyDto } from '../../../../shared/contracts/property.dto';

// Mapper for converting between domain entities and DTOs
export class PropertyMapper {
  static toDomain(dto: PropertyDto): Property {
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
      dto.propertyType as PropertyType,
      dto.bedrooms,
      dto.bathrooms,
      dto.area,
      dto.areaUnit as AreaUnit,
      dto.features,
      dto.images,
      dto.status as PropertyStatus,
      new Date(dto.createdAt),
      new Date(dto.updatedAt)
    );
  }

  static toDto(property: Property): PropertyDto {
    return {
      id: property.id,
      title: property.title,
      description: property.description,
      price: property.price,
      currency: property.currency,
      location: {
        address: property.location.address,
        city: property.location.city,
        state: property.location.state,
        country: property.location.country,
        coordinates: property.location.coordinates 
          ? {
              lat: property.location.coordinates.lat,
              lng: property.location.coordinates.lng
            }
          : undefined
      },
      propertyType: property.propertyType,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      areaUnit: property.areaUnit,
      features: property.features,
      images: property.images,
      status: property.status,
      createdAt: property.createdAt.toISOString(),
      updatedAt: property.updatedAt.toISOString()
    };
  }
}
