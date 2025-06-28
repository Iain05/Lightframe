import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';
import AddAlbumModal from './add-album';
import EditAlbumModal from './edit-album';
import type { CollectionResponse } from '../api/types';
import { api } from '../utils/api';

import AddRounded from '@mui/icons-material/AddRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';

type CollectionProps = {
  collection_id: string;
};

const Collection = (props: CollectionProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [fadeIn, setFadeIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<{
    id: string;
    name: string;
    description?: string;
    isPublic: boolean;
  } | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  const { data: collection, isLoading, error } = useQuery<CollectionResponse, Error>(
    'fetchCollection',
    async () => {
      const response = await api.get(`/api/collection?id=${props.collection_id}`);
      if (!response.ok) throw new Error('Failed to fetch collection');
      return response.json();
    }
  );

  useEffect(() => {
    setFadeIn(false);
    const timeout = setTimeout(() => setFadeIn(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  const handleAddAlbum = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEditAlbum = (e: React.MouseEvent, album: {
    id: string;
    name: string;
    description?: string;
    public: boolean;
  }) => {
    e.stopPropagation(); // Prevent navigation to album
    setEditingAlbum({
      id: album.id,
      name: album.name,
      description: album.description,
      isPublic: album.public
    });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingAlbum(null);
  };

  const handleSubmitEdit = async (albumData: { name: string; description?: string; isPublic: boolean }) => {
    if (!editingAlbum) return;
    
    try {
      const formData = new URLSearchParams();
      formData.append('id', editingAlbum.id);
      formData.append('name', albumData.name);
      formData.append('description', albumData.description || '');
      formData.append('isPublic', albumData.isPublic.toString());

      const response = await api.put('/api/album/update', formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update album');
      }

      console.log('Album updated successfully:', editingAlbum.id);
      
      setIsEditModalOpen(false);
      setEditingAlbum(null);
      
      // Refresh the collection data to show the updated album
      queryClient.invalidateQueries('fetchCollection');
    } catch (error) {
      console.error('Error updating album:', error);
    }
  };

  const handleDeleteAlbum = async (albumId: string) => {
    try {
      const response = await api.delete(`/api/album/delete?id=${albumId}`);
      
      if (!response.ok) {
        throw new Error('Failed to delete album');
      }
      
      setIsEditModalOpen(false);
      setEditingAlbum(null);
      
      queryClient.invalidateQueries('fetchCollection');
    } catch (error) {
      console.error('Error deleting album:', error);
    }
  };

  const handleSubmitAlbum = async (albumData: { name: string; description?: string; isPublic: boolean }) => {
    try {
      const formData = new URLSearchParams();
      formData.append('name', albumData.name);
      formData.append('description', albumData.description || '');
      formData.append('isPublic', albumData.isPublic.toString());
      formData.append('collection', props.collection_id);

      const response = await api.post('/api/album/create', formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create album');
      }
      const albumId = await response.text();
      
      setIsModalOpen(false);
      
      queryClient.invalidateQueries('fetchCollection');
      
      window.location.href = `/album/${albumId}`;
    } catch (error) {
      console.error('Error creating album:', error);
    }
  };

  const albums = collection?.albums
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
    })) || [];

  if (isLoading) return <div className="flex justify-center">Loading...</div>;
  if (error) return <div className="flex justify-center">Error: {error.message}</div>;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 max-w-screen-2xl mx-auto">
        {isLoggedIn && (
          <div
            className={`relative cursor-pointer group overflow-hidden transform transition-opacity duration-500 ease-in-out rounded-md border-2 border-dashed border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100 flex items-center justify-center h-70 ${
              fadeIn ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: '0ms' }}
            onClick={handleAddAlbum}
          >
            <div className="flex flex-col items-center justify-center text-gray-500 group-hover:text-gray-600">
              <AddRounded style={{ fontSize: '48px' }} />
              <span className="mt-2 text-lg font-medium">Add New Album</span>
            </div>
          </div>
        )}
        {albums.map((album, index) => (
          <div
            key={album.id}
            className={`relative cursor-pointer group overflow-hidden transform transition-opacity duration-500 ease-in-out rounded-md ${
              fadeIn ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: `${(index + (isLoggedIn ? 1 : 0)) * 150}ms` }}
            onClick={() => navigate(album.link)}
          >
            <img
              src={`${import.meta.env.VITE_BUCKET_BASE}preview/${album.coverImage}`}
              className="w-full h-70 object-cover rounded-md transform transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute top-4 right-4 text-white z-10">
              {isLoggedIn && (
                <BorderColorRoundedIcon 
                  sx={{ fontSize: 25 }}
                  onClick={(e) => handleEditAlbum(e, album)}
                  className="cursor-pointer hover:opacity-75 transition-opacity drop-shadow-lg"
                />
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
            <div className="absolute bottom-7 left-4 text-white text-xl font-semibold">
              {!album.public && isLoggedIn && (
              <LockRoundedIcon sx={{ fontSize: 20, marginBottom: 0.5 }} />)}
              {album.name}
            </div>
            <span className="absolute bottom-2 right-6 text-white text-md">
              {new Date(album.dateCreated).toLocaleDateString()}
            </span>
            <span className="absolute bottom-2 left-6 text-white text-md">
              {album.numPhotos} photos
            </span>
          </div>
        ))}
      </div>
      
      <AddAlbumModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitAlbum}
      />
      
      {editingAlbum && (
        <EditAlbumModal 
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSubmit={handleSubmitEdit}
          onDelete={handleDeleteAlbum}
          initialData={{
            id: editingAlbum.id,
            name: editingAlbum.name,
            description: editingAlbum.description,
            isPublic: editingAlbum.isPublic
          }}
        />
      )}
    </>
  );
};

export default Collection;
