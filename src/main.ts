import 'express-async-errors';
import express from 'express';

import { env } from './infrastructure/config/env';
import {
  globalErrorHandler,
  notFoundHandler,
} from './presentation/middlewares/global-error-handler';
import { requestLogger } from './presentation/middlewares/request-logger';
import { createUserRoutes } from './presentation/routes/app-route';

const app = express();

// Middlewares globais
app.use(express.json());
app.use(requestLogger);

// Initialize routes using factory pattern
const appRoutes = createUserRoutes();

app.use(appRoutes);

// Global error handler (must be the last middleware)
app.use(notFoundHandler);
app.use(globalErrorHandler);

app.listen(env.PORT, () => {
  console.log(
    `🚀 Server is running on port ${env.PORT} in ${env.NODE_ENV} mode`,
  );
});
