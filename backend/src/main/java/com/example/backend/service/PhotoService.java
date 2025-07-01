package com.example.backend.service;

import com.example.backend.api.Repository.AlbumRepository;
import com.example.backend.api.Repository.PhotoRepository;

import com.example.backend.api.model.Photo;
import com.example.backend.api.utils.ImageMetadataUtil;
import com.example.backend.api.utils.ImageUploader;
import com.example.backend.exception.UploadPhotoException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.util.Objects;

import java.time.LocalDateTime;

@Service
public class PhotoService {

    private final PhotoRepository photoRepository;
    private final AlbumRepository albumRepository;

    private ImageUploader uploader;

    @Value("${bucket.preauth.url}")
    private String PRE_AUTHORIZED_URL;


    public PhotoService(PhotoRepository photoRepository, AlbumRepository albumRepository) {
        this.photoRepository = photoRepository;
        this.albumRepository = albumRepository;
    }

    @PostConstruct
    private void initializeUploader() {
        uploader = new ImageUploader(PRE_AUTHORIZED_URL);
    }

    /**
     * Upload photos to the database and bucket while resizing. Does not mutate photos.
     */
    public void uploadPhotos(String albumId, MultipartFile[] photos) throws UploadPhotoException {
        if (photos == null || photos.length == 0) {
            throw new UploadPhotoException("No photos provided for upload.");
        }

        if (albumId == null || albumId.isEmpty()) {
            throw new UploadPhotoException("Album ID cannot be null or empty.");
        }

        if (!albumRepository.existsById(albumId)) {
            throw new UploadPhotoException("Album with ID " + albumId + " does not exist.");
        }

        for (MultipartFile photo : photos) {
            if (!validateFileType(photo)) continue;
            try {
                String location = handleImageMultipleUploads(albumId, photo, photo.getOriginalFilename());
                addPhotoToDatabase(albumId, location, photo);
                System.out.println("Photo uploaded successfully: " + location);
            } catch (UploadPhotoException e) {
                throw new UploadPhotoException("Error uploading photo: " + e.getMessage());
            }
        }
    }

    private void addPhotoToDatabase(String albumId, String location, MultipartFile photo) throws UploadPhotoException {
        ImageMetadataUtil.ImageInfo imageInfo = ImageMetadataUtil.extractImageInfo(photo);
        Photo newPhoto = new Photo(
                albumId,
                location,
                imageInfo.width,
                imageInfo.height,
                imageInfo.captureDate
        );
        photoRepository.save(newPhoto);
//        Photo newPhoto = new Photo(albumId, location,
    }


    private boolean validateFileType(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return false;
        }

        return Objects.requireNonNull(file.getContentType()).startsWith("image/");
    }

    private String handleImageMultipleUploads(String albumId, MultipartFile photo, String name)
            throws UploadPhotoException {
        String fileLocation = albumId + "/" + name;
        try {
            uploader.resizeAndUpload(photo, "small/" + fileLocation, 1280, 720);
            uploader.resizeAndUpload(photo, "medium/" + fileLocation, 1920,1080);
            uploader.resizeAndUpload(photo, "large/" + fileLocation, 0, 0);
            return fileLocation;
        } catch (IOException e) {
            throw new UploadPhotoException("Error uploading photo: " + e.getMessage());
        }
    }
}