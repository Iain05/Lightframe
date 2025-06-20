import type { Photo } from "react-photo-album";

const breakpoints = [1080, 640, 384, 256, 128, 96, 64, 48];

const photos: Photo[] = [
  {
    src: "./photos/image0.jpg",
    width: 720,
    height: 1080
  },
  {
    src: "./photos/image1.jpg",
    width: 864,
    height: 1080
  },
  {
    src: "./photos/image2.jpg",
    width: 1620,
    height: 1080
  },
  {
    src: "./photos/image3.jpg",
    width: 1620,
    height: 1080
  },
  {
    src: "./photos/image4.jpg",
    width: 1920,
    height: 709
  },
  {
    src: "./photos/image5.jpg",
    width: 1620,
    height: 1080
  },
  {
    src: "./photos/image6.jpg",
    width: 1620,
    height: 1080
  },
  {
    src: "./photos/image7.jpg",
    width: 1620,
    height: 1080
  },
  {
    src: "./photos/image8.jpg",
    width: 1620,
    height: 1080
  },
  {
    src: "./photos/image9.jpg",
    width: 1440,
    height: 1080
  }
].map(({ src, width, height }) => {
  return {
    src: src,
    width: width,
    height: height,
    srcSet: breakpoints.map((breakpoint) => ({
      src: src,
      width: breakpoint,
      height: Math.round((height / width) * breakpoint) // Calculate height based on aspect ratio
    }))
  }
});

export default photos;