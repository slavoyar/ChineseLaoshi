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
      id: string;
    }

    interface Request {
      user?: CustomUser;
    }
  }
}
