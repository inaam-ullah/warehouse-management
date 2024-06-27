import axios from 'axios';

import { logoutUser } from './authUtils';
import config from '../config';

const axiosInstance = axios.create({
  baseURL: config.API_URL,
});

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      logoutUser();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
