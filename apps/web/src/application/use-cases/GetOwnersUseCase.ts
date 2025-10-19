import { OwnerRepository } from '@/domain/repositories/OwnerRepository';

export class GetOwnersUseCase {
  constructor(private ownerRepository: OwnerRepository) {}

  async execute(page: number = 1, limit: number = 100, search?: string) {
    return await this.ownerRepository.findAll(page, limit, search);
  }
}

