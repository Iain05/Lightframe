import { useState } from 'react';

import "yet-another-react-lightbox/plugins/thumbnails.css";

import { ColumnsPhotoAlbum } from "react-photo-album";
import "react-photo-album/columns.css";
import "./css/lightbox-override.css"

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import photos from './photos';
const Portfolio = () => {
  const [index, setIndex] = useState(-1);

    return (
      <div className="w-5/6 flex justify-center mx-auto mt-2">
        <ColumnsPhotoAlbum
          photos={photos}
          columns={2}
          onClick={({ index }) => { setIndex(index) }}
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
    )
}

export default Portfolio;