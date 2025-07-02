package com.example.backend.api.utils;

import com.drew.imaging.ImageMetadataReader;
import com.drew.imaging.ImageProcessingException;
import com.drew.metadata.Metadata;
import com.drew.metadata.MetadataException;
import com.drew.metadata.exif.ExifSubIFDDirectory;
import com.drew.metadata.jpeg.JpegDirectory;
import com.example.backend.exception.ImageDataException;
import org.springframework.web.multipart.MultipartFile;

import java.awt.*;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

public class ImageMetadataUtil {

    public static class ImageInfo {
        public final int width;
        public final int height;
        public final LocalDateTime captureDate;

        public ImageInfo(int width, int height, LocalDateTime captureDate) {
            this.width = width;
            this.height = height;
            this.captureDate = captureDate;
        }
    }

    public static ImageInfo extractImageInfo(MultipartFile multipartFile) throws ImageDataException {
        try (InputStream inputStream = multipartFile.getInputStream()) {
            Metadata metadata = ImageMetadataReader.readMetadata(inputStream);

            // Get JPEG width/height
            JpegDirectory jpegDirectory = metadata.getFirstDirectoryOfType(JpegDirectory.class);
            int width = jpegDirectory != null ? jpegDirectory.getImageWidth() : -1;
            int height = jpegDirectory != null ? jpegDirectory.getImageHeight() : -1;

            // Get capture date
            ExifSubIFDDirectory exifDirectory = metadata.getFirstDirectoryOfType(ExifSubIFDDirectory.class);
            Date captureDate = exifDirectory != null ? exifDirectory.getDateOriginal() : null;
            LocalDateTime ldt = captureDate != null ? 
                LocalDateTime.ofInstant(captureDate.toInstant(), ZoneId.systemDefault()) : 
                LocalDateTime.now();

            return new ImageInfo(width, height, ldt);
        } catch (IOException | ImageProcessingException | MetadataException e) {
            throw new ImageDataException(e);
        }
    }
}
