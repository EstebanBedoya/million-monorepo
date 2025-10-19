import { OwnerRepository } from '@/domain/repositories/OwnerRepository';

export interface CreateOwnerInput {
  name: string;
  address: string;
  photo?: string;
  birthday: string;
}

export class CreateOwnerUseCase {
  constructor(private ownerRepository: OwnerRepository) {}

  async execute(input: CreateOwnerInput) {
    return await this.ownerRepository.create(input);
  }
}

