import { api } from '../utils/api';

export interface AlbumCreateData {
  name: string;
  description?: string;
  isPublic: boolean;
  collection: string;
}

export interface AlbumUpdateData {
  name: string;
  description?: string;
  isPublic: boolean;
}

export const albumAPI = {
  create: async (data: AlbumCreateData): Promise<string> => {
    const formData = new URLSearchParams();
    formData.append('name', data.name);
    formData.append('description', data.description || '');
    formData.append('isPublic', data.isPublic.toString());
    formData.append('collection', data.collection);

    const response = await api.post('/api/album/create', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to create album');
    }

    return response.text();
  },

  update: async (id: string, data: AlbumUpdateData): Promise<void> => {
    const formData = new URLSearchParams();
    formData.append('id', id);
    formData.append('name', data.name);
    formData.append('description', data.description || '');
    formData.append('isPublic', data.isPublic.toString());

    const response = await api.put('/api/album/update', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to update album');
    }
  },

  delete: async (id: string): Promise<void> => {
    const response = await api.delete(`/api/album/delete?id=${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to delete album');
    }
  },

  uploadPhoto: async (albumId: string, file: File): Promise<void> => {
    const formData = new FormData();
    
    formData.append('photos', file);

    // For FormData, we need to create a custom request without the default Content-Type
    const token = localStorage.getItem('authToken');
    const headers: Record<string, string> = {};
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/photo/upload?albumId=${encodeURIComponent(albumId)}`, {
      method: 'POST',
      body: formData,
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to upload photo');
    }
  },

  deletePhotos: async (photoIds: number[]): Promise<void> => {
    const response = await api.delete('/api/photo/delete', {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ photoIds }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete photos');
    }
  },

  setAlbumCover: async (albumId: string, photoId: number): Promise<void> => {
    const response = await api.post(`/api/album/set-cover?albumId=${encodeURIComponent(albumId)}&photoId=${photoId}`);

    if (!response.ok) {
      throw new Error('Failed to set album cover');
    }
  },
};
