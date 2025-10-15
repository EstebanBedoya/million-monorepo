import { PropertyDto } from '../../../../shared/contracts/property.dto';

// API Client for external API calls
export class PropertyApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3001/api') {
    this.baseUrl = baseUrl;
  }

  async fetchProperties(): Promise<PropertyDto[]> {
    try {
      const response = await fetch(`${this.baseUrl}/properties`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.properties || [];
    } catch (error) {
      console.error('Error fetching properties:', error);
      return [];
    }
  }

  async fetchPropertyById(id: string): Promise<PropertyDto | null> {
    try {
      const response = await fetch(`${this.baseUrl}/properties/${id}`);
      if (!response.ok) {
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching property:', error);
      return null;
    }
  }

  async createProperty(propertyData: Partial<PropertyDto>): Promise<PropertyDto | null> {
    try {
      const response = await fetch(`${this.baseUrl}/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating property:', error);
      return null;
    }
  }
}
