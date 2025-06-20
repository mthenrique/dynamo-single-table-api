import { AuthenticationError } from '@/domain/errors/authentication-error';
import { ExceptionError } from '@/domain/errors/exception-error';
import { NotFoundError } from '@/domain/errors/not-found-error';
import { ParametersError } from '@/domain/errors/parameters-error';
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const error = new NotFoundError(`Route ${req.method} ${req.path} not found`);
  next(error);
};

export const globalErrorHandler: ErrorRequestHandler = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  if (response.headersSent) {
    return;
  }

  if (error instanceof AuthenticationError) {
    response.status(401).json({
      ...error,
      status: 'error',
      message: error.message,
    });
  } else if (error instanceof ParametersError) {
    response.status(400).json({
      ...error,
      status: 'error',
      message: error.message,
      parameters: error.parameters,
    });
  } else if (error instanceof NotFoundError) {
    response.status(404).json({
      ...error,
      status: 'error',
      message: error.message,
    });
  } else if (error instanceof ExceptionError) {
    response.status(500).json({
      ...error,
      status: 'error',
      message: error.message,
    });
  } else {
    response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }

  console.error('❌ Error: ', error);

  next();
};
