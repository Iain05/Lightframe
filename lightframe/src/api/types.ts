export interface Album {
    name: string;
    dateCreated: string;
    photos: AlbumPhotos[];
}

interface AlbumPhotos {
    url: string;
    width: number;
    height: number;
    index: number;
    dateTaken?: string;
}