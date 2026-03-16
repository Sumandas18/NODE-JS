import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:4003/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token && config.headers) {
      config.headers['Authorization'] = token;
      config.headers['x-access-token'] = token; // some backends check this
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
