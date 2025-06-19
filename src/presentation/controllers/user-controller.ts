import { CreateUserParametersFactory } from '@/infrastructure/factories/parameters/create-user-parameters-factory';
import { CreateUserFactory } from '@/infrastructure/factories/use-cases/create-user-factory';
import { DeleteUserFactory } from '@/infrastructure/factories/use-cases/delete-user-factory';
import { GetUserByEmailFactory } from '@/infrastructure/factories/use-cases/get-user-by-email-factory';
import { GetUserByIdFactory } from '@/infrastructure/factories/use-cases/get-user-by-id-factory';
import { GetUserByStatusFactory } from '@/infrastructure/factories/use-cases/get-user-by-status-factory';
import { UpdateUserFactory } from '@/infrastructure/factories/use-cases/update-user-factory';
import { Request, Response } from 'express';

export class UserController {
  public async createUser(req: Request, res: Response): Promise<void> {
    const createUserParametersFactory =
      new CreateUserParametersFactory().make();
    const { email, name, status, preferences } =
      createUserParametersFactory.createUser(req.body);

    const createUserUseCase = new CreateUserFactory().make();
    const user = await createUserUseCase.execute({
      email,
      name,
      status,
      preferences: preferences || {
        theme: 'LIGHT',
        notifications: true,
      },
    });
    res.status(201).json(user);
  }

  public async getUserById(req: Request, res: Response): Promise<void> {
    const getUserByIdParametersFactory =
      new CreateUserParametersFactory().make();

    const getUserByIdUseCase = new GetUserByIdFactory().make();
    const user = await getUserByIdUseCase.execute({
      id: getUserByIdParametersFactory.getUserById(req.params.id),
    });

    res.json(user);
  }

  public async getUserByEmail(req: Request, res: Response): Promise<void> {
    const getUserByEmailParametersFactory =
      new CreateUserParametersFactory().make();
    const email = getUserByEmailParametersFactory.getUserByEmail(
      req.params.email,
    );

    const getUserByEmailUseCase = new GetUserByEmailFactory().make();
    const user = await getUserByEmailUseCase.execute({ email });

    res.json(user);
  }

  public async getUsersByStatus(req: Request, res: Response): Promise<void> {
    const getUsersByStatusParametersFactory =
      new CreateUserParametersFactory().make();
    const status = getUsersByStatusParametersFactory.getUsersByStatus(
      req.params.status,
    );

    const getUsersByStatusUseCase = new GetUserByStatusFactory().make();
    const users = await getUsersByStatusUseCase.execute({ status });

    res.json(users);
  }

  public async updateUser(req: Request, res: Response): Promise<void> {
    const updateUserParametersFactory =
      new CreateUserParametersFactory().make();
    const { id, name, preferences } = updateUserParametersFactory.updateUser(
      req.body,
    );

    const updateUserUseCase = new UpdateUserFactory().make();
    const user = await updateUserUseCase.execute({
      id,
      name,
      preferences: preferences || {
        theme: 'LIGHT',
        notifications: true,
      },
    });
    res.json(user);
  }

  public async deleteUser(req: Request, res: Response): Promise<void> {
    const deleteUserParametersFactory =
      new CreateUserParametersFactory().make();

    const deleteUserUseCase = new DeleteUserFactory().make();
    await deleteUserUseCase.execute({
      id: deleteUserParametersFactory.deleteUser(req.params.id),
    });

    res.status(204).send();
  }
}
