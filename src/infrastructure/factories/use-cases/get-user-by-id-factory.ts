import { GetUserByIdUseCase } from '@/application/use-cases/get-user-by-id-use-case';

import { UserRepositoryFactory } from '../repositories/user-repository-factory';

export class GetUserByIdFactory {
  public make(): GetUserByIdUseCase {
    const userRepository = new UserRepositoryFactory().make();
    return new GetUserByIdUseCase(userRepository);
  }
}
