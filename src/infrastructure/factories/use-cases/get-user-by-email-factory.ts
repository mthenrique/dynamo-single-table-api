import { GetUserByEmailUseCase } from '@/application/use-cases/get-user-by-email-use-case';

import { UserRepositoryFactory } from '../repositories/user-repository-factory';

export class GetUserByEmailFactory {
  public make(): GetUserByEmailUseCase {
    const userRepository = new UserRepositoryFactory().make();
    return new GetUserByEmailUseCase(userRepository);
  }
}
