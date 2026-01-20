package com.example.backend.api.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class AlbumImages extends Album {
    private List<Photo> photos;

    public AlbumImages(Album album, List<Photo> photos) {
        super(album.getName(),
                album.getId(),
                album.getDescription(),
                album.isPublic(),
                album.getCollection(),
                album.getCoverImage(),
                album.getDateCreated(),
                photos.size(),
                album.getEventDate(),
                album.getViews()
        );
        this.photos = new ArrayList<>(photos);
    }

    public List<Photo> getPhotos() {
        return new ArrayList<>(photos);
    }
}
