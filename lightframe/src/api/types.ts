export interface AlbumResponse {
    name: string;
    dateCreated: string;
    description: string;
    public: boolean;
    id: string;
    index: number;
    coverImage: string;
    numPhotos: number;
    eventDate?: string;
    photos: AlbumPhotos[];
}

interface AlbumPhotos {
    url: string;
    width: number;
    height: number;
    index: number;
    id: number;
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
    description?: string;
    eventDate?: string;
}