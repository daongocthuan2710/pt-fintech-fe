// Instance
import { TTask } from '@/models/Task';
import { callApi } from '../api';

// Constants
import { APP_CONFIG } from '@/config/appConfig';

const API_URL = APP_CONFIG.API_URL;

type TGetListTaskPrams = {
  userId: string;
  role: string;
  filterField?: string;
  filterValues?: string[];
  sort?: string;
  az?: string;
  searchTitle?: string;
  token?: string;
};

export const taskService = {
  getListTasks: async (params: TGetListTaskPrams) => {
    try {
      const response = await callApi<any>({
        method: 'GET',
        url: `${API_URL}/Task`,
        params,
      });
      return response.data?.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  createTask: async (params: TTask) => {
    try {
      const response = await callApi<any>({
        method: 'POST',
        url: `${API_URL}/Task`,
        data: params,
      });
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  updateTask: async (params: TTask) => {
    try {
      const response = await callApi<any>({
        method: 'PUT',
        url: `${API_URL}/Task/${params.id}`,
        data: params,
      });
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
