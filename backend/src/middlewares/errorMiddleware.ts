import { isCustomError } from '@configs/errors';
import { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorMiddleware = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  if (isCustomError(err)) {
    return res.status(err.statusCode).json(err);
  }
  res.status(500).json(err);
};
