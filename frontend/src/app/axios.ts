import axios from 'axios';

import { getSessionToken } from '@shared/lib/session-token';

axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  const token = getSessionToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use((response) => response.data);
