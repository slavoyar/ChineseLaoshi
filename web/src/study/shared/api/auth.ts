import { detectLanguage } from '@shared/lib/detect-language';
import { AuthUser, TelegramLoginResponse } from '@shared/types';
import axios from 'axios';

import { apiRequest } from './api-error';

const AUTH_URL = '/api/auth';
const locale = () => detectLanguage();

export const authApi = {
  me: () => apiRequest(axios.get<AuthUser, AuthUser>(`${AUTH_URL}/me`), { notify: false }),
  loginWithGoogle: (idToken: string) =>
    apiRequest(
      axios.post<{ idToken: string; locale: string }, AuthUser>(`${AUTH_URL}/google`, {
        idToken,
        locale: locale(),
      }),
      {
        notify: false,
      }
    ),
  loginWithTelegram: (initData: string) =>
    apiRequest(
      axios.post<{ initData: string; locale: string }, TelegramLoginResponse>(`${AUTH_URL}/telegram`, {
        initData,
        locale: locale(),
      }),
      { notify: false }
    ),
  logout: () => apiRequest(axios.post<void, void>(`${AUTH_URL}/logout`), { notify: true }),
  completeOnboarding: () =>
    apiRequest(axios.patch<void, AuthUser>(`${AUTH_URL}/onboarding`), { notify: false }),
};
