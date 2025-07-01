import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';

import "yet-another-react-lightbox/plugins/thumbnails.css";

import PhotoAlbum from "react-photo-album";
// import ServerPhotoAlbum from "react-photo-album";
import "react-photo-album/styles.css";
import "@src/css/lightbox-override.css";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import UploadButton from './upload-button';
import SelectIcon from './select-icon';
import DeletePhotosModal from './delete-photos-modal';
import { albumAPI } from '../api/album-api';
import { getValidToken } from '../utils/auth';
import type { AlbumResponse } from '../api/types';
import type { Photo } from "react-photo-album";

type AlbumGalleryProps = {
  albumId: string;
  albumHeader?: boolean;
  layout: "columns" | "rows" | "masonry";
}

type SelectablePhoto = Photo & {
  id: number;
  selected?: boolean;
};

const BREAKPOINTS = [1080, 640, 384, 256, 128, 96, 64, 48];

function generatePhotos(albumPhotos: AlbumResponse['photos'], basePath: string, breakpoints: number[]): SelectablePhoto[] {
  return albumPhotos.map(({ url, width, height, id }) => ({
    src: `${basePath}/${url}`,
    width: width,
    height: height,
    id: id,
    srcSet: breakpoints.map((breakpoint) => ({
      src: `${basePath}/${url}`,
      width: breakpoint,
      height: Math.round((height / width) * breakpoint),
    })),
  }));
}

function AlbumGallery(props: AlbumGalleryProps) {
  const [index, setIndex] = useState(-1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleUpload = async (files: File[]) => {
    try {
      await albumAPI.uploadPhotos(props.albumId, files);
      queryClient.invalidateQueries(['fetchAlbum', props.albumId]);
    } catch (error) {
      console.error('Upload error:', error);
      // TODO: Show error toast/notification to user
    }
  };

  const { data: album, isLoading, error } = useQuery<AlbumResponse, Error>(
    ['fetchAlbum', props.albumId],
    async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/album?id=${props.albumId}`);
      if (!response.ok) throw new Error('Failed to fetch album');
      return response.json();
    },
  );


  const smallPhotos = useMemo(() => {
    return album ? generatePhotos(album.photos, `${import.meta.env.VITE_BUCKET_BASE}small`, BREAKPOINTS) : [];
  }, [album]);
  
  const fullPhotos = useMemo(() => {
    return album ? generatePhotos(album.photos, `${import.meta.env.VITE_BUCKET_BASE}large`, BREAKPOINTS) : [];
  }, [album]);
  
  const [photos, setPhotos] = useState<SelectablePhoto[]>([]);
  const isInitialized = useRef(false);

  const selectedCount = photos.filter(photo => photo.selected).length;
  const isLoggedIn = getValidToken() !== null;

  const handleDeleteSelected = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const selectedPhotoIds = photos
      .filter(photo => photo.selected)
      .map(photo => photo.id);
    
    try {
      await albumAPI.deletePhotos(selectedPhotoIds);
      
      // Refresh the album data to reflect the deletions
      queryClient.invalidateQueries(['fetchAlbum', props.albumId]);
      
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Delete error:', error);
      // TODO: Show error toast/notification to user
      setIsDeleteModalOpen(false);
    }
  };

  useEffect(() => {
    if (smallPhotos.length > 0 && !isInitialized.current) {
      setPhotos(smallPhotos.map(photo => ({ ...photo, selected: false })));
      isInitialized.current = true;
    } else if (smallPhotos.length > 0 && isInitialized.current) {
      setPhotos(prevPhotos => {
        if (prevPhotos.length !== smallPhotos.length) {
          return smallPhotos.map(photo => ({ ...photo, selected: false }));
        }
        return prevPhotos;
      });
    }
  }, [smallPhotos]);

  if (isLoading) return <div className="flex justify-center">Loading...</div>;
  if (error) return <div className="flex justify-center">Error: {error.message}</div>;

  return (
    <div
      className={`w-5/6 flex flex-col justify-center mx-auto mt-2}`}
    >
      {props.albumHeader && album?.name && (
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
              <span>•</span>
              <span>{new Date(album.dateCreated).toLocaleDateString()}</span>
            </span>
          </div>
          <div className="absolute top-0 right-0 mt-4 mr-4 flex items-center gap-3">
            {isLoggedIn && (
              <button
                onClick={selectedCount > 0 ? handleDeleteSelected : undefined}
                className={`transition-all duration-300 ${
                  selectedCount > 0 
                    ? 'text-black hover:text-gray-700 cursor-pointer' 
                    : 'text-gray-300 cursor-not-allowed'
                }`}
                title={
                  selectedCount > 0 
                    ? `Delete ${selectedCount} selected photo${selectedCount > 1 ? 's' : ''}`
                    : 'Select photos to delete'
                }
                disabled={selectedCount === 0}
              >
                <DeleteOutlineRoundedIcon style={{ fontSize: 28 }} />
              </button>
            )}
            <UploadButton onUpload={handleUpload} variant="secondary" size="medium" />
          </div>
        </div>
      )}
      <PhotoAlbum
        photos={photos}
        layout={props.layout}
        {...(props.layout === "rows"
          ? { targetRowHeight: 200 }
          : {
            columns: (containerWidth) => {
              if (containerWidth < 640) return 1;
              return 2;
            },
          })}
        onClick={({ index }) => { setIndex(index); }}
        render={{
          // render image selection icon
          extras: (_, { photo, index }) => (
            <SelectIcon
              selected={photo.selected}
              onClick={(event) => {
                setPhotos((prevPhotos) => {
                  const newPhotos = [...prevPhotos];
                  newPhotos[index] = { ...newPhotos[index], selected: !newPhotos[index].selected };
                  return newPhotos;
                });

                // prevent the event from propagating to the parent link element
                event.preventDefault();
                event.stopPropagation();
              }}
            />
          ),
        }}
      />

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={fullPhotos}
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
        zoom={{ maxZoomPixelRatio: 2 }}
        controller={{ closeOnBackdropClick: true }}
        thumbnails={{ vignette: false }}
      />

      <DeletePhotosModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        selectedCount={selectedCount}
      />
    </div>
  );
};

export default AlbumGallery;