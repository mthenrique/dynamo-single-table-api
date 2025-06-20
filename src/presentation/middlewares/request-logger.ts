import { Request, Response, NextFunction } from 'express';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const start = Date.now();

  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.path} - Started`,
  );

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.path} - ${
        res.statusCode
      } - ${duration}ms`,
    );
  });

  next();
};
