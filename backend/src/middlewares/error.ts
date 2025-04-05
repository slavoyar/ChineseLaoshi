import { isCustomError } from '@configs/errors';
import type { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorMiddleware = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  if (isCustomError(err)) {
    return res.status(err.statusCode).json(err);
  }
  if (err instanceof JsonWebTokenError) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  res.status(500).json(err);
};
