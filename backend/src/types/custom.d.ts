declare namespace Express {
   export interface Request {
      userId: string
   }
   
   export interface User {
      username: string;
      password: string;
      id: string;
   }
}