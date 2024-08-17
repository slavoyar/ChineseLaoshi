import { ErrorCode, errors } from '@configs/errors';
import { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorMiddleware = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  if (typeof err !== 'string' || !errors[err as ErrorCode]) {
    res.status(500).json(err);
    return;
  }
  const error = errors[err as ErrorCode];
  res.status(error.statusCode).json({ ...error, code: err });
};
