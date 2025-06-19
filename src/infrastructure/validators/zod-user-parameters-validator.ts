import {
  CreateUserInputDTO,
  UpdateUserInputDTO,
} from '@/application/dtos/user-dtos';
import { User } from '@/domain/entities/user';
import { ParametersError } from '@/domain/errors/parameters-error';
import { IUserParametersValidator } from '@/domain/validators/user-parameters-validator';
import { z } from 'zod';

export class ZodUserParametersValidator implements IUserParametersValidator {
  public createUser(userData: CreateUserInputDTO): CreateUserInputDTO {
    const schema = z.object({
      email: z.string().email(),
      name: z.string().min(1),
      status: z.enum(['ACTIVE', 'INACTIVE']),
      preferences: z.object({
        theme: z.enum(['LIGHT', 'DARK']),
        notifications: z.boolean(),
      }),
    });

    const result = schema.safeParse(userData);

    if (!result.success) {
      throw new ParametersError(
        'Create user parameters validation failed',
        result.error.flatten().fieldErrors,
      );
    }

    return result.data;
  }

  public getUserById(userId: string): string {
    const schema = z.object({
      id: z.string().uuid(),
    });

    const result = schema.safeParse({ id: userId });

    if (!result.success) {
      throw new ParametersError(
        'Get user by id parameters validation failed',
        result.error.flatten().fieldErrors,
      );
    }

    return result.data.id;
  }

  public getUserByEmail(userEmail: string): string {
    const schema = z.object({
      email: z.string().email(),
    });

    const result = schema.safeParse({ email: userEmail });

    if (!result.success) {
      throw new ParametersError(
        'Get user by email parameters validation failed',
        result.error.flatten().fieldErrors,
      );
    }

    return result.data.email;
  }

  public getUsersByStatus(userStatus: string): User['status'] {
    const schema = z.object({
      status: z.enum(['ACTIVE', 'INACTIVE']),
    });

    const result = schema.safeParse({ status: userStatus });

    if (!result.success) {
      throw new ParametersError(
        'Get users by status parameters validation failed',
        result.error.flatten().fieldErrors,
      );
    }

    return result.data.status;
  }

  public updateUser(userData: UpdateUserInputDTO): UpdateUserInputDTO {
    const schema = z.object({
      id: z.string().uuid(),
      name: z.string().min(1).optional(),
      preferences: z
        .object({
          theme: z.enum(['LIGHT', 'DARK']),
          notifications: z.boolean(),
        })
        .optional(),
    });

    const result = schema.safeParse(userData);

    if (!result.success) {
      throw new ParametersError(
        'Update user parameters validation failed',
        result.error.flatten().fieldErrors,
      );
    }

    return result.data;
  }

  public deleteUser(userId: string): string {
    const schema = z.object({
      id: z.string().uuid(),
    });

    const result = schema.safeParse({ id: userId });

    if (!result.success) {
      throw new ParametersError(
        'Delete user parameters validation failed',
        result.error.flatten().fieldErrors,
      );
    }

    return result.data.id;
  }
}
