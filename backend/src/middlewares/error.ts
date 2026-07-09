import { isCustomError } from '@configs/errors';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { NextFunction, Request, Response } from 'express';

const NODE_ENV = process.env.NODE_ENV;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorMiddleware = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (NODE_ENV !== 'test' && err instanceof PrismaClientKnownRequestError) {
    console.error(err);
  }
  if (isCustomError(err)) {
    return res.status(err.statusCode).json(err);
  }
  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2025' || err.code === 'P2016') {
      return res.status(404).json({ message: 'Prisma: Not found' });
    }
  }
  res.status(500).json(err);
};
