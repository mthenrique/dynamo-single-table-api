import { User, UserKeys } from '@/domain/entities/user';
import { BaseError } from '@/domain/errors/base-error';
import { ExceptionError } from '@/domain/errors/exception-error';
import { NotFoundError } from '@/domain/errors/not-found-error';
import { IBaseRepository } from '@/domain/repositories/i-base-repository';

import { UpdateUserInputDTO } from '../dtos/user-dtos';

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IBaseRepository<User>) {}

  public async execute(userData: UpdateUserInputDTO): Promise<User> {
    try {
      const PK = UserKeys.generatePK(userData.id);
      const SK = UserKeys.generateSK(userData.id);
      const user = await this.userRepository.get(PK, SK);

      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Filter out undefined values to avoid overwriting existing data
      const updateData: Partial<User> = {};

      if (userData.name !== undefined) {
        updateData.name = userData.name;
      }

      if (userData.preferences !== undefined) {
        updateData.preferences = userData.preferences;
      }

      const updatedUser = {
        ...user,
        ...updateData,
      };

      const result = await this.userRepository.update(PK, SK, updatedUser);

      return {
        id: userData.id,
        ...result,
      };
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }

      throw new ExceptionError('Failed to update user');
    }
  }
}
