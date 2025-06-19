import { User } from '../../../domain/entities/user';
import { IBaseRepository } from '../../../domain/repositories/i-base-repository';
import { env } from '../../config/env';
import { DynamoDBRepository } from '../../repositories/dynamodb-user-repository';

export class UserRepositoryFactory {
  public make(): IBaseRepository<User> {
    return new DynamoDBRepository<User>(env.DYNAMODB_TABLE_NAME);
  }
}
