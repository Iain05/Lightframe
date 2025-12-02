import { api } from './api';

export const statisticsAPI = {
  addDownload: async (photoId: number): Promise<void> => {
    try {
      await api.post(`/api/photo/${photoId}/download`);
    } catch (error) {
      // ignore error, dont really care
      console.error('Failed to log download event', error);
    }
  },

  sendAlbumView: async (albumId: string): Promise<void> => {
    const key = `albumViewed_${albumId}`;
    if (!localStorage.getItem(key)) {
      try {
        await api.post(`/api/album/${albumId}/view`);
        localStorage.setItem(key, "true");
      } catch (error) {
        console.error('Failed to log album view event', error);
      }
    }
  }
}
