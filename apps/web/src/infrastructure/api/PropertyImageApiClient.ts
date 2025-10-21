import { HttpClient, RequestConfig } from '@/infrastructure/http/HttpClient';

export interface PropertyImageDto {
  idPropertyImage: string;
  idProperty: string;
  file: string;
  enabled: boolean;
}

export interface PropertyImageListDto {
  images: PropertyImageDto[];
  total: number;
}

export interface CreatePropertyImageDto {
  file: string;
  enabled?: boolean;
}

export interface UpdatePropertyImageDto {
  file?: string;
  enabled?: boolean;
}

export class PropertyImageApiClient {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async fetchPropertyImages(
    propertyId: string,
    enabledOnly?: boolean
  ): Promise<PropertyImageListDto> {
    const params = new URLSearchParams();
    if (enabledOnly !== undefined) {
      params.set('enabledOnly', enabledOnly.toString());
    }

    const config: RequestConfig = {
      retry: true,
      skipLogging: false,
    };

    const queryString = params.toString();
    const url = queryString 
      ? `/properties/${propertyId}/images?${queryString}`
      : `/properties/${propertyId}/images`;

    return await this.httpClient.get<PropertyImageListDto>(url, config);
  }

  async createPropertyImage(
    propertyId: string,
    imageData: CreatePropertyImageDto
  ): Promise<PropertyImageDto> {
    const config: RequestConfig = {
      retry: false,
      skipLogging: false,
    };

    return await this.httpClient.post<PropertyImageDto>(
      `/properties/${propertyId}/images`,
      imageData,
      config
    );
  }

  async updatePropertyImage(
    propertyId: string,
    imageId: string,
    imageData: UpdatePropertyImageDto
  ): Promise<PropertyImageDto> {
    const config: RequestConfig = {
      retry: false,
      skipLogging: false,
    };

    return await this.httpClient.put<PropertyImageDto>(
      `/properties/${propertyId}/images/${imageId}`,
      imageData,
      config
    );
  }

  async deletePropertyImage(propertyId: string, imageId: string): Promise<void> {
    const config: RequestConfig = {
      retry: false,
      skipLogging: false,
    };

    await this.httpClient.delete(`/properties/${propertyId}/images/${imageId}`, config);
  }
}

