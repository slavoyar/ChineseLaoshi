export interface CustomUser {
  username: string;
  id: string;
}

declare global {
  namespace Express {
    interface User {
      username: string;
      id: string;
    }

    interface Request {
      user: CustomUser;
    }
  }
}
