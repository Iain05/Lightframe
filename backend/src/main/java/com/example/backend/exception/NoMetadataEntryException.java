package com.example.backend.exception;

public class NoMetadataEntryException extends RuntimeException {
    public NoMetadataEntryException(String message) {
        super(message);
    }
}
