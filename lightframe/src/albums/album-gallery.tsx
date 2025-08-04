import React from 'react';
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

import LightboxButton from "@src/components/lightbox-button";

import AlbumHeader from './album-header';
import PhotoOverlay from './photo-overlay';
import DeletePhotosModal from './delete-photos-modal';
import Actions from './actions/actions';
import { albumAPI } from '../api/album-api';
import { downloadPhoto } from '../utils/download-utils';
import type { AlbumResponse } from '../api/types';
import type { SelectablePhoto, AlbumGalleryProps } from '@src/types/types';

import DownloadIcon from '@mui/icons-material/Download';


const BREAKPOINTS = [1080, 640, 384, 256, 128, 96, 64, 48];

function generatePhotos(albumPhotos: AlbumResponse['photos'], basePath: string, breakpoints: number[]): SelectablePhoto[] {
  return albumPhotos
    .map(({ url, width, height, id, dateTaken }) => ({
      src: `${basePath}/${url}`,
      width: width,
      height: height,
      id: id,
      dateTaken: dateTaken,
      srcSet: breakpoints.map((breakpoint) => ({
        src: `${basePath}/${url}`,
        width: breakpoint,
        height: Math.round((height / width) * breakpoint),
      })),
    }))
    .sort((a, b) => {
      // Sort by date taken descending (newest first)
      if (!a.dateTaken && !b.dateTaken) return 0;
      if (!a.dateTaken) return 1;
      if (!b.dateTaken) return -1;
      return new Date(b.dateTaken).getTime() - new Date(a.dateTaken).getTime();
    });
}

function generateLightboxPhotos(
  albumPhotos: AlbumResponse['photos'],
  basePath: string,
  fullResPath: string,
  breakpoints: number[]):
  SelectablePhoto[] {
  return albumPhotos
    .map(({ url, width, height, id, dateTaken }) => ({
      src: `${basePath}/${url}`,
      width: width,
      height: height,
      id: id,
      dateTaken: dateTaken,
      downloadUrl: `${fullResPath}/${url}`,
      srcSet: breakpoints.map((breakpoint) => ({
        src: `${basePath}/${url}`,
        width: breakpoint,
        height: Math.round((height / width) * breakpoint),
      })),
    }))
    .sort((a, b) => {
      // Sort by date taken descending (newest first)
      if (!a.dateTaken && !b.dateTaken) return 0;
      if (!a.dateTaken) return 1;
      if (!b.dateTaken) return -1;
      return new Date(b.dateTaken).getTime() - new Date(a.dateTaken).getTime();
    });
}

function AlbumGallery(props: AlbumGalleryProps) {
  const [index, setIndex] = useState(-1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [downloadingPhotoId, setDownloadingPhotoId] = useState<number | null>(null);
  const [settingCoverPhotoId, setSettingCoverPhotoId] = useState<number | null>(null);
  const [coverSuccessPhotoId, setCoverSuccessPhotoId] = useState<number | null>(null);
  const [showLoading, setShowLoading] = useState(false);
  const queryClient = useQueryClient();

  type ThumbnailsRef = {
    visible: boolean;
    show: () => void;
    hide: () => void;
  } | null;

  const thumbnailsRef = React.useRef<ThumbnailsRef>(null);

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
        await downloadPhoto({
          albumName: album?.name,
          photoIndex: index,
          downloadUrl: photo.downloadUrl,
        });
      } catch (error) {
        console.error('Download failed:', error);
        // Fallback to opening the original URL
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
  if (album?.name && location.pathname.startsWith('/album/')) document.title = album.name + " | Iain Griesdale";
  
}, [album?.name]);

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
        rootMargin: '0px 0px',
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

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isLoading) {
      timeoutId = setTimeout(() => {
        setShowLoading(true);
      }, 2000); // Show loading text after 2 seconds
    } else {
      setShowLoading(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoading]);

  if (isLoading && showLoading) return <div className="flex justify-center">Loading...</div>;
  if (error) return <div className="flex justify-center">Error: {error.message}</div>;

  return (
    <div
      className={`w-full md:w-5/6 flex flex-col justify-center mx-auto mt-2 pr-4 pl-4`}
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
          spacing={30}
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
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
        zoom={{ maxZoomPixelRatio: 1 }}
        controller={{ closeOnBackdropClick: !isFullscreen }}
        thumbnails={{ ref: thumbnailsRef, vignette: false, hidden: window.innerHeight < 500 }}
        slideshow={{ delay: 10000 }}
        on={{
          enterFullscreen: () => {
            thumbnailsRef.current?.hide?.();
            setIsFullscreen(true);
          },
          exitFullscreen: () => {
            thumbnailsRef.current?.show?.();
            setIsFullscreen(false);
          },
        }}
        render={{
          buttonZoom: () => null,
          slide: ({ slide }) => {
            return (
              <img
                src={slide.src}
                style={{
                  maxWidth: '100vw',
                  maxHeight: '100%',
                }}
                loading='lazy'
              />
            );
          },
        }}
        toolbar={{
          buttons: [
            ( !isFullscreen && <LightboxButton
              key="download"
              onClick={() => {
                const currentPhoto = mediumPhotos[index];
                handleDownload(currentPhoto, index);
              }}
              icon={<DownloadIcon sx={{ fontSize: 28 }} />}
            />),
            "slideshow",
            "fullscreen",
            !isFullscreen ? "close" : null,
          ]
        }}
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