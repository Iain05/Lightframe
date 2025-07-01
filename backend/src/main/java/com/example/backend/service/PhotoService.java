package com.example.backend.service;

import com.example.backend.api.Repository.PhotoRepository;

import com.example.backend.api.utils.ImageUploader;
import com.example.backend.exception.UploadPhotoException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.util.Objects;

@Service
public class PhotoService {

    private final PhotoRepository photoRepository;

    private ImageUploader uploader;

    @Value("${bucket.preauth.url}")
    private String PRE_AUTHORIZED_URL;


    public PhotoService(PhotoRepository photoRepository) {
        this.photoRepository = photoRepository;
    }

    @PostConstruct
    private void initializeUploader() {
        uploader = new ImageUploader(PRE_AUTHORIZED_URL);
    }

    /**
     * Upload a photo to the database and bucket.
     */
    public void uploadPhotos(String albumId, MultipartFile[] photos) throws UploadPhotoException {
        if (photos == null || photos.length == 0) {
            throw new UploadPhotoException("No photos provided for upload.");
        }

        for (MultipartFile photo : photos) {
            if (!validateFileType(photo)) continue;

            try {
                String location = handleImageMultipleUploads(albumId, photo, photo.getOriginalFilename());
                System.out.println("Photo uploaded successfully: " + location);
            } catch (IOException e) {
                throw new UploadPhotoException("Error uploading photo: " + e.getMessage());
            }
        }
    }

    private boolean validateFileType(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return false;
        }
        return Objects.requireNonNull(file.getContentType()).startsWith("image/");
    }

    private String handleImageMultipleUploads(String albumId, MultipartFile photo, String name)
            throws UploadPhotoException, IOException {
        String fileLocation = albumId + "/" + name;
        try {
            String uploadedKeySmall = uploader.resizeAndUpload(photo, "small/" + fileLocation, 640, 360);
            String uploadedKeyMedium = uploader.resizeAndUpload(photo, "medium/" + fileLocation, 1920,1080);
            String uploadedKeyLarge = uploader.resizeAndUpload(photo, "large/" + fileLocation, 0, 0);
            return fileLocation;
        } catch (IOException e) {
            throw new UploadPhotoException("Error uploading photo: " + e.getMessage());
        }
    }
}