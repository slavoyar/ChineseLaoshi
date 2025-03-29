import { createValidationMiddleware } from '@middlewares';
import type { Record } from '@prisma/client/runtime/library';
import type { TObject, TProperties } from '@sinclair/typebox';
import { type Request, type RequestHandler, Router } from 'express';

export type Params = Record<string, string>;

export type ControllerResult<T> = {
  status: number;
  data?: T;
};

type SuccessResponse<T> = ControllerResult<T> & { status: 200 };

export const Ok = <T>(data?: T): SuccessResponse<T> => ({ status: 200, data });

type RouteOptions = {
  method: 'get' | 'post' | 'put' | 'delete';
  endpoint: string;
  middlewares: RequestHandler[];
  schema?: TObject;
};
const defaultOptions: RouteOptions = {
  method: 'get',
  endpoint: '/',
  middlewares: [],
};

export function createRouter(url: string) {
  const router = Router();
  function createRoute<Parameters extends Params = Params, Body = unknown, Result = unknown, Query = Params>(
    cb: (req: Request<Parameters, Result, Body, Query>) => Promise<ControllerResult<Result>>,
    options?: Partial<RouteOptions>
  ) {
    const { method, endpoint, middlewares } = { ...defaultOptions, ...options };
    if (options?.schema) {
      middlewares.unshift(createValidationMiddleware(options.schema));
    }
    router[method](url + endpoint, ...middlewares, async (req, res) => {
      const result = await cb(req as Request<Parameters, Result, Body, Query>);
      return res.status(result.status).json(result.data);
    });
  }
  return { router, createRoute };
}
