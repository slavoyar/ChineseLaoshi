export type AuthProvider = 'google' | 'telegram';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  provider: AuthProvider;
  onboardingCompleted: boolean;
}

export interface TelegramLoginResponse {
  user: AuthUser;
  token: string;
}
