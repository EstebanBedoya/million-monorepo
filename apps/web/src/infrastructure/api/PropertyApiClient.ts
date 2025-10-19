import { PropertyDto, CreatePropertyDto, UpdatePropertyDto } from '@/shared/contracts/property.dto';
import { HttpClient, RequestConfig } from '@/infrastructure/http/HttpClient';

export interface PropertyApiFilters {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  status?: string;
  city?: string;
  bedrooms?: number;
  bathrooms?: number;
}

export interface PropertyApiPagination {
  page: number;
  limit: number;
}

export interface PropertyApiResponse {
  properties: PropertyDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class PropertyApiClient {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async fetchProperties(
    filters: PropertyApiFilters = {},
    pagination: PropertyApiPagination = { page: 1, limit: 12 }
  ): Promise<PropertyApiResponse> {
    const params = new URLSearchParams();
    params.set('page', pagination.page.toString());
    params.set('limit', pagination.limit.toString());
    
    if (filters.search) params.set('search', filters.search);
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.propertyType) params.set('propertyType', filters.propertyType);
    if (filters.status) params.set('status', filters.status);
    if (filters.city) params.set('city', filters.city);
    if (filters.bedrooms) params.set('bedrooms', filters.bedrooms.toString());
    if (filters.bathrooms) params.set('bathrooms', filters.bathrooms.toString());

    const config: RequestConfig = {
      retry: true,
      skipLogging: false,
    };

    return await this.httpClient.get<PropertyApiResponse>(
      `/properties?${params.toString()}`,
      config
    );
  }

  async fetchPropertyById(id: string): Promise<PropertyDto> {
    const config: RequestConfig = {
      retry: true,
      skipLogging: false,
    };

    return await this.httpClient.get<PropertyDto>(`/properties/${id}`, config);
  }

  async createProperty(propertyData: CreatePropertyDto): Promise<PropertyDto> {
    const config: RequestConfig = {
      retry: false,
      skipLogging: false,
    };

    return await this.httpClient.post<PropertyDto>('/properties', propertyData, config);
  }

  async updateProperty(id: string, propertyData: UpdatePropertyDto): Promise<PropertyDto> {
    const config: RequestConfig = {
      retry: false,
      skipLogging: false,
    };

    return await this.httpClient.put<PropertyDto>(`/properties/${id}`, propertyData, config);
  }

  async deleteProperty(id: string): Promise<void> {
    const config: RequestConfig = {
      retry: false,
      skipLogging: false,
    };

    await this.httpClient.delete(`/properties/${id}`, config);
  }
}
