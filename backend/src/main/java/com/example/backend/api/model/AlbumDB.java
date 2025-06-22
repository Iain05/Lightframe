package com.example.backend.api.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "albums")
public class AlbumDB {
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
