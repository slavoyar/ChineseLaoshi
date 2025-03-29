import type { TObject } from '@sinclair/typebox';
import Ajv from 'ajv';
import type { NextFunction, Request, Response } from 'express';

const ajv = new Ajv();

export const createValidationMiddleware =
  (schema: TObject) => (req: Request, res: Response, next: NextFunction) => {
    if (!schema) {
      return next();
    }
    const validator = ajv.compile(schema);
    if (!validator(req.body)) {
      return res.status(400).json(validator.errors);
    }
    next();
  };
