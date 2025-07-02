package com.example.backend.service;

import com.example.backend.api.Repository.AlbumRepository;
import com.example.backend.api.Repository.PhotoRepository;

import com.example.backend.api.model.Photo;
import com.example.backend.api.utils.ImageMetadataUtil;
import com.example.backend.api.utils.ImageUploader;
import com.example.backend.api.utils.ImageDeleter;
import com.example.backend.exception.DeletePhotoException;
import com.example.backend.exception.UploadPhotoException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.util.List;
import java.util.Objects;

@Service
public class PhotoService {

    private final PhotoRepository photoRepository;
    private final AlbumRepository albumRepository;
    private final ImageDeleter imageDeleter;

    private ImageUploader uploader;

    @Value("${bucket.preauth.url}")
    private String PRE_AUTHORIZED_URL;

    @Value("${oci.bucket.name}")
    private String BUCKET_NAME;

    @Value("${oci.bucket.namespace}")
    private String NAMESPACE_NAME;


    public PhotoService(PhotoRepository photoRepository, AlbumRepository albumRepository, ImageDeleter imageDeleter) {
        this.photoRepository = photoRepository;
        this.albumRepository = albumRepository;
        this.imageDeleter = imageDeleter;
    }

    @PostConstruct
    private void initializeUploader() {
        uploader = new ImageUploader(PRE_AUTHORIZED_URL);
    }

    /**
     * Upload photos to the database and bucket while resizing. Does not mutate photos.
     * @param albumId The ID of the album to which the photos will be uploaded.
     * @param photo The photo to be uploaded.
     * @throws UploadPhotoException If the photo is null, the album ID is null or empty, or if the album does not exist.
     */
    @Transactional
    public void uploadPhotos(String albumId, MultipartFile photo) throws UploadPhotoException {
        if (photo == null) {
            throw new UploadPhotoException("No photos provided for upload.");
        }

        if (albumId == null || albumId.isEmpty()) {
            throw new UploadPhotoException("Album ID cannot be null or empty.");
        }

        if (!albumRepository.existsById(albumId)) {
            throw new UploadPhotoException("Album with ID " + albumId + " does not exist.");
        }

        if (!validateFileType(photo)) throw new UploadPhotoException("Invalid file type. Only image files are allowed.");
        try {
            String location = handleImageMultipleUploads(albumId, photo, photo.getOriginalFilename());
            addPhotoToDatabase(albumId, location, photo);
            System.out.println("Photo uploaded successfully: " + location);
        } catch (UploadPhotoException e) {
            throw new RuntimeException("Error uploading photo: " + e.getMessage());
        }
    }

    /**
     * Delete photos from the database and bucket. This method will throw an exception if any photo does not exist.
     * If a photo is successfully deleted from the database but fails to delete from the bucket,
     * it will log the error and continue deleting the next photo.
     * @param photoIds List of photo IDs to delete.
     * @throws DeletePhotoException If the list of photo IDs is null or empty.
     */
    @Transactional
    public void deletePhoto(List<Integer> photoIds) throws DeletePhotoException {
        if (photoIds == null || photoIds.isEmpty()) {
            throw new DeletePhotoException("No photo IDs provided for deletion.");
        }

        for (Integer photoId : photoIds) {
            Photo photo = photoRepository.findPhotoById(photoId);
            if (photo == null) {
                System.out.println("Photo with ID " + photoId + " does not exist. Skipping deletion.");
                continue; // Skip this photo if it does not exist
            }
            
            photoRepository.delete(photo);
            
            try {
                deletePhotoFromBucket(photo.getUrl());
            } catch (DeletePhotoException e) {
                System.err.println("Failed to delete photo from bucket, but removed from database: " + e.getMessage());
                throw new RuntimeException("Error deleting photo from bucket: " + e.getMessage());
            }
        }
    }

    private void deletePhotoFromBucket(String photoUrl) throws DeletePhotoException {
        try {
            // Delete all sizes (small, medium, large) of the photo
            imageDeleter.deletePhotoAllSizes(photoUrl);
            System.out.println("Photo deleted successfully from bucket: " + photoUrl);
        } catch (DeletePhotoException e) {
            throw new DeletePhotoException("Error deleting photo from bucket: " + e.getMessage());
        } catch (Exception e) {
            throw new DeletePhotoException("Unexpected error deleting photo from bucket: " + e.getMessage());
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