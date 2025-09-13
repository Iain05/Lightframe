import { useNavigate } from 'react-router-dom';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import UploadButton from './upload-button';
import StyledButton from '@src/components/styled-button';
import BackButton from '@src/components/back-button';

import { getValidToken } from '@src/utils/auth';
import type { AlbumResponse } from '@src/api/types';

interface AlbumHeaderProps {
  album: AlbumResponse;
  onUpload: (file: File) => void;
  onEditAlbum?: () => void;
}

const AlbumHeader = ({ album, onUpload, onEditAlbum }: AlbumHeaderProps) => {
  const navigate = useNavigate();
  const isLoggedIn = getValidToken() !== null;

  return (
    <div className="mt-0 md:mt-10 mb-6 relative">
      <div className="mb-4">
        <BackButton navigate={navigate} />
        <div className="absolute top-0 right-0 mt-0 mr-4 flex items-center gap-0">
          {isLoggedIn && (
            <>
            <StyledButton
              variant="secondary"
              size="medium"
              icon={<EditNoteOutlinedIcon className="upload-btn__icon" />}
              text="Edit Album"
              onClick={onEditAlbum}
            />
            <UploadButton onUpload={onUpload} variant="secondary" size="medium" />
            </>
          )}
        </div>
      </div>

      <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">{album.name}</h1>

      <div className="flex justify-center">
        <div className="text-gray-600 text-lg md:text-xl text-center max-w-4xl">{album.description}</div>
      </div>

      <div className="flex flex-col items-center mt-4">
        <span className="text-xl text-center text-gray-600 flex items-center justify-center gap-5">
          <span>{album.numPhotos} photos</span>
          {album.eventDate && (
            <>
              <span>•</span>
              <span>{album.eventDate}</span>
            </>
          )}
        </span>
      </div>
    </div>
  );
};

export default AlbumHeader;
