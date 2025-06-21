import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

import "yet-another-react-lightbox/plugins/thumbnails.css";

import PhotoAlbum from "react-photo-album";
import "react-photo-album/styles.css";
import "@src/css/lightbox-override.css";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import type { AlbumResponse } from '../api/types';
import type { Photo } from "react-photo-album";

type AlbumGalleryProps = {
  albumId: string;
  albumHeader?: boolean;
  layout: "columns" | "rows" | "masonry";
}

function AlbumGallery(props: AlbumGalleryProps) {
  const [index, setIndex] = useState(-1);
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();

  const { data: album, isLoading, error } = useQuery<AlbumResponse, Error>(
    ['fetchAlbum', props.albumId],
    async () => {
      const response = await fetch(`http://localhost:8080/api/album?id=${props.albumId}`);
      if (!response.ok) throw new Error('Failed to fetch album');
      return response.json();
    },
  );

  useEffect(() => {
    setFadeIn(false);
    const timeout = setTimeout(() => setFadeIn(true), 0);
    return () => clearTimeout(timeout);
  }, [props.albumId]);

  const breakpoints = [1080, 640, 384, 256, 128, 96, 64, 48];
  const photos: Photo[] = album?.photos.map(({ url, width, height }) => ({
    src: url,
    width: width,
    height: height,
    srcSet: breakpoints.map((breakpoint) => ({
      src: url,
      width: breakpoint,
      height: Math.round((height / width) * breakpoint),
    })),
  })) || [];

  if (isLoading) return <div className="flex justify-center">Loading...</div>;
  if (error) return <div className="flex justify-center">Error: {error.message}</div>;

  return (
    <div
      className={`w-5/6 flex flex-col justify-center mx-auto mt-2 transform transition-opacity duration-500 ease-in-out ${fadeIn ? 'opacity-100' : 'opacity-0'
        }`}
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
          <div className="flex flex-col items-center mt-8">
            <span className="text-xl text-center text-gray-600 flex items-center justify-center gap-5">
              <span>{album.numPhotos} photos</span>
              <span>•</span>
              <span>{new Date(album.dateCreated).toLocaleDateString()}</span>
            </span>
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
      />

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={photos}
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
        zoom={{ maxZoomPixelRatio: 2 }}
        controller={{ closeOnBackdropClick: true }}
        thumbnails={{ vignette: false }}
      />
    </div>
  );
};

export default AlbumGallery;