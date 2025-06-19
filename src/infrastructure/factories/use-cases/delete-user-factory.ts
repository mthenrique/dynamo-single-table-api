import { DeleteUserUseCase } from '@/application/use-cases/delete-user-use-case';

import { UserRepositoryFactory } from '../repositories/user-repository-factory';

export class DeleteUserFactory {
  public make(): DeleteUserUseCase {
    const userRepository = new UserRepositoryFactory().make();
    return new DeleteUserUseCase(userRepository);
  }
}
