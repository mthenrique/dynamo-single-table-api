import { User, UserKeys } from '@/domain/entities/user';
import { BaseError } from '@/domain/errors/base-error';
import { ExceptionError } from '@/domain/errors/exception-error';
import { IBaseRepository } from '@/domain/repositories/i-base-repository';
import { v4 as uuidv4 } from 'uuid';

import { CreateUserInputDTO } from '../dtos/user-dtos';

export class CreateUserUseCase {
  constructor(private readonly userRepository: IBaseRepository<User>) {}

  public async execute(userData: CreateUserInputDTO): Promise<User> {
    try {
      const userId = uuidv4();
      const user: Omit<User, 'createdAt' | 'updatedAt'> = {
        ...userData,
        PK: UserKeys.generatePK(userId),
        SK: UserKeys.generateSK(userId),
        type: 'USER',
        GSI1PK: UserKeys.generateGSI1PK(userData.email),
        GSI1SK: UserKeys.generateGSI1SK(),
        GSI2PK: UserKeys.generateGSI2PK(userData.status),
        GSI2SK: UserKeys.generateGSI2SK(userId),
      };

      const createdUser = await this.userRepository.create(user);

      return {
        id: userId,
        ...createdUser,
      };
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }

      throw new ExceptionError('Unexpected error occurred while creating user');
    }
  }
}
