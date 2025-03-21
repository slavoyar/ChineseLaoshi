import { CreateUserDto } from '@shared/types';
import axios from 'axios';

const URL = '/api/auth';

class AuthService {
  login = (username: string, password: string) =>
    axios.post(
      `${URL}/login`,
      { username, password },
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

  register = (data: CreateUserDto) => axios.post(`${URL}/register`, data);
}

export const authService = new AuthService();
