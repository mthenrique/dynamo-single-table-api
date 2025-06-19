import { User, UserKeys } from '@/domain/entities/user';
import { BaseError } from '@/domain/errors/base-error';
import { ExceptionError } from '@/domain/errors/exception-error';
import { NotFoundError } from '@/domain/errors/not-found-error';
import { IBaseRepository } from '@/domain/repositories/i-base-repository';

import { GetUsersByStatusDTO } from '../dtos/user-dtos';

export class GetUserByStatusUseCase {
  constructor(private readonly userRepository: IBaseRepository<User>) {}

  public async execute({ status }: GetUsersByStatusDTO): Promise<User[]> {
    try {
      const GSI2PK = UserKeys.generateGSI2PK(status);
      const users = await this.userRepository.queryByGSI2PK(GSI2PK);

      if (!users.length) {
        throw new NotFoundError(`Users with status ${status} not found`);
      }

      return users.map(user => {
        const userId = user.PK.replace('USER#', '');
        return {
          id: userId,
          ...user,
        };
      });
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }

      throw new ExceptionError('Failed to get users by status');
    }
  }
}
