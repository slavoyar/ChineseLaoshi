let bearerToken: string | null = null;

export const setSessionToken = (token: string | null): void => {
  bearerToken = token;
};

export const getSessionToken = (): string | null => bearerToken;

export const clearSessionToken = (): void => {
  bearerToken = null;
};
