package com.example.backend.service;

import com.example.backend.api.Repository.AlbumRepository;
import com.example.backend.api.model.Album;
import com.example.backend.api.model.Collection;
import com.example.backend.exception.CollectionNotFoundException;
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
     * @param id the unique identifier of the collection to get albums of
     * @return a Collection of Albums without their images
     * @throws CollectionNotFoundException if not collection is found
     */
    public Collection getCollection(String id) throws CollectionNotFoundException {
        List<Album> albumsInCollection = albumRepository.findAlbumsByCollection(id);

        List<Album> albumsInCollectionSorted = albumsInCollection.stream()
                .sorted((a1, a2) -> getEventDateElseCreatedDate(a2).compareTo(getEventDateElseCreatedDate(a1)))
                .toList();

        if (albumsInCollectionSorted.isEmpty()) {
            throw new CollectionNotFoundException(id);
        }
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
