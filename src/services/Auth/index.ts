// Instance
import { callApi } from '../api';
import { axiosInstance } from '../instance';

// Constants
import { APP_CONFIG } from '@/config/appConfig';

const API_URL = APP_CONFIG.API_URL;

type TLoginParams = {
  username?: string;
  password?: string;
};

type TRegisterParams = {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const login = async (params: TLoginParams) => {
  try {
    const response = await callApi<any>({
      method: 'POST',
      url: `${API_URL}/Auth/login`,
      data: params,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const register = async (params: TRegisterParams) => {
  try {
    const response = await callApi<any>({
      method: 'POST',
      url: `${API_URL}/Auth/register`,
      data: params,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};
