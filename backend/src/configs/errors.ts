const errors = {
  loginError: {
    message: 'Wrong username or password',
    statusCode: 500,
  },
  registerError: {
    message: 'Username or email is not unique',
    statusCode: 500,
  },
  entityNotFoundError: {
    message: 'Requested entity is not found',
    statusCode: 404,
  },
  entityCreateError: {
    message: 'Could not create an entity',
    statusCode: 500,
  },
  entityUpdateError: {
    message: 'Could not update an entity',
    statusCode: 500,
  },
} as const;

type ErrorCode = keyof typeof errors;

export class CustomError {
  public code: string;
  public statusCode: number;
  public message: string;

  constructor(code: ErrorCode) {
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
