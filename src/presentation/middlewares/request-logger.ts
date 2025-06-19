import { Request, Response, NextFunction } from 'express';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const start = Date.now();

  // Log da requisição
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.path} - Started`,
  );

  // Intercepta o final da resposta para logar o tempo
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
