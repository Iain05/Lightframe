package com.example.backend.api.model;
import java.time.LocalDateTime;

public class Photo {
    private String url;
    private int width;
    private int height;
    private int index;
    private LocalDateTime dateTaken;

    public Photo(String url, int width, int height, int index, LocalDateTime dateTaken) {
        this.url = url;
        this.width = width;
        this.height = height;
        this.index = index;
        this.dateTaken = dateTaken;
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

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public LocalDateTime getDateTaken() {
        return dateTaken;
    }
}
