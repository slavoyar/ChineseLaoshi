import axios from 'axios';

const URL = '/api/auth';

class AuthService {
  // eslint-disable-next-line class-methods-use-this
  login = (username: string, password: string) =>
    axios.post(
      `${URL}/login`,
      { username, password },
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
}

export default new AuthService();
