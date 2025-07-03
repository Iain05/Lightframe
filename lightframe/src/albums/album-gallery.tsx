import { useState, useEffect, useMemo, useRef } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import "yet-another-react-lightbox/plugins/thumbnails.css";

import PhotoAlbum from "react-photo-album";
import "react-photo-album/styles.css";
import "@src/css/lightbox-override.css";
import "./css/download-overlay.css";
import "./css/photo-animations.css";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Download from "yet-another-react-lightbox/plugins/download";

import AlbumHeader from './album-header';
import PhotoOverlay from './photo-overlay';
import DeletePhotosModal from './delete-photos-modal';
import Actions from './actions/actions';
import { albumAPI } from '../api/album-api';
import type { AlbumResponse } from '../api/types';
import type { Photo } from "react-photo-album";

type SelectablePhoto = Photo & {
  id: number;
  downloadUrl?: string;
  selected?: boolean;
};

interface AlbumGalleryProps {
  albumId: string;
  layout: "columns" | "rows" | "masonry";
  enableOverlay?: boolean;
  albumHeader?: boolean;
}

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

function generateLightboxPhotos(
  albumPhotos: AlbumResponse['photos'], 
  basePath: string, 
  fullResPath: string,
  breakpoints: number[]): 
SelectablePhoto[] {
  return albumPhotos.map(({ url, width, height, id }) => ({
    src: `${basePath}/${url}`,
    width: width,
    height: height,
    id: id,
    downloadUrl: `${fullResPath}/${url}`,
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
  const [downloadingPhotoId, setDownloadingPhotoId] = useState<number | null>(null);
  const [settingCoverPhotoId, setSettingCoverPhotoId] = useState<number | null>(null);
  const [coverSuccessPhotoId, setCoverSuccessPhotoId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const handleUpload = async (file: File) => {
    try {
      await albumAPI.uploadPhoto(props.albumId, file);
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
  
  const mediumPhotos = useMemo(() => {
    return album ? generateLightboxPhotos(
      album.photos, 
      `${import.meta.env.VITE_BUCKET_BASE}medium`, 
      `${import.meta.env.VITE_BUCKET_BASE}large`, 
      BREAKPOINTS) : [];
  }, [album]);
  
  const [photos, setPhotos] = useState<SelectablePhoto[]>([]);
  const isInitialized = useRef(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  const selectedCount = photos.filter(photo => photo.selected).length;

  const handleSelectPhoto = (index: number) => {
    setPhotos((prevPhotos) => {
      const newPhotos = [...prevPhotos];
      newPhotos[index] = { ...newPhotos[index], selected: !newPhotos[index].selected };
      return newPhotos;
    });
  };

  const handleDeleteSelected = () => {
    setIsDeleteModalOpen(true);
  };

  const handleSelectAll = () => {
    setPhotos(prevPhotos => 
      prevPhotos.map(photo => ({ ...photo, selected: true }))
    );
  };

  const handleUnselectAll = () => {
    setPhotos(prevPhotos => 
      prevPhotos.map(photo => ({ ...photo, selected: false }))
    );
  };

  const handleSetAlbumCover = async (photo: SelectablePhoto) => {
    setSettingCoverPhotoId(photo.id);
    try {
      await albumAPI.setAlbumCover(props.albumId, photo.id);
      setSettingCoverPhotoId(null);
      setCoverSuccessPhotoId(photo.id);
      
      setTimeout(() => {
        setCoverSuccessPhotoId(null);
      }, 1500);
      
    } catch (error) {
      console.error('Error setting album cover:', error);
      setSettingCoverPhotoId(null);
    }
  }

  const handleDownload = async (photo: SelectablePhoto, index: number) => {
    if (photo.downloadUrl) {
      setDownloadingPhotoId(photo.id);
      try {
        const response = await fetch(photo.downloadUrl);
        const blob = await response.blob();
        
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${album?.name}-${index}.jpg`;
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Download failed:', error);
        window.open(photo.downloadUrl, '_blank');
      } finally {
        setDownloadingPhotoId(null);
      }
    }
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px',
      }
    );

    const timer = setTimeout(() => {
      const photoElements = galleryRef.current?.querySelectorAll('.react-photo-album--photo');
      photoElements?.forEach((element) => {
        element.classList.add('photo-container');
        observer.observe(element);
      });
    }, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [photos.length]);

  if (isLoading) return <div className="flex justify-center">Loading...</div>;
  if (error) return <div className="flex justify-center">Error: {error.message}</div>;

  return (
    <div
      className={`w-5/6 flex flex-col justify-center mx-auto mt-2}`}
    >
      {props.albumHeader && album?.name && (
        <AlbumHeader album={album} onUpload={handleUpload} />
      )}

      {props.albumHeader && 
        <Actions
          selectedCount={selectedCount}
          totalCount={photos.length}
          onDeleteSelected={handleDeleteSelected}
          onSelectAll={handleSelectAll}
          onUnselectAll={handleUnselectAll}
          albumId={props.albumId}
        />
      }

      <div ref={galleryRef} className="gallery-container">
        <PhotoAlbum
          photos={photos}
          layout={props.layout}
          {...(props.layout === "rows"
            ? { targetRowHeight: 400 }
            : {
              columns: (containerWidth) => {
                if (containerWidth < 640) return 1;
                return 2;
              },
            })}
          onClick={({ index }) => { setIndex(index); }}
          render={{
            extras: (_, { photo, index }) => {
              const mediumPhoto = mediumPhotos[index];
              return (
                <PhotoOverlay
                  photo={photo}
                  mediumPhoto={mediumPhoto}
                  index={index}
                  enableOverlay={props.enableOverlay}
                  downloadingPhotoId={downloadingPhotoId}
                  settingCoverPhotoId={settingCoverPhotoId}
                  coverSuccessPhotoId={coverSuccessPhotoId}
                  onSelectPhoto={handleSelectPhoto}
                  onSetAlbumCover={handleSetAlbumCover}
                  onDownload={handleDownload}
                />
              );
            },
          }}
        />
      </div>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={mediumPhotos}
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom, Download]}
        zoom={{ maxZoomPixelRatio: 1 }}
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

export default AlbumGallery