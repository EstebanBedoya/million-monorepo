import { MockPropertySchema, MockPropertyListSchema, MockPropertyType } from '../../domain/schemas/property.schema';

// Adapter for handling property data with Zod validation
export class PropertyAdapter {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  // Fetch all properties with pagination and filters
  async getProperties(params: {
    page?: number;
    limit?: number;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
  } = {}): Promise<{
    properties: MockPropertyType[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.search) searchParams.set('search', params.search);
    if (params.minPrice) searchParams.set('minPrice', params.minPrice.toString());
    if (params.maxPrice) searchParams.set('maxPrice', params.maxPrice.toString());

    const url = `${this.baseUrl}/api/mock/properties?${searchParams.toString()}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Validate the response structure
      const validatedData = MockPropertyListSchema.parse(data.properties);
      
      return {
        properties: validatedData,
        pagination: data.pagination,
      };
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw new Error('Failed to fetch properties');
    }
  }

  // Fetch single property by ID
  async getPropertyById(id: string): Promise<MockPropertyType> {
    const url = `${this.baseUrl}/api/mock/properties/${id}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Property not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Validate the response data
      const validatedProperty = MockPropertySchema.parse(data);
      
      return validatedProperty;
    } catch (error) {
      console.error('Error fetching property:', error);
      throw new Error(`Failed to fetch property with id: ${id}`);
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const url = `${this.baseUrl}/api/mock/health`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking health:', error);
      throw new Error('Failed to check health');
    }
  }
}
