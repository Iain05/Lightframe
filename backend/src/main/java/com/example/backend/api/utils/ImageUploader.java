package com.example.backend.api.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import javax.imageio.ImageIO;

@Component
public class ImageUploader {

    private final S3Client s3Client;

    @Value("${r2.bucket.name}")
    private String bucketName;

    public ImageUploader(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    private byte[] resizeImageFast(MultipartFile multipartFile, int width, int height) throws IOException {
        BufferedImage originalImage = ImageIO.read(multipartFile.getInputStream());

        int originalWidth = originalImage.getWidth();
        int originalHeight = originalImage.getHeight();
        double aspectRatio = (double) originalWidth / originalHeight;

        if (width == 0) {
            width = (int) (height * aspectRatio);
        } else if (height == 0) {
            height = (int) (width / aspectRatio);
        } else {
            double targetAspectRatio = (double) width / height;
            if (aspectRatio > targetAspectRatio) {
                height = (int) (width / aspectRatio);
            } else {
                width = (int) (height * aspectRatio);
            }
        }

        BufferedImage resizedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = resizedImage.createGraphics();
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
     * Resize the image and upload it to Cloudflare R2. If width or height is 0,
     * the original image is uploaded without resizing. The original aspect ratio
     * is maintained during resizing.
     *
     * @param multipartFile The image file to resize and upload.
     * @param key           The key under which the image will be stored in the bucket.
     * @param width         The desired width of the resized image (0 = original).
     * @param height        The desired height of the resized image (0 = original).
     * @return The key of the uploaded image.
     * @throws IOException If an error occurs during resizing or uploading.
     */
    public String resizeAndUpload(MultipartFile multipartFile, String key, int width, int height) throws IOException {
        byte[] imageBytes;
        if (width == 0 || height == 0) {
            imageBytes = multipartFile.getBytes();
        } else {
            imageBytes = resizeImageFast(multipartFile, width, height);
        }

        try {
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType("image/jpeg")
                    .contentLength((long) imageBytes.length)
                    .build();
            s3Client.putObject(request, RequestBody.fromBytes(imageBytes));
        } catch (S3Exception e) {
            throw new IOException("Failed to upload image to R2 (key=" + key + "): " + e.getMessage(), e);
        }

        return key;
    }
}
