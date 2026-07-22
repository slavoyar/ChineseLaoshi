import { AuthUser } from '@shared/types/auth';
import axios from 'axios';

const AUTH_URL = '/api/auth';

export const authApi = {
  me: () => axios.get<AuthUser, AuthUser>(`${AUTH_URL}/me`),
  loginWithGoogle: (idToken: string) =>
    axios.post<{ idToken: string }, AuthUser>(`${AUTH_URL}/google`, { idToken }),
  logout: () => axios.post<void, void>(`${AUTH_URL}/logout`),
};
