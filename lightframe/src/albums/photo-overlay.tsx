import CircularProgress from '@mui/material/CircularProgress';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import CheckIcon from '@mui/icons-material/Check';
import Tooltip from '@mui/material/Tooltip';
import DownloadIcon from '@mui/icons-material/Download';
import SelectIcon from './select-icon';
import { getValidToken } from '../utils/auth';
import type { Photo } from "react-photo-album";

type SelectablePhoto = Photo & {
  id: number;
  downloadUrl?: string;
  selected?: boolean;
};

interface PhotoOverlayProps {
  photo: SelectablePhoto;
  mediumPhoto: SelectablePhoto;
  index: number;
  enableOverlay?: boolean;
  downloadingPhotoId: number | null;
  settingCoverPhotoId: number | null;
  coverSuccessPhotoId: number | null;
  onSelectPhoto: (index: number) => void;
  onSetAlbumCover: (photo: SelectablePhoto) => void;
  onDownload: (photo: SelectablePhoto, index: number) => void;
}

const PhotoOverlay = ({
  photo,
  mediumPhoto,
  index,
  enableOverlay = true,
  downloadingPhotoId,
  settingCoverPhotoId,
  coverSuccessPhotoId,
  onSelectPhoto,
  onSetAlbumCover,
  onDownload,
}: PhotoOverlayProps) => {
  return (
    <>
      {/* Set Album Cover Button */}
      {getValidToken() && enableOverlay && <Tooltip title="Set as Album Cover" placement="bottom">
        <div
          className="absolute top-2 right-12 cursor-pointer z-10"
          onClick={(event) => {
            if (settingCoverPhotoId !== photo.id && coverSuccessPhotoId !== photo.id) {
              onSetAlbumCover(photo);
            }
            event.preventDefault();
            event.stopPropagation();
          }}
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
            cursor: settingCoverPhotoId === photo.id || coverSuccessPhotoId === photo.id ? 'default' : 'pointer',
          }}
        >
          {settingCoverPhotoId === photo.id ? (
            <CircularProgress size={28} style={{ color: 'white' }} />
          ) : coverSuccessPhotoId === photo.id ? (
            <CheckIcon
              style={{
                fontSize: 28,
                color: 'white',
              }}
            />
          ) : (
            <AddToPhotosIcon
              style={{
                fontSize: 28,
                color: 'white',
              }}
            />
          )}
        </div>
      </Tooltip>}

      {/* Select Icon */}
      {enableOverlay && (
        <SelectIcon
          selected={photo.selected}
          onClick={(event) => {
            onSelectPhoto(index);
            event.preventDefault();
            event.stopPropagation();
          }}
        />
      )}

      {/* Download Button */}
      {enableOverlay && (
        <div className="download-overlay">
          <button
            className="download-button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onDownload(mediumPhoto, index);
            }}
            title="Download full resolution"
            disabled={downloadingPhotoId === mediumPhoto.id}
          >
            {downloadingPhotoId === mediumPhoto.id ? (
              <CircularProgress size={20} style={{ color: '#333' }} />
            ) : (
              <DownloadIcon style={{ fontSize: 20, color: '#333' }} />
            )}
          </button>
        </div>
      )}
    </>
  );
};

export default PhotoOverlay;
