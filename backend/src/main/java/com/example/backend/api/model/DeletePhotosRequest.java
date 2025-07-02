package com.example.backend.api.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class DeletePhotosRequest {
    private List<Integer> photoIds;

    // Default constructor
    public DeletePhotosRequest() {}

    // Constructor
    public DeletePhotosRequest(List<Integer> photoIds) {
        this.photoIds = photoIds;
    }

    // Getters and Setters
    public List<Integer> getPhotoIds() {
        return photoIds;
    }

    public void setPhotoIds(List<Integer> photoIds) {
        this.photoIds = photoIds;
    }
}
