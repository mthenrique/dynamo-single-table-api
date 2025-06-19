import { Router } from 'express';

import { UserController } from '../controllers/user-controller';

export const createUserRoutes = (): Router => {
  const router = Router();

  const userController = new UserController();

  router.get('/', (req, res) => {
    res.send('Welcome to the DynamoDB test API');
  });

  router.get('/health', (req, res) => {
    res.sendStatus(200);
  });

  router.post('/users', userController.createUser);
  router.get('/users/:id', userController.getUserById);
  router.get('/users/email/:email', userController.getUserByEmail);
  router.get('/users/status/:status', userController.getUsersByStatus);
  router.put('/users', userController.updateUser);
  router.delete('/users/:id', userController.deleteUser);

  return router;
};
