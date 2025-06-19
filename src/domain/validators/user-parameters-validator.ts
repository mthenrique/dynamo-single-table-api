import {
  CreateUserInputDTO,
  UpdateUserInputDTO,
} from '@/application/dtos/user-dtos';

import { User } from '../entities/user';

export interface IUserParametersValidator {
  createUser(userData: CreateUserInputDTO): CreateUserInputDTO;
  updateUser(userData: UpdateUserInputDTO): UpdateUserInputDTO;
  deleteUser(userId: string): string;
  getUserById(userId: string): string;
  getUserByEmail(email: string): string;
  getUsersByStatus(userStatus: User['status']): string;
}
