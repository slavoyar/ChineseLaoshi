import axios from 'axios';

export const updatePassword = (token: string, password: string) =>
  axios.post('/api/auth/update-password', { token, password });
