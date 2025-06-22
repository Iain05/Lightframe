package com.example.backend.service;

import com.example.backend.api.Repository.AlbumRepository;
import com.example.backend.api.model.Album;
import com.example.backend.api.model.Collection;
import com.example.backend.exception.CollectionNotFoundException;
import org.springframework.stereotype.Service;

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
        if (albumsInCollection.isEmpty()) {
            throw new CollectionNotFoundException(id);
        }
        return new Collection(id, albumsInCollection);
    }
}
