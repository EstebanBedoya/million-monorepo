import { PropertyAdapter } from '../infrastructure/adapters/PropertyAdapter';
import { MockPropertyType } from '../domain/schemas/property.schema';

// Example usage of the mock data system
export class MockDataExample {
  private adapter: PropertyAdapter;

  constructor() {
    this.adapter = new PropertyAdapter();
  }

  // Example: Get all properties with pagination
  async getAllProperties() {
    try {
      const result = await this.adapter.getProperties({
        page: 1,
        limit: 10,
      });
      
      console.log('Properties:', result.properties);
      console.log('Pagination:', result.pagination);
      
      return result;
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  }

  // Example: Search properties
  async searchProperties(searchTerm: string) {
    try {
      const result = await this.adapter.getProperties({
        search: searchTerm,
        page: 1,
        limit: 20,
      });
      
      console.log(`Found ${result.properties.length} properties matching "${searchTerm}"`);
      return result;
    } catch (error) {
      console.error('Error searching properties:', error);
      throw error;
    }
  }

  // Example: Filter by price range
  async getPropertiesByPriceRange(minPrice: number, maxPrice: number) {
    try {
      const result = await this.adapter.getProperties({
        minPrice,
        maxPrice,
        page: 1,
        limit: 20,
      });
      
      console.log(`Found ${result.properties.length} properties between $${minPrice} and $${maxPrice}`);
      return result;
    } catch (error) {
      console.error('Error filtering properties by price:', error);
      throw error;
    }
  }

  // Example: Get single property
  async getPropertyDetails(propertyId: string) {
    try {
      const property = await this.adapter.getPropertyById(propertyId);
      
      console.log('Property details:', property);
      return property;
    } catch (error) {
      console.error(`Error fetching property ${propertyId}:`, error);
      throw error;
    }
  }

  // Example: Health check
  async checkSystemHealth() {
    try {
      const health = await this.adapter.healthCheck();
      
      console.log('System health:', health);
      return health;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  // Example: Display property information
  displayProperty(property: MockPropertyType) {
    console.log(`
      Property: ${property.name}
      Address: ${property.address}
      Price: $${property.price.toLocaleString()}
      Owner: ${property.idOwner}
      Image: ${property.image}
    `);
  }

  // Example: Get properties with all filters
  async getFilteredProperties(filters: {
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }) {
    try {
      const result = await this.adapter.getProperties(filters);
      
      console.log(`Found ${result.properties.length} properties with filters:`, filters);
      console.log('Pagination info:', result.pagination);
      
      return result;
    } catch (error) {
      console.error('Error fetching filtered properties:', error);
      throw error;
    }
  }
}

// Example usage
export async function runMockDataExamples() {
  const example = new MockDataExample();

  try {
    // Check system health
    await example.checkSystemHealth();

    // Get all properties
    const allProperties = await example.getAllProperties();
    console.log('Total properties available:', allProperties.pagination.total);

    // Search for specific properties
    const modernProperties = await example.searchProperties('Modern');
    console.log('Modern properties found:', modernProperties.properties.length);

    // Filter by price range
    const expensiveProperties = await example.getPropertiesByPriceRange(1000000, 5000000);
    console.log('Expensive properties found:', expensiveProperties.properties.length);

    // Get specific property details
    if (allProperties.properties.length > 0) {
      const firstProperty = allProperties.properties[0];
      const propertyDetails = await example.getPropertyDetails(firstProperty.id);
      example.displayProperty(propertyDetails);
    }

    // Get properties with multiple filters
    const filteredProperties = await example.getFilteredProperties({
      search: 'Apartment',
      minPrice: 200000,
      maxPrice: 800000,
      page: 1,
      limit: 5,
    });

    console.log('Filtered results:', filteredProperties.properties.length);

  } catch (error) {
    console.error('Error running examples:', error);
  }
}
