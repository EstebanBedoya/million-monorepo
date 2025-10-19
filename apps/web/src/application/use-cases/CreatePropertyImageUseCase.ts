import { PropertyImageApiClient } from '@/infrastructure/api/PropertyImageApiClient';

export interface CreatePropertyImageInput {
  propertyId: string;
  file: string;
  enabled: boolean;
}

export class CreatePropertyImageUseCase {
  constructor(private propertyImageApiClient: PropertyImageApiClient) {}

  async execute(input: CreatePropertyImageInput) {
    return await this.propertyImageApiClient.createPropertyImage(
      input.propertyId,
      {
        file: input.file,
        enabled: input.enabled,
      }
    );
  }
}

