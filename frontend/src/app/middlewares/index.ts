import { authService } from '@shared/api';
import axios from 'axios';

let isRefreshing = false;
let failedQueue: { reject: (reason?: unknown) => void }[] = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach(({ reject }) => reject(error));
  failedQueue = [];
};

axios.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((_, reject) => {
          failedQueue.push({ reject });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await authService.refreshToken();
        isRefreshing = false;
        return axios(originalRequest); // retry original request
      } catch (err) {
        processQueue(err);
        isRefreshing = false;
        window.location.href = '/signin';
        await authService.logout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
