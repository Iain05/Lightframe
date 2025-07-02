package com.example.backend.exception;

public class DeletePhotoException extends RuntimeException {
    public DeletePhotoException(String message) {
        super(message);
    }
}
