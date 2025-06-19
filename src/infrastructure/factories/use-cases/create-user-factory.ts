import { CreateUserUseCase } from '@/application/use-cases/create-user-use-case';

import { UserRepositoryFactory } from '../repositories/user-repository-factory';

export class CreateUserFactory {
  public make(): CreateUserUseCase {
    const userRepository = new UserRepositoryFactory().make();
    return new CreateUserUseCase(userRepository);
  }
}
