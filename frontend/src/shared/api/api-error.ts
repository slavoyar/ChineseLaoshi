import { useAuthStore } from '@shared/stores';
import axios from 'axios';
import { toast } from 'react-toastify';

import type { AppError, ErrorCode, ValidationDetail } from './generated/errors';

export type ApiError = AppError;

export type ApiRequestOptions = {
  notify?: boolean;
};

const FRIENDLY_BY_CODE: Partial<Record<ErrorCode, string>> = {
  entityNotFoundError: 'We could not find what you were looking for.',
  entityCreateError: 'Could not create that item. Try again.',
  entityUpdateError: 'Could not update that item. Try again.',
  entityDeleteError: 'Could not delete that item. Try again.',
  unauthorizedError: 'Please sign in to continue.',
  forbiddenError: 'You do not have permission to do that.',
  internalError: 'Something went wrong. Try again.',
};

const GENERIC_MESSAGE = 'Something went wrong. Try again.';
const NETWORK_MESSAGE = 'Could not reach the server. Check your connection and try again.';

export const isRequestCanceled = (err: unknown): boolean => {
  if (axios.isCancel(err)) {
    return true;
  }
  return axios.isAxiosError(err) && err.code === 'ERR_CANCELED';
};

const isErrorCode = (value: unknown): value is ErrorCode =>
  typeof value === 'string' &&
  [
    'entityNotFoundError',
    'entityCreateError',
    'entityUpdateError',
    'entityDeleteError',
    'validationError',
    'unauthorizedError',
    'forbiddenError',
    'internalError',
  ].includes(value);

const isValidationDetail = (value: unknown): value is ValidationDetail => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const detail = value as Record<string, unknown>;
  return typeof detail.message === 'string';
};

export const parseApiError = (err: unknown): ApiError => {
  if (isRequestCanceled(err)) {
    return {
      code: 'internalError',
      statusCode: 0,
      message: 'Request canceled',
    };
  }

  if (axios.isAxiosError(err)) {
    if (!err.response) {
      return {
        code: 'internalError',
        statusCode: 0,
        message: NETWORK_MESSAGE,
      };
    }

    const data = err.response.data;
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const body = data as Record<string, unknown>;
      const code = isErrorCode(body.code) ? body.code : 'internalError';
      const message = typeof body.message === 'string' ? body.message : GENERIC_MESSAGE;
      const details = Array.isArray(body.details)
        ? body.details.filter(isValidationDetail)
        : undefined;
      return {
        code,
        statusCode:
          typeof body.statusCode === 'number' ? body.statusCode : (err.response.status ?? 500),
        message,
        details,
      };
    }

    return {
      code: 'internalError',
      statusCode: err.response.status ?? 500,
      message: GENERIC_MESSAGE,
    };
  }

  if (err instanceof Error && err.message) {
    return {
      code: 'internalError',
      statusCode: 500,
      message: err.message,
    };
  }

  return {
    code: 'internalError',
    statusCode: 500,
    message: GENERIC_MESSAGE,
  };
};

export const messageForApiError = (error: ApiError): string => {
  if (error.message === 'Request canceled') {
    return GENERIC_MESSAGE;
  }
  if (error.statusCode === 0 || error.message === NETWORK_MESSAGE) {
    return NETWORK_MESSAGE;
  }
  if (error.code === 'validationError') {
    return error.details?.[0]?.message || error.message || GENERIC_MESSAGE;
  }
  return FRIENDLY_BY_CODE[error.code] ?? GENERIC_MESSAGE;
};

export const notifyApiError = (err: unknown, options: ApiRequestOptions = {}): never => {
  const { notify = true } = options;

  if (isRequestCanceled(err)) {
    throw err;
  }

  const parsed = parseApiError(err);

  if (notify) {
    toast.error(messageForApiError(parsed));
    if (parsed.code === 'unauthorizedError') {
      useAuthStore.getState().openAuthDialog();
    }
  }

  throw err;
};

export const apiRequest = async <T>(
  promise: Promise<T>,
  options: ApiRequestOptions = {}
): Promise<T> => {
  try {
    return await promise;
  } catch (err) {
    return notifyApiError(err, options);
  }
};
