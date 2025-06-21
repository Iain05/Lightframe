package com.example.backend.service;

import com.example.backend.api.model.Album;
import com.example.backend.api.model.Photo;
import com.example.backend.exception.AlbumNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDate;
import java.util.NoSuchElementException;

@Service
public class AlbumService {

    private List<Album> albums;

    public AlbumService() {
        albums = new ArrayList<>();
        List<Photo> photos = new ArrayList<>();
        Photo photo1 = new Photo("./photos/image0.jpg", 720, 1080, 0, LocalDateTime.now());
        Photo photo2 = new Photo("./photos/image1.jpg", 864, 1080, 1, LocalDateTime.now());
        Photo photo3 = new Photo("./photos/image2.jpg", 1620, 1080, 2, LocalDateTime.now());
        Photo photo4 = new Photo("./photos/image3.jpg", 1620, 1080, 3, LocalDateTime.now());
        photos.add(photo1);
        photos.add(photo2);
        photos.add(photo3);
        photos.add(photo4);

        Album album1 = new Album("portfolio", LocalDate.now(), photos);

        photos.removeAll(photos);
        Photo photo5 = new Photo("./photos/image4.jpg", 1920, 709, 4, LocalDateTime.now());
        Photo photo6 = new Photo("./photos/image5.jpg", 1620, 1080, 5, LocalDateTime.now());
        Photo photo7 = new Photo("./photos/image6.jpg", 1620, 1080, 6, LocalDateTime.now());
        photos.add(photo5);
        photos.add(photo6);
        photos.add(photo7);
        Album album2 = new Album("album2", LocalDate.now(), photos);

        albums.add(album1);
        albums.add(album2);
    }

    /**
     * @param id the unique identifier of the album to get
     * @return an Album with all its images
     * @throws AlbumNotFoundException if the album doesn't exist
     */
    public Album getAlbum(String id) throws AlbumNotFoundException {
        Album album = albums.stream().filter(a -> a.getId().equals(id)).findFirst().orElse(null);
        if (album == null) {
            throw new AlbumNotFoundException("Album with name " + id + " not found");
        }
        return album;
    }
}
