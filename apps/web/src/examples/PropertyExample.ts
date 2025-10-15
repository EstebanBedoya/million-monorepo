// Example usage of Clean Architecture - Simple business logic demonstration
import { PropertyService } from '../application/interfaces/PropertyService';
import { Container } from '../infrastructure/di/Container';
import { PropertyType, AreaUnit } from '../domain/entities/Property';

export class PropertyExample {
  private propertyService: PropertyService;

  constructor() {
    const container = Container.getInstance();
    this.propertyService = container.get<PropertyService>('PropertyService');
  }

  // Example: Get all properties and show basic info
  async demonstrateGetAllProperties(): Promise<void> {
    console.log('=== Getting All Properties ===');
    
    const result = await this.propertyService.getAllProperties(1, 5);
    console.log(`Found ${result.data.length} properties`);
    
    result.data.forEach(property => {
      console.log(`- ${property.title}: ${property.getFormattedPrice()}`);
    });
  }

  // Example: Get available properties only
  async demonstrateAvailableProperties(): Promise<void> {
    console.log('=== Getting Available Properties ===');
    
    const availableProperties = await this.propertyService.getAvailableProperties();
    console.log(`Found ${availableProperties.length} available properties`);
    
    availableProperties.forEach(property => {
      console.log(`- ${property.title} (${property.status})`);
    });
  }

  // Example: Get expensive properties
  async demonstrateExpensiveProperties(): Promise<void> {
    console.log('=== Getting Expensive Properties ===');
    
    const expensiveProperties = await this.propertyService.getExpensiveProperties();
    console.log(`Found ${expensiveProperties.length} expensive properties`);
    
    expensiveProperties.forEach(property => {
      console.log(`- ${property.title}: ${property.getFormattedPrice()}`);
    });
  }

  // Example: Create a new property
  async demonstrateCreateProperty(): Promise<void> {
    console.log('=== Creating New Property ===');
    
    const newPropertyData = {
      title: 'Example Property',
      description: 'This is an example property created through Clean Architecture',
      price: 750000,
      currency: 'USD',
      location: {
        address: '123 Example St',
        city: 'Example City',
        state: 'Example State',
        country: 'USA',
        coordinates: { lat: 40.7128, lng: -74.0060 }
      },
      propertyType: PropertyType.APARTMENT,
      bedrooms: 3,
      bathrooms: 2,
      area: 150,
      areaUnit: AreaUnit.M2,
      features: ['Balcony', 'Parking', 'Gym', 'Pool'],
      images: ['example1.jpg', 'example2.jpg']
    };

    try {
      const newProperty = await this.propertyService.createProperty(newPropertyData);
      console.log(`Created property: ${newProperty.title} - ${newProperty.getFormattedPrice()}`);
    } catch (error) {
      console.error('Error creating property:', error);
    }
  }

  // Example: Run all demonstrations
  async runAllExamples(): Promise<void> {
    try {
      await this.demonstrateGetAllProperties();
      console.log('\n');
      
      await this.demonstrateAvailableProperties();
      console.log('\n');
      
      await this.demonstrateExpensiveProperties();
      console.log('\n');
      
      await this.demonstrateCreateProperty();
    } catch (error) {
      console.error('Error running examples:', error);
    }
  }
}
