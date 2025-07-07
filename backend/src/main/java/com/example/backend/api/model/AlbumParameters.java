package com.example.backend.api.model;

import java.time.LocalDate;

public record AlbumParameters(String name, String description, String collection, boolean isPublic, LocalDate eventDate) {
    // This record is used to encapsulate the parameters needed to create an album.
}
