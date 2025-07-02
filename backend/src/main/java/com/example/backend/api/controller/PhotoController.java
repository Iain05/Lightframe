package com.example.backend.api.controller;

import com.example.backend.api.model.DeletePhotosRequest;
import com.example.backend.exception.DeletePhotoException;
import com.example.backend.exception.UploadPhotoException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.backend.service.PhotoService;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/photo")
public class PhotoController {
    private final PhotoService photoService;

    @Autowired
    public PhotoController(PhotoService photoService) {
        this.photoService = photoService;
    }

    /**
     * Upload photos to an album. The photo will be resized to fit three different sizes and uploaded to a bucket.
     * @param albumId The ID of the album to which the photos will be uploaded.
     * @param photos The array of photos to upload.
     * @return ResponseEntity indicating success or failure.
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadPhotos(@RequestParam("albumId") String albumId,
                                          @RequestParam("photos") MultipartFile[] photos) {
        try {
            photoService.uploadPhotos(albumId, photos);
        } catch (UploadPhotoException e) {
            return ResponseEntity.badRequest().body("Error uploading photos: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }

        return ResponseEntity.ok("Photos uploaded successfully");
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deletePhoto(@RequestBody DeletePhotosRequest request) {
        try {
            photoService.deletePhoto(request.getPhotoIds());
        } catch (DeletePhotoException e) {
            return ResponseEntity.badRequest().body("Error deleting photo: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }

        return ResponseEntity.ok("Photo deleted successfully");
    }

}
