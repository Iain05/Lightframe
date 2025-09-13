import AlbumCard from './album-card';
import AddAlbumCard from './add-album-card';
import type { Album } from './album-card';

interface AlbumGridProps {
  albums: Album[];
  fadeIn: boolean;
  isLoggedIn: boolean;
  onAddAlbum: () => void;
  onEditAlbum: (e: React.MouseEvent, album: Album) => void;
}

const AlbumGrid = ({ albums, fadeIn, isLoggedIn, onAddAlbum, onEditAlbum }: AlbumGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 p-0 max-w-screen-2xl mx-auto">
      {isLoggedIn && (
        <AddAlbumCard fadeIn={fadeIn} onClick={onAddAlbum} />
      )}
      {albums.map((album, index) => (
        <AlbumCard
          key={album.id}
          album={album}
          index={index}
          fadeIn={fadeIn}
          isLoggedIn={isLoggedIn}
          onEdit={onEditAlbum}
        />
      ))}
    </div>
  );
};

export default AlbumGrid;
