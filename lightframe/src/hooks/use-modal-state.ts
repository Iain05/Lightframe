import { useState } from 'react';

export interface EditingAlbum {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
}

export const useModalState = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<EditingAlbum | null>(null);

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openEditModal = (album: EditingAlbum) => {
    setEditingAlbum(album);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingAlbum(null);
  };

  return {
    isAddModalOpen,
    isEditModalOpen,
    editingAlbum,
    openAddModal,
    closeAddModal,
    openEditModal,
    closeEditModal,
  };
};
