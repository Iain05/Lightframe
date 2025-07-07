import { useNavigate } from 'react-router-dom';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import UploadButton from './upload-button';
import { getValidToken } from '../utils/auth';
import type { AlbumResponse } from '../api/types';

interface AlbumHeaderProps {
  album: AlbumResponse;
  onUpload: (file: File) => void;
}

const AlbumHeader = ({ album, onUpload }: AlbumHeaderProps) => {
  const navigate = useNavigate();
  const isLoggedIn = getValidToken() !== null;

  return (
    <div className="mt-10 mb-14 relative">
      <button
        className="flex items-center text-xl font-medium"
        style={{
          padding: '4px',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
        }}
        onClick={() => navigate(-1)}
      >
        <ArrowBackRoundedIcon style={{ fontSize: 30 }} />
      </button>
      <h1 className="text-6xl font-bold text-center mb-4">{album.name}</h1>
      <div className="flex justify-center text-gray-600 text-xl">{album.description}</div>
      <div className="flex flex-col items-center mt-4">
        <span className="text-xl text-center text-gray-600 flex items-center justify-center gap-5">
          <span>{album.numPhotos} photos</span>
          {album.eventDate && (
            <>
              <span>•</span>
              <span>{new Date(album.eventDate).toLocaleDateString()}</span>
            </>
          )}
        </span>
      </div>
      <div className="absolute top-0 right-0 mt-4 mr-4 flex items-center gap-3">
        {isLoggedIn && (
          <UploadButton onUpload={onUpload} variant="secondary" size="medium" />
        )}
      </div>
    </div>
  );
};

export default AlbumHeader;
