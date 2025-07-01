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
import java.util.Date;

public class ImageMetadataUtil {

    public static class ImageInfo {
        public final int width;
        public final int height;
        public final Date captureDate;

        public ImageInfo(int width, int height, Date captureDate) {
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

            return new ImageInfo(width, height, captureDate);
        } catch (IOException | ImageProcessingException | MetadataException e) {
            throw new ImageDataException(e);
        }
    }
}
