import { UpdateUserUseCase } from '@/application/use-cases/update-user-use-case';

import { UserRepositoryFactory } from '../repositories/user-repository-factory';

export class UpdateUserFactory {
  public make(): UpdateUserUseCase {
    const userRepository = new UserRepositoryFactory().make();
    return new UpdateUserUseCase(userRepository);
  }
}
