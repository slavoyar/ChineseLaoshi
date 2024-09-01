import { NextFunction, Request, Response } from 'express';

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  const originalSend = res.send;

  res.send = (...args) => {
    const endTime = Date.now();
    const elapsedTime = endTime - startTime;

    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} - ${elapsedTime}ms`,
    );

    return originalSend.apply(res, args);
  };

  next();
};
