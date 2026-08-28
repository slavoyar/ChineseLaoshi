import { AuthUser, TelegramLoginResponse } from '@shared/types';
import axios from 'axios';

import { apiRequest } from './api-error';

const AUTH_URL = '/api/auth';

export const authApi = {
  me: () => apiRequest(axios.get<AuthUser, AuthUser>(`${AUTH_URL}/me`), { notify: false }),
  loginWithGoogle: (idToken: string) =>
    apiRequest(axios.post<{ idToken: string }, AuthUser>(`${AUTH_URL}/google`, { idToken }), {
      notify: false,
    }),
  loginWithTelegram: (initData: string) =>
    apiRequest(
      axios.post<{ initData: string }, TelegramLoginResponse>(`${AUTH_URL}/telegram`, { initData }),
      { notify: false }
    ),
  logout: () => apiRequest(axios.post<void, void>(`${AUTH_URL}/logout`), { notify: true }),
};
