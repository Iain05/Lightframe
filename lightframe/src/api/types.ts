export interface AlbumResponse {
    name: string;
    dateCreated: string;
    description: string;
    public: boolean;
    id: string;
    index: number;
    coverImage: string;
    numPhotos: number;
    photos: AlbumPhotos[];
}

interface AlbumPhotos {
    url: string;
    width: number;
    height: number;
    index: number;
    dateTaken?: string;
}

export interface CollectionResponse {
    name: string;
    count: number;
    albums: CollectionAlbum[];
}

interface CollectionAlbum {
    id: string;
    index: number;
    name: string;
    public: boolean;
    coverImage: string;
    dateCreated: string;
    numPhotos: number;
}