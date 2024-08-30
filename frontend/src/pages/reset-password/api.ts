import axios from 'axios';

export const resetPassword = (email: string) => axios.post('/api/auth/reset-password', { email });
