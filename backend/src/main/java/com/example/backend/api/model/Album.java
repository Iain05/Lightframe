package com.example.backend.api.model;
import java.time.LocalDate;

public class Album {
    private String name;
    private String id;
    private int index;
    private String coverImage;
    private LocalDate dateCreated;
    private int numPhotos;

    public Album(String name, String id, int index, String coverImage, LocalDate dateCreated, int numPhotos) {
        this.name = name;
        this.id = id;
        this.index = index;
        this.coverImage = coverImage;
        this.dateCreated = dateCreated;
        this.numPhotos = numPhotos;
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

    public int getIndex() {
        return this.index;
    }

    public String getCoverImage() {
        return this.coverImage;
    }

    public int getNumPhotos() {
        return this.numPhotos;
    }

    public void setNumPhotos(int numPhotos) {
        this.numPhotos = numPhotos;
    }
}
