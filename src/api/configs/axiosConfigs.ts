import { Toasts } from '@/components';
import axios from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get('token');

export const api = axios.create({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ` + token,
  },
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
});

// defining a custom error handler for all APIs
const errorHandler = (error: any) => {
  const statusCode = error.response?.status;

  // logging only errors that are not 401
  if (statusCode && statusCode !== 401) {
    Toasts.errorToast(error.response.data.message);
    console.log(error);
  } else {
    Cookies.remove('token');
    Cookies.remove('user');

    Toasts.errorToast(error.response.data.message);
    console.log(error);
  }

  return Promise.reject(error);
};

// registering the custom error handler to the "api" axios instance
api.interceptors.response.use(undefined, (error) => {
  return errorHandler(error);
});
