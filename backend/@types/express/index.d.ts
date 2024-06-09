export interface CustomUser extends Express.User {
  username: string;
  password?: string;
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: CustomUser;
    }
  }
}
