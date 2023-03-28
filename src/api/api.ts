import { api } from './configs/axiosConfigs';

export const API = {
  get: async (url: string) => {
    const response = await api.request({
      url: url,
      method: 'GET',
    });

    return response.data;
  },

  post: async (url: string, data: any) => {
    const response = await api.request({
      url: url,
      method: 'POST',
      data: data,
    });

    return response.data;
  },

  patch: async (url: string, data: any) => {
    const response = await api.request({
      url: url,
      method: 'PATCH',
      data: data,
    });

    return response.data;
  },

  delete: async (url: string, data = []) => {
    const response = await api.request({
      url: url,
      method: 'DELETE',
      data: data,
    });

    return response.data;
  },
};
