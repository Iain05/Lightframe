package com.example.backend.api.model;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class Album {
    private String name;
    private String id;
    private LocalDate dateCreated;
    private List<Photo> photos;

    public Album(String name, LocalDate dateCreated, List<Photo> photos) {
        this.name = name;
        this.id = name.toLowerCase().replaceAll(" ", "-");
        this.dateCreated = dateCreated;
        this.photos = new ArrayList<>(photos);
    }

    public String getName() {
        return this.name;
    }

    public LocalDate getDateCreated() {
        return this.dateCreated;
    }

    public String getId() {
        return this.id;
    }

    public ArrayList<Photo> getPhotos() {
        return new ArrayList<>(this.photos);
    }
}
