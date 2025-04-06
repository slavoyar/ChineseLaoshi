import { CreateUserDto } from '@chinese-laoshi/shared';
import axios from 'axios';

const URL = '/api/auth';

class AuthService {
  login = (username: string, password: string) =>
    axios.post(
      `${URL}/login`,
      { username, password },
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        cancelToken: axios.CancelToken.source().token,
      }
    );

  register = (data: CreateUserDto) => axios.post(`${URL}/register`, data);

  logout = () => axios.post(`${URL}/logout`);

  refreshToken = () => axios.post(`${URL}/refresh-token`);
}

export const authService = new AuthService();
