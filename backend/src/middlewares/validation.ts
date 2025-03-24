import type { NextFunction, Request, Response } from 'express';
import typia from 'typia';

export const validationMiddleware = <T>(req: Request, res: Response, next: NextFunction) => {
  const validation = typia.validate<T>(req.body);
  if (validation.success) {
    return next();
  }

  return res.status(400).json(validation.errors);
};
