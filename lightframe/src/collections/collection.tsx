import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import type { CollectionResponse } from '../api/types';

const Collection = () => {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);

  const { data: collection, isLoading, error } = useQuery<CollectionResponse, Error>(
    'fetchCollection',
    async () => {
      const response = await fetch('http://localhost:8080/api/collection?id=main-collection');
      if (!response.ok) throw new Error('Failed to fetch collection');
      return response.json();
    }
  );

  useEffect(() => {
    setFadeIn(false);
    const timeout = setTimeout(() => setFadeIn(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  const albums = collection?.albums.map((album) => ({
    id: album.id,
    name: album.name,
    coverImage: album.coverImage,
    link: `/album/${album.id}`,
  })) || [];

  if (isLoading) return <div className="flex justify-center">Loading...</div>;
  if (error) return <div className="flex justify-center">Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 max-w-screen-2xl mx-auto">
      {albums.map((album, index) => (
        <div
          key={album.id}
          className={`relative cursor-pointer group overflow-hidden transform transition-opacity duration-500 ease-in-out ${
            fadeIn ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: `${index * 150}ms` }}
          onClick={() => navigate(album.link)}
        >
          <img
            src={album.coverImage}
            alt={album.name}
            className="w-full h-70 object-cover rounded-md transform transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50 rounded-md"></div>
          <div className="absolute bottom-4 left-6 text-white text-xl font-semibold">
            {album.name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Collection;
