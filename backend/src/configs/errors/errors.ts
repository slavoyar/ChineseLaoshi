export const errors = {
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
  validationError: {
    message: 'Validation error',
    statusCode: 500,
  },
} as const;

export type ErrorCode = keyof typeof errors;
