package com.example.backend.api.utils;

import net.coobird.thumbnailator.Thumbnails;
import org.springframework.web.multipart.MultipartFile;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import javax.imageio.ImageIO;

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

    private byte[] resizeImageFast(MultipartFile multipartFile, int width, int height) throws IOException {
        BufferedImage originalImage = ImageIO.read(multipartFile.getInputStream());

        // Calculate dimensions maintaining aspect ratio
        int originalWidth = originalImage.getWidth();
        int originalHeight = originalImage.getHeight();

        double aspectRatio = (double) originalWidth / originalHeight;
        
        // If only one dimension is specified, calculate the other
        if (width == 0) {
            width = (int) (height * aspectRatio);
        } else if (height == 0) {
            height = (int) (width / aspectRatio);
        } else {
            // Both dimensions specified - fit within the bounds maintaining aspect ratio
            double targetAspectRatio = (double) width / height;
            
            if (aspectRatio > targetAspectRatio) {
                // Image is wider than target - constrain by width
                height = (int) (width / aspectRatio);
            } else {
                // Image is taller than target - constrain by height
                width = (int) (height * aspectRatio);
            }
        }

        BufferedImage resizedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = resizedImage.createGraphics();

        // Use faster rendering hints
        g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g2d.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_SPEED);
        g2d.setRenderingHint(RenderingHints.KEY_COLOR_RENDERING, RenderingHints.VALUE_COLOR_RENDER_SPEED);

        g2d.drawImage(originalImage, 0, 0, width, height, null);
        g2d.dispose();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageIO.write(resizedImage, "jpg", outputStream);
        return outputStream.toByteArray();
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
        System.out.println("Resizing image with key: " + key + ", width: " + width + ", height: " + height);

        byte[] resizedImageBytes;
        if (width == 0 || height == 0) {
            resizedImageBytes = multipartFile.getBytes();
        } else {
            resizedImageBytes = resizeImageFast(multipartFile, width, height);
        }

        System.out.println("Image resized successfully, size: " + resizedImageBytes.length + " bytes");
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
