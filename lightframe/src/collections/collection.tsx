import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import AddRounded from '@mui/icons-material/AddRounded';
import type { CollectionResponse } from '../api/types';

type CollectionProps = {
  collection_id: string;
};

const Collection = (props: CollectionProps) => {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  const { data: collection, isLoading, error } = useQuery<CollectionResponse, Error>(
    'fetchCollection',
    async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/collection?id=${props.collection_id}`);
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
    // TODO: Implement add album functionality
    // This could open a modal, navigate to an add album page, etc.
    console.log('Add new album clicked');
  };

  const albums = collection?.albums.map((album) => ({
    id: album.id,
    name: album.name,
    coverImage: album.coverImage,
    link: `/album/${album.id}`,
    dateCreated: album.dateCreated,
    numPhotos: album.numPhotos,
  })) || [];

  if (isLoading) return <div className="flex justify-center">Loading...</div>;
  if (error) return <div className="flex justify-center">Error: {error.message}</div>;

  return (
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
            alt={album.name}
            className="w-full h-70 object-cover rounded-md transform transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
          <div className="absolute bottom-7 left-6 text-white text-xl font-semibold">
            {album.name}
          </div>
          <span className="absolute bottom-2 right-6 text-white text-md">
            {album.dateCreated}
          </span>
          <span className="absolute bottom-2 left-6 text-white text-md">
            {album.numPhotos} photos
          </span>
        </div>
      ))}
    </div>
  );
};

export default Collection;
