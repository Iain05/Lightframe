package com.example.backend.api.model;

import java.util.ArrayList;
import java.util.List;

public class Collection {
    private String name;
    private String id;
    private int count;
    private List<Album> albums;

    public Collection(String name, String id, int count, List<Album> albums) {
        this.name = name;
        this.id = id;
        this.count = count;
        this.albums = new ArrayList<>(albums);
    }

    public String getName() {
        return this.name;
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
