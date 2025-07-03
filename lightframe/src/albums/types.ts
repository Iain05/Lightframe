import type { Photo } from "react-photo-album";

export type SelectablePhoto = Photo & {
  id: number;
  downloadUrl?: string;
  selected?: boolean;
};

export interface AlbumGalleryProps {
  albumId: string;
  layout: "columns" | "rows" | "masonry";
  allowSelect?: boolean;
  allowDownload?: boolean;
  albumHeader?: boolean;
}
