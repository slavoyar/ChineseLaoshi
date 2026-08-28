export type AuthProvider = 'google' | 'telegram';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  provider: AuthProvider;
}

export interface TelegramLoginResponse {
  user: AuthUser;
  token: string;
}
