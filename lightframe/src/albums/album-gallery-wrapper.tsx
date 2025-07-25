import { useParams } from 'react-router-dom';
import AlbumGallery from './album-gallery';
import { useMemo } from 'react';

function AlbumGalleryWrapper() {
    const { albumId } = useParams<{ albumId: string }>();

    // Memoize the albumId to prevent unnecessary re-renders
    const memoizedAlbumId = useMemo(() => albumId, [albumId]);

    if (!memoizedAlbumId) {
        return <div className="flex justify-center">Album ID is required</div>;
    }

    return <AlbumGallery albumId={memoizedAlbumId} albumHeader={ true } layout="rows" />;
}

export default AlbumGalleryWrapper;