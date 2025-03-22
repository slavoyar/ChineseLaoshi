import { Email } from '@chinese-laoshi/shared';
import axios from 'axios';

export const resetPassword = (email: Email) => axios.post('/api/auth/reset-password', { email });
