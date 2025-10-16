import { MockPropertyType } from '../../domain/schemas/property.schema';

export interface PropertyFilters {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
}

export interface PropertyPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PropertyResponse {
  properties: MockPropertyType[];
  pagination: PropertyPagination;
}

export interface PropertyServiceConfig {
  baseUrl: string;
  timeout?: number;
  simulateErrors?: boolean;
  errorRate?: number; // 0-1, probability of error
  errorTypes?: ('timeout' | 'server' | 'network')[];
}

export class PropertyServiceClient {
  private config: PropertyServiceConfig;

  constructor(config: PropertyServiceConfig) {
    this.config = {
      timeout: 5000,
      simulateErrors: false,
      errorRate: 0.1,
      errorTypes: ['server', 'timeout', 'network'],
      ...config
    };
  }

  async getProperties(
    filters: PropertyFilters = {},
    pagination: { page: number; limit: number } = { page: 1, limit: 12 }
  ): Promise<PropertyResponse> {
    // Simulate errors if enabled
    if (this.config.simulateErrors && Math.random() < this.config.errorRate!) {
      await this.simulateError();
    }

    const params = new URLSearchParams();
    params.set('page', pagination.page.toString());
    params.set('limit', pagination.limit.toString());
    
    if (filters.search) params.set('search', filters.search);
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.propertyType) params.set('propertyType', filters.propertyType);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(`${this.config.baseUrl}?${params.toString()}`, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - please try again');
        }
        throw error;
      }
      
      throw new Error('Network error - please check your connection');
    }
  }

  private async simulateError(): Promise<never> {
    const errorType = this.config.errorTypes![Math.floor(Math.random() * this.config.errorTypes!.length)];
    
    switch (errorType) {
      case 'timeout':
        // Simulate timeout by waiting longer than the timeout
        await new Promise(resolve => setTimeout(resolve, this.config.timeout! + 1000));
        throw new Error('Request timeout - please try again');
        
      case 'server':
        throw new Error('HTTP 500: Internal Server Error');
        
      case 'network':
        throw new Error('Network error - please check your connection');
        
      default:
        throw new Error('Unknown error occurred');
    }
  }

  // Method to enable/disable error simulation for testing
  setErrorSimulation(enabled: boolean, errorRate: number = 0.1) {
    this.config.simulateErrors = enabled;
    this.config.errorRate = errorRate;
  }

  // Method to set specific error types for testing
  setErrorTypes(errorTypes: ('timeout' | 'server' | 'network')[]) {
    this.config.errorTypes = errorTypes;
  }
}
