package com.example.backend.service;

import com.example.backend.api.Repository.AlbumRepository;
import com.example.backend.api.model.Album;
import com.example.backend.api.model.Collection;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class CollectionService {

    private final AlbumRepository albumRepository;

    public CollectionService(AlbumRepository albumRepository) {
        this.albumRepository = albumRepository;
    }

    /**
     * Collections are not tracked as entities — they are an implicit grouping
     * by the {@code collection} field on {@link Album}. A request for an
     * unknown or empty collection therefore returns an empty collection rather
     * than 404, so the client can render the "create first album" UI.
     *
     * @param id the unique identifier of the collection to get albums of
     * @return a Collection of Albums without their images (may be empty)
     */
    public Collection getCollection(String id) {
        List<Album> albumsInCollection = albumRepository.findAlbumsByCollection(id);

        List<Album> albumsInCollectionSorted = albumsInCollection.stream()
                .sorted((a1, a2) -> getEventDateElseCreatedDate(a2).compareTo(getEventDateElseCreatedDate(a1)))
                .toList();

        return new Collection(id, albumsInCollectionSorted);
    }

    private LocalDate getEventDateElseCreatedDate(Album album) {
        if (album.getEventDate() != null) {
            return album.getEventDate();
        } else {
            return album.getDateCreated().toLocalDate();
        }
    }
}
