import type { Id } from '@shared/common';

export interface CustomUser {
  username: string;
  password?: string;
  id: string;
}

declare global {
  namespace Express {
    interface User {
      username: string;
      password?: string;
      id: Id;
    }

    interface Request {
      user: CustomUser;
    }
  }
}
