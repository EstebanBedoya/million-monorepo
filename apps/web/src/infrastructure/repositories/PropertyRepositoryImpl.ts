import { PropertyRepository, PaginationOptions, PaginatedResult } from '../../domain/repositories/PropertyRepository';
import { Property, PropertyType, PropertyStatus, Location, Coordinates, AreaUnit } from '../../domain/entities/Property';

// Infrastructure implementation - handles data persistence
export class PropertyRepositoryImpl implements PropertyRepository {
  private properties: Property[] = [];

  constructor() {
    // Initialize with sample data
    this.initializeSampleData();
  }

  async findById(id: string): Promise<Property | null> {
    return this.properties.find(property => property.id === id) || null;
  }

  async findAll(): Promise<Property[]> {
    return [...this.properties];
  }

  async findByStatus(status: string): Promise<Property[]> {
    return this.properties.filter(property => property.status === status);
  }

  async findByPriceRange(minPrice: number, maxPrice: number): Promise<Property[]> {
    return this.properties.filter(
      property => property.price >= minPrice && property.price <= maxPrice
    );
  }

  async save(property: Property): Promise<Property> {
    this.properties.push(property);
    return property;
  }

  async update(property: Property): Promise<Property> {
    const index = this.properties.findIndex(p => p.id === property.id);
    if (index !== -1) {
      this.properties[index] = property;
    }
    return property;
  }

  async delete(id: string): Promise<void> {
    this.properties = this.properties.filter(property => property.id !== id);
  }

  private initializeSampleData(): void {
    const now = new Date();
    
    // Sample property 1
    const property1 = new Property(
      '1',
      'Modern Apartment in Downtown',
      'Beautiful modern apartment with city views',
      500000,
      'USD',
      new Location('123 Main St', 'New York', 'NY', 'USA', new Coordinates(40.7128, -74.0060)),
      PropertyType.APARTMENT,
      2,
      2,
      120,
      AreaUnit.M2,
      ['Balcony', 'Parking', 'Gym'],
      ['image1.jpg', 'image2.jpg'],
      PropertyStatus.AVAILABLE,
      now,
      now
    );

    // Sample property 2
    const property2 = new Property(
      '2',
      'Luxury House with Garden',
      'Spacious house with beautiful garden',
      1200000,
      'USD',
      new Location('456 Oak Ave', 'Los Angeles', 'CA', 'USA', new Coordinates(34.0522, -118.2437)),
      PropertyType.HOUSE,
      4,
      3,
      200,
      AreaUnit.M2,
      ['Garden', 'Pool', 'Garage', 'Fireplace'],
      ['image3.jpg', 'image4.jpg'],
      PropertyStatus.AVAILABLE,
      now,
      now
    );

    this.properties = [property1, property2];
  }
}
