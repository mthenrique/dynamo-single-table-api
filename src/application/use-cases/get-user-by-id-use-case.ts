import { User, UserKeys } from '@/domain/entities/user';
import { BaseError } from '@/domain/errors/base-error';
import { ExceptionError } from '@/domain/errors/exception-error';
import { NotFoundError } from '@/domain/errors/not-found-error';
import { IBaseRepository } from '@/domain/repositories/i-base-repository';

import { GetUserByIdDTO } from '../dtos/user-dtos';

export class GetUserByIdUseCase {
  constructor(private readonly userRepository: IBaseRepository<User>) {}

  public async execute({ id }: GetUserByIdDTO): Promise<User | null> {
    try {
      const PK = UserKeys.generatePK(id);
      const SK = UserKeys.generateSK(id);
      const user = await this.userRepository.get(PK, SK);

      if (!user) {
        throw new NotFoundError('User not found');
      }

      return {
        id,
        ...user,
      };
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }

      throw new ExceptionError('Failed to get user by id');
    }
  }
}
