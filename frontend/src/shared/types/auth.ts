export type AuthProvider = 'google';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  provider: AuthProvider;
}
