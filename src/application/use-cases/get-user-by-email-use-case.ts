import { User, UserKeys } from '@/domain/entities/user';
import { BaseError } from '@/domain/errors/base-error';
import { ExceptionError } from '@/domain/errors/exception-error';
import { NotFoundError } from '@/domain/errors/not-found-error';
import { IBaseRepository } from '@/domain/repositories/i-base-repository';

import { GetUserByEmailDTO } from '../dtos/user-dtos';

export class GetUserByEmailUseCase {
  constructor(private readonly userRepository: IBaseRepository<User>) {}

  public async execute({ email }: GetUserByEmailDTO): Promise<User | null> {
    try {
      const GSI1PK = UserKeys.generateGSI1PK(email);
      const GSI1SK = UserKeys.generateGSI1SK();
      const users = await this.userRepository.queryByGSI1(GSI1PK, GSI1SK);

      if (!users.length) {
        throw new NotFoundError(`User with email ${email} not found`);
      }

      const [user] = users;

      // Extrai o id do PK (USER#id)
      const userId = user.PK.replace('USER#', '');

      // Adiciona o id ao objeto retornado
      return {
        id: userId,
        ...user,
      };
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }

      throw new ExceptionError('Failed to get user by email');
    }
  }
}
