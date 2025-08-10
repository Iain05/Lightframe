import React, { createContext, useContext, useState, useCallback } from 'react';
import type { EditingAlbum } from '../hooks/use-modal-state';

interface AlbumEditModalContextType {
  openEditModal: (album: EditingAlbum) => void;
}

const AlbumEditModalContext = createContext<AlbumEditModalContextType | undefined>(undefined);

export const useAlbumEditModal = () => {
  const context = useContext(AlbumEditModalContext);
  if (!context) {
    throw new Error('useAlbumEditModal must be used within an AlbumEditModalProvider');
  }
  return context;
};

export const AlbumEditModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [editModalState, setEditModalState] = useState<EditingAlbum | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const openEditModal = useCallback((album: EditingAlbum) => {
    setEditModalState(album);
    setIsEditModalOpen(true);
  }, []);

  // This provider only provides the openEditModal function for now.
  return (
    <AlbumEditModalContext.Provider value={{ openEditModal }}>
      {children}
    </AlbumEditModalContext.Provider>
  );
};
