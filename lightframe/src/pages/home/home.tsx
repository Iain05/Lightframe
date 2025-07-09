import React, { useEffect } from 'react';
import AlbumGallery from '@src/albums/album-gallery';
import { api } from '@src/api/api';

const Home: React.FC = () => {
  const [albumId, setAlbumId] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchAlbumId = async () => {
      try {
        const response = await api.get('/api/metadata/HOME_ALBUM');
        if (response.ok) {
          const data = await response.text();
          setAlbumId(data);
        } else {
          console.error('Failed to fetch home album ID:', response.statusText);
          setAlbumId('portfolio');
        }
      } catch (error) {
        console.error('Error fetching home album ID:', error);
        setAlbumId('portfolio');
      }
    };

    fetchAlbumId();
  }, []);

  // Don't render until we have an albumId
  if (albumId === null) {
    return <div></div>;
  }

  return (
    <AlbumGallery
      albumId={albumId} 
      layout="masonry"
      enableOverlay={false}
    />
  );
}

export default Home;