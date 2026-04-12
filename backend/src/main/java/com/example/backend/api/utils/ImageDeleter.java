package com.example.backend.api.utils;

import com.example.backend.exception.DeletePhotoException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

@Component
public class ImageDeleter {

    private final S3Client s3Client;

    @Value("${r2.bucket.name}")
    private String bucketName;

    public ImageDeleter(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    /**
     * Delete a single object from the R2 bucket.
     *
     * @param objectName The key of the object to delete.
     * @throws DeletePhotoException if deletion fails.
     */
    public void deleteObject(String objectName) throws DeletePhotoException {
        try {
            DeleteObjectRequest request = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(objectName)
                    .build();
            s3Client.deleteObject(request);
        } catch (S3Exception e) {
            throw new DeletePhotoException("Failed to delete object from R2 (key=" + objectName + "): " + e.getMessage());
        }
    }

    /**
     * Delete all three size variants (small/medium/large) for a single photo.
     *
     * @param photoPath The base path of the photo (without size prefix), e.g. "albumId/photo.jpg".
     * @throws DeletePhotoException if any deletion fails.
     */
    public void deletePhotoAllSizes(String photoPath) throws DeletePhotoException {
        String[] sizes = {"small/", "medium/", "large/"};
        for (String size : sizes) {
            try {
                deleteObject(size + photoPath);
            } catch (DeletePhotoException e) {
                System.err.println("Failed to delete " + size + photoPath + ": " + e.getMessage());
            }
        }
    }
}
