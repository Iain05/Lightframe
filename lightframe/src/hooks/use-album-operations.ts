import { useMutation, useQueryClient } from 'react-query';
import { albumAPI } from '../api/album-api';
import type { AlbumCreateData, AlbumUpdateData } from '../api/album-api';

export const useAlbumOperations = (collectionId: string) => {
  const queryClient = useQueryClient();

  const createAlbum = useMutation(
    (data: Omit<AlbumCreateData, 'collection'>) => 
      albumAPI.create({ ...data, collection: collectionId }),
    {
      onSuccess: (albumId) => {
        queryClient.invalidateQueries('fetchCollection');
        window.location.href = `/album/${albumId}`;
      },
      onError: (error) => {
        console.error('Error creating album:', error);
      },
    }
  );

  const updateAlbum = useMutation(
    ({ id, data }: { id: string; data: AlbumUpdateData }) => 
      albumAPI.update(id, data),
    {
      onSuccess: (_, { id }) => {
        console.log('Album updated successfully:', id);
        queryClient.invalidateQueries('fetchCollection');
      },
      onError: (error) => {
        console.error('Error updating album:', error);
      },
    }
  );

  const deleteAlbum = useMutation(
    (id: string) => albumAPI.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('fetchCollection');
      },
      onError: (error) => {
        console.error('Error deleting album:', error);
      },
    }
  );

  return {
    createAlbum,
    updateAlbum,
    deleteAlbum,
  };
};
