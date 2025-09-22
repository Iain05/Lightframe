import { api } from './api';

export const statisticsAPI = {
  addDownload: async (photoId: number): Promise<void> => {
    try {
      await api.post(`/api/photo/${photoId}/download`);
    } catch (error) {
      // ignore error, dont really care
      console.error('Failed to log download event', error);
    }
  }
}