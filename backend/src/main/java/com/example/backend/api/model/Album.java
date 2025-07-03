package com.example.backend.api.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.example.backend.api.utils.RandomGenerators;

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

    @Column(name = "public")
    private boolean isPublic;

    private String description;

    @Column(name = "cover_image")
    private String coverImage;

    @Column(name = "num_photos")
    private Integer numPhotos;

    private String collection;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Album(String name, String description, String collection, boolean isPublic) {
        this.name = name;
        this.description = description;
        this.collection = collection;
        this.isPublic = isPublic;
        this.createdAt = LocalDateTime.now();
        this.numPhotos = 0;
        this.id = RandomGenerators.generateRandomString();
    }

    public Album(String name, String id, String description, boolean isPublic, String coverImage, LocalDateTime createdAt, Integer numPhotos) {
        this.name = name;
        this.id = id;
        this.description = description;
        this.isPublic = isPublic;
        this.coverImage = coverImage;
        this.createdAt = createdAt;
        this.numPhotos = numPhotos;
    }

    public Album() {
        this.createdAt = LocalDateTime.now();
        this.numPhotos = 0;
        this.description = "description";
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public boolean isPublic() {
        return isPublic;
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

    public LocalDateTime getDateCreated() {
        return createdAt;
    }

    public String getCollection() {
        return collection;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCoverImage(String coverImage) {
        this.coverImage = coverImage;
    }

    public void setPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }
}
