package com.example.backend.api.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class AlbumImages extends Album {
    private List<Photo> photos;

    public AlbumImages(String name, String id, int index, String coverImage, LocalDate dateCreated, List<Photo> photos) {
        super(name, id, index, coverImage, dateCreated, photos.size());
        this.photos = new ArrayList<>(photos);
    }

    public List<Photo> getPhotos() {
        return new ArrayList<>(photos);
    }
}
