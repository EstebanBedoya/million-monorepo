import { HttpClient, RequestConfig } from '@/infrastructure/http/HttpClient';
import { OwnerDto, CreateOwnerDto, UpdateOwnerDto } from '@/domain/entities/Owner';

export interface OwnerApiResponse {
  owners: OwnerDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class OwnerApiClient {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async fetchOwners(
    page: number = 1,
    limit: number = 100,
    search?: string
  ): Promise<OwnerApiResponse> {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', limit.toString());
    if (search) params.set('search', search);

    const config: RequestConfig = {
      retry: true,
      skipLogging: false,
    };

    return await this.httpClient.get<OwnerApiResponse>(
      `/owners?${params.toString()}`,
      config
    );
  }

  async fetchOwnerById(id: string): Promise<OwnerDto> {
    const config: RequestConfig = {
      retry: true,
      skipLogging: false,
    };

    return await this.httpClient.get<OwnerDto>(`/owners/${id}`, config);
  }

  async createOwner(ownerData: CreateOwnerDto): Promise<OwnerDto> {
    const config: RequestConfig = {
      retry: false,
      skipLogging: false,
    };

    return await this.httpClient.post<OwnerDto>('/owners', ownerData, config);
  }

  async updateOwner(id: string, ownerData: UpdateOwnerDto): Promise<OwnerDto> {
    const config: RequestConfig = {
      retry: false,
      skipLogging: false,
    };

    return await this.httpClient.put<OwnerDto>(`/owners/${id}`, ownerData, config);
  }

  async deleteOwner(id: string): Promise<void> {
    const config: RequestConfig = {
      retry: false,
      skipLogging: false,
    };

    await this.httpClient.delete(`/owners/${id}`, config);
  }
}

