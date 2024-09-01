import { errors, ErrorCode } from './errors';

export class CustomError extends Error {
  public code: string;

  public statusCode: number;

  public message: string;

  constructor(code: ErrorCode) {
    super();
    this.code = code;
    this.statusCode = errors[code].statusCode;
    this.message = errors[code].message;
  }
}

export const isCustomError = (err: unknown): err is CustomError => {
  return (
    !!(err as CustomError).message &&
    !!(err as CustomError).code &&
    !isNaN(Number((err as CustomError).statusCode))
  );
};
