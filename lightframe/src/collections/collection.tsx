import { useEffect, useState, useLayoutEffect } from 'react';
import { useQuery } from 'react-query';
import type { CollectionResponse } from '../api/types';
import { api } from '../api/api';
import { useAlbumOperations } from '../hooks/use-album-operations';
import { useModalState } from '../hooks/use-modal-state';
import AlbumGrid from './album-grid';
import AlbumModals from './album-modals';
import type { Album } from './album-card';

type CollectionProps = {
  collection_id: string;
};

export type AlbumFormData = {
  name: string;
  description?: string;
  isPublic: boolean;
  eventDate?: string; 
};

const Collection = (props: CollectionProps) => {
  const [fadeIn, setFadeIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const albumOperations = useAlbumOperations(props.collection_id);
  const modalState = useModalState();

  const { data: collection, isLoading } = useQuery<CollectionResponse, Error>(
    ['fetchCollection', props.collection_id],
    async () => {
      const response = await api.get(`/api/collection?id=${props.collection_id}`);
      if (!response.ok) {
        setFadeIn(true);
        throw new Error('Failed to fetch collection');
      }
      return response.json();
    }
  );

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  useLayoutEffect(() => {
    setFadeIn(false);
  }, [props.collection_id]);

  useEffect(() => {
    if (collection && !isLoading) {
      // Use requestAnimationFrame to ensure the DOM has rendered the initial state
      let timeoutId: NodeJS.Timeout;
      const rafId = requestAnimationFrame(() => {
        timeoutId = setTimeout(() => setFadeIn(true), 50);
      });
      return () => {
        cancelAnimationFrame(rafId);
        if (timeoutId) clearTimeout(timeoutId);
      };
    }
  }, [collection, isLoading]);

  const handleEditAlbum = (e: React.MouseEvent, album: Album) => {
    e.stopPropagation(); 
    modalState.openEditModal({
      id: album.id,
      name: album.name,
      description: album.description || '',
      isPublic: album.public,
      eventDate: album.eventDate,
    });
  };

  const handleSubmitAdd = (albumData: AlbumFormData) => {
    albumOperations.createAlbum.mutate(albumData);
    modalState.closeAddModal();
  };

  const handleSubmitEdit = (albumData: AlbumFormData) => {
    if (!modalState.editingAlbum) return;
    
    albumOperations.updateAlbum.mutate({
      id: modalState.editingAlbum.id,
      data: albumData
    });
    modalState.closeEditModal();
  };

  const handleDeleteAlbum = (albumId: string) => {
    albumOperations.deleteAlbum.mutate(albumId);
    modalState.closeEditModal();
  };

  // Data processing
  const albums: Album[] = collection?.albums
    .filter((album) => isLoggedIn || album.public)
    .sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime())
    .map((album) => ({
      id: album.id,
      name: album.name,
      coverImage: album.coverImage,
      link: `/album/${album.id}`,
      dateCreated: album.dateCreated,
      numPhotos: album.numPhotos,
      public: album.public,
      eventDate: album.eventDate,
      description: album.description || '', 
    })) || [];

  return (
    <>
      <AlbumGrid
        albums={albums}
        fadeIn={fadeIn}
        isLoggedIn={isLoggedIn}
        onAddAlbum={modalState.openAddModal}
        onEditAlbum={handleEditAlbum}
      />
      
      <AlbumModals
        isAddModalOpen={modalState.isAddModalOpen}
        isEditModalOpen={modalState.isEditModalOpen}
        editingAlbum={modalState.editingAlbum}
        onCloseAdd={modalState.closeAddModal}
        onCloseEdit={modalState.closeEditModal}
        onSubmitAdd={handleSubmitAdd}
        onSubmitEdit={handleSubmitEdit}
        onDelete={handleDeleteAlbum}
      />
    </>
  );
};

export default Collection;
