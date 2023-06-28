import axios, { AxiosRequestConfig } from 'axios';
import { EKey } from 'models/general';

const api = axios.create({
  baseURL: `http://localhost:8080/`,
  // baseURL: `https://travel-backend-new.herokuapp.com/`,
});

api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const lang = localStorage.getItem('lang');
    const token = localStorage.getItem(EKey.TOKEN);
    if (token) (config.headers.common['Authorization'] as string) = `Bearer ${token}`;
    if (lang) config.headers.common['lang'] = lang;
    return config;
  }
);

export default api;

