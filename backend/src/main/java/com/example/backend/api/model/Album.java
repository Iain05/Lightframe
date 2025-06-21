package com.example.backend.api.model;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class Album {
    private String name;
    private LocalDate dateCreated;
    private List<Photo> photos;

    public Album(String name, LocalDate dateCreated, List<Photo> photos) {
        this.name = name;
        this.dateCreated = dateCreated;
        this.photos = new ArrayList<>(photos);
    }

    public String getName() {
        return this.name;
    }

    public LocalDate getDateCreated() {
        return this.dateCreated;
    }

    public ArrayList<Photo> getPhotos() {
        return new ArrayList<>(this.photos);
    }
}
