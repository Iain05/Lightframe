package com.example.backend.api.model;

public record AlbumParameters(String name, String description, String collection, boolean isPublic) {
    // This record is used to encapsulate the parameters needed to create an album.
}
