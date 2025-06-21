package com.example.backend.service;

import com.example.backend.api.model.Album;
import com.example.backend.api.model.Collection;
import com.example.backend.exception.CollectionNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class CollectionService {

    private List<Collection> collections;

    public CollectionService() {
        collections = new ArrayList<>();
        Album album1 = new Album("Portfolio", "portfolio", 1, "./photos/image0.jpg", LocalDate.now());
        Album album2 = new Album("Album 2", "album2", 2, "./photos/image5.jpg", LocalDate.now());
        List<Album> albums = new ArrayList<>();
        albums.add(album1);
        albums.add(album2);

        Collection collection = new Collection("Main Collection", "main-collection", albums.size(), albums);
        collections.add(collection);
    }

    /**
     * @param id the unique identifier of the collection to get albums of
     * @return a Collection of Albums without their images
     * @throws CollectionNotFoundException if not collection is found
     */
    public Collection getCollection(String id) throws CollectionNotFoundException {
        Collection collection = collections.stream().filter(c -> c.getId().equals(id)).findFirst().orElse(null);
        if (collection == null) {
            throw new CollectionNotFoundException(id);
        }
        return collection;
    }
}
