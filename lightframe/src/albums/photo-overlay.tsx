import CircularProgress from '@mui/material/CircularProgress';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
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
  downloads?: number;
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
  downloads,
  enableOverlay = true,
  downloadingPhotoId,
  settingCoverPhotoId,
  coverSuccessPhotoId,
  onSelectPhoto,
  onSetAlbumCover,
  onDownload,
}: PhotoOverlayProps) => {
  const isLoggedIn = getValidToken() !== null;
  return (
    <>
      {/* Set Album Cover Button */}
      {isLoggedIn && enableOverlay && <Tooltip title="Set as Album Cover" placement="bottom">
        <div
          className="absolute top-2 right-10 cursor-pointer z-10"
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
            <WallpaperIcon
              style={{
                marginTop: "1px",
                fontSize: 24,
                color: 'white',
              }}
            />
          )}
        </div>
      </Tooltip>}

      {/* Select Icon */}
      {isLoggedIn && enableOverlay && (
        <SelectIcon
          selected={photo.selected}
          onClick={(event) => {
            onSelectPhoto(index);
            event.preventDefault();
            event.stopPropagation();
          }}
        />
      )}

      {/* Download Count Indicator */}
      {isLoggedIn && enableOverlay && typeof downloads === 'number' && (
        <div
          className="absolute top-2 left-2 z-10 flex items-center"
          style={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: 20,
            textShadow: '0 4px 12px rgba(0,0,0,0.7), 0 1px 2px rgba(0,0,0,0.5)',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <DownloadIcon style={{ fontSize: 22, color: 'white', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.7)) drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />
          {downloads}
        </div>
      )}

      {/* Download Button */}
      {enableOverlay && (
        <div className="download-overlay">
          <div
            className="download-button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onDownload(mediumPhoto, index);
            }}
            title="Download full resolution"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              cursor: downloadingPhotoId === mediumPhoto.id ? 'default' : 'pointer',
            }}
          >
            {downloadingPhotoId === mediumPhoto.id ? (
              <CircularProgress size={20} style={{ color: '#333' }} />
            ) : (
              <DownloadIcon style={{ fontSize: 20, color: '#333' }} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoOverlay;
