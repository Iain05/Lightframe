import { useNavigate } from 'react-router-dom';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';

export interface Album {
  id: string;
  name: string;
  coverImage: string;
  link: string;
  dateCreated: string;
  numPhotos: number;
  public: boolean;
  eventDate?: string; 
  description?: string;
}

interface AlbumCardProps {
  album: Album;
  index: number;
  fadeIn: boolean;
  isLoggedIn: boolean;
  onEdit: (e: React.MouseEvent, album: Album) => void;
}

const AlbumCard = ({ album, index, fadeIn, isLoggedIn, onEdit }: AlbumCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      key={album.id}
      className={`relative cursor-pointer group overflow-hidden transform transition-opacity duration-500 ease-in-out rounded-md aspect-[5/3] ${
        fadeIn ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ transitionDelay: `${(index + (isLoggedIn ? 1 : 0)) * 150}ms` }}
      onClick={() => navigate(album.link)}
    >
      <img
        src={`${import.meta.env.VITE_BUCKET_BASE}small/${album.coverImage}`}
        className="w-full h-full object-cover rounded-md transform transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute top-4 right-4 text-white z-10">
        {isLoggedIn && (
          <BorderColorRoundedIcon 
            sx={{ fontSize: 25 }}
            onClick={(e) => onEdit(e, album)}
            className="cursor-pointer hover:opacity-75 transition-opacity drop-shadow-lg"
          />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
      <div className="absolute bottom-7 left-4 text-white text-xl font-semibold">
        {!album.public && isLoggedIn && (
          <LockRoundedIcon sx={{ fontSize: 20, marginBottom: 0.5 }} />
        )}
        {album.name}
      </div>
      { album.eventDate && <span className="absolute bottom-2 right-6 text-white text-md">
          {album.eventDate}
        </span>
      }
      <span className="absolute bottom-2 left-6 text-white text-md">
        {album.numPhotos} photos
      </span>
    </div>
  );
};

export default AlbumCard;
