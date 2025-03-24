import { validationMiddleware } from '@middlewares';
import type { Record } from '@prisma/client/runtime/library';
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
    options: Partial<RouteOptions>
  ) {
    const { method, endpoint, middlewares } = { ...defaultOptions, ...options };
    router[method](url + endpoint, validationMiddleware<Body>, ...middlewares, async (req, res) => {
      const result = await cb(req as Request<Parameters, Result, Body, Query>);
      return res.status(result.status).json(result.data);
    });
  }
  return { router, createRoute };
}
