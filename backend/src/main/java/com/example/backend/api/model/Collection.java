package com.example.backend.api.model;

import java.util.ArrayList;
import java.util.List;

public class Collection {
    private String id;
    private int count;
    private List<Album> albums;

    public Collection(String id, List<Album> albums) {
        this.id = id;
        this.count = albums.size();
        this.albums = new ArrayList<>(albums);
    }

    public String getId() {
        return this.id;
    }

    public int getCount() {
        return this.count;
    }

    public List<Album> getAlbums() {
        return new ArrayList<>(this.albums);
    }
}
