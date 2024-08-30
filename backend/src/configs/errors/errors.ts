export const errors = {
  notAuth: {
    message: 'User is not authenticated',
    statusCode: 500,
  },
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
  entityDeleteError: {
    message: 'Could not delete an entity',
    statusCode: 500,
  },
  emailSendError: {
    message: 'Error during email send',
    statusCode: 500,
  },
} as const;

export type ErrorCode = keyof typeof errors;
