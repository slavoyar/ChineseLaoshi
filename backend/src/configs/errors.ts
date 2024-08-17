interface Error {
  message: string;
  statusCode: number;
}

export const errors = {
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

export type ErrorCode = keyof typeof errors;
