package com.example.backend.exception;

public class AlbumNotFoundException extends Exception {
    public AlbumNotFoundException(String message) {
        super(message);
    }
}
