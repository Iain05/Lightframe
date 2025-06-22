package com.example.backend.api.model;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "photos")
public class Photo {
    @Id
    private int id;

    @Column(name = "album_id")
    private String albumId;

    private String url;

    private int width;

    private int height;

    @Column(name = "photo_index")
    private Integer index;

    @Column(name = "date_taken")
    private LocalDateTime dateTaken;

    @Column(name = "created_at")
    private LocalDateTime dateCreated;

    public int getId() {
        return id;
    }

    public String getAlbumId() {
        return albumId;
    }

    public String getUrl() {
        return url;
    }

    public int getWidth() {
        return this.width;
    }

    public int getHeight() {
        return this.height;
    }

    public Integer getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public LocalDateTime getDateTaken() {
        return dateTaken;
    }

    public LocalDateTime getDateCreated() {
        return dateCreated;
    }
}
