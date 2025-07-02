package com.example.backend.api.utils;

import net.coobird.thumbnailator.Thumbnails;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class ImageUploader {

    private final String preAuthorizedUrl;

    /**
     * Constructor for ImageUploader that initializes with a pre-authorized URL and OCI configuration.
     *
     * @param preAuthorizedUrl The pre-authorized URL for uploading images to Oracle Cloud.
     */
    public ImageUploader(String preAuthorizedUrl) {
        this.preAuthorizedUrl = preAuthorizedUrl;
        System.out.println("Initializing Oracle Cloud uploader with pre-authorized URL");
        System.out.println("Pre-auth URL: " + preAuthorizedUrl);

        // Validate the URL format
        if (preAuthorizedUrl == null || !preAuthorizedUrl.startsWith("https://")) {
            System.err.println("WARNING: Pre-authorized URL might be invalid");
        }
        if (!preAuthorizedUrl.endsWith("/o/")) {
            System.err.println("WARNING: Pre-authorized URL should end with '/o/'");
        }
    }

    /**
     * Resize the image and upload it to Oracle Cloud using a pre-authorized URL. If width or height is 0,
     * the original image is uploaded without resizing. Otherwise, the image is resized to the specified dimensions.
     * The original aspect ratio is maintained during resizing.
     *
     * @param multipartFile The image file to resize and upload.
     * @param key           The key under which the image will be stored in the bucket.
     * @param width         The desired width of the resized image.
     * @param height        The desired height of the resized image.
     * @return The key of the uploaded image.
     * @throws IOException If an error occurs during resizing or uploading.
     */
    public String resizeAndUpload(MultipartFile multipartFile, String key, int width, int height) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        if (width == 0 || height == 0) {
            outputStream.write(multipartFile.getBytes());
        } else {
            Thumbnails.of(multipartFile.getInputStream())
                    .size(width, height)
                    .outputFormat("jpg")
                    .toOutputStream(outputStream);
        }

        byte[] resizedImageBytes = outputStream.toByteArray();

        // 2. Upload to Oracle Cloud using pre-authorized URL
        return uploadToPreAuthorizedUrl(resizedImageBytes, key);
    }

    private String uploadToPreAuthorizedUrl(byte[] imageBytes, String key) throws IOException {
        String fullUrl = preAuthorizedUrl + key;

        URL url = new URL(fullUrl);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        
        connection.setRequestMethod("PUT");
        connection.setRequestProperty("Content-Type", "image/jpeg");
        connection.setRequestProperty("Content-Length", String.valueOf(imageBytes.length));
        connection.setDoOutput(true);

        try (OutputStream os = connection.getOutputStream()) {
            os.write(imageBytes);
            os.flush();
        }

        int responseCode = connection.getResponseCode();

        if (responseCode >= 200 && responseCode < 300) {
            return key;
        } else {
            // Read error response body for more details
            String errorBody = "";
            try {
                if (connection.getErrorStream() != null) {
                    errorBody = new String(connection.getErrorStream().readAllBytes());
                    System.out.println("Error response body: " + errorBody);
                }
            } catch (Exception e) {
                System.out.println("Could not read error response: " + e.getMessage());
            }
            
            throw new IOException("Failed to upload image. Response code: " + responseCode + 
                                " Response message: " + connection.getResponseMessage() +
                                " Error body: " + errorBody);
        }
    }
}
