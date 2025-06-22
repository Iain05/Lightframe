package com.example.backend.api.model;

import jakarta.persistence.*;

import java.time.LocalDate;

/**
 * Represents an album in the database.
 *
 * This class is mapped to the "albums" table in the database.
 */
@Entity
@Table(name = "albums")
public class Album {
    @Id
    private String id;

    private String name;

    private String description;

    @Column(name = "cover_image")
    private String coverImage;

    @Column(name = "num_photos")
    private Integer numPhotos;

    private String collection;

    @Column(name = "date_created")
    private LocalDate dateCreated;

    public Album(String name, String id, String coverImage, LocalDate dateCreated, int size) {
        this.name = name;
        this.id = id;
        this.coverImage = coverImage;
        this.dateCreated = dateCreated;
        this.numPhotos = size;
        this.description = "description";
    }

    public Album() {
        this.dateCreated = LocalDate.now();
        this.numPhotos = 0;
        this.description = "description";
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getCoverImage() {
        return coverImage;
    }

    public Integer getNumPhotos() {
        return numPhotos;
    }

    public LocalDate getDateCreated() {
        return dateCreated;
    }

    public String getCollection() {
        return collection;
    }
}
