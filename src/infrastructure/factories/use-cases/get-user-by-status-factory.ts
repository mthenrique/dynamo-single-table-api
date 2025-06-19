import { GetUserByStatusUseCase } from '@/application/use-cases/get-user-by-status-use-case';

import { UserRepositoryFactory } from '../repositories/user-repository-factory';

export class GetUserByStatusFactory {
  public make(): GetUserByStatusUseCase {
    const userRepository = new UserRepositoryFactory().make();
    return new GetUserByStatusUseCase(userRepository);
  }
}
