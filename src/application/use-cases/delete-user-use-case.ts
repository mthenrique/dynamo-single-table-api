import { User, UserKeys } from '@/domain/entities/user';
import { BaseError } from '@/domain/errors/base-error';
import { ExceptionError } from '@/domain/errors/exception-error';
import { IBaseRepository } from '@/domain/repositories/i-base-repository';

import { DeleteUserDTO } from '../dtos/user-dtos';

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IBaseRepository<User>) {}

  public async execute({ id }: DeleteUserDTO): Promise<void> {
    try {
      const PK = UserKeys.generatePK(id);
      const SK = UserKeys.generateSK(id);
      await this.userRepository.delete(PK, SK);
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }

      throw new ExceptionError('Failed to delete user');
    }
  }
}
