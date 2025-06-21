package com.example.backend.service;

import com.example.backend.api.model.AlbumImages;
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

    private List<AlbumImages> albums;

    public AlbumService() {
        albums = new ArrayList<>();
        List<Photo> photos = new ArrayList<>();
        Photo photo1 = new Photo("http://localhost:3000/photos/image0.jpg", 720, 1080, 0, LocalDateTime.now());
        Photo photo2 = new Photo("http://localhost:3000/photos/image1.jpg", 864, 1080, 1, LocalDateTime.now());
        Photo photo3 = new Photo("http://localhost:3000/photos/image2.jpg", 1620, 1080, 2, LocalDateTime.now());
        Photo photo4 = new Photo("http://localhost:3000/photos/image3.jpg", 1620, 1080, 3, LocalDateTime.now());
        photos.add(photo1);
        photos.add(photo2);
        photos.add(photo3);
        photos.add(photo4);

        AlbumImages album1 = new AlbumImages("Portfolio", "portfolio", 1, photo1.getUrl(), LocalDate.now(), photos);

        photos.removeAll(photos);
        Photo photo5 = new Photo("http://localhost:3000/photos/image4.jpg", 1920, 709, 4, LocalDateTime.now());
        Photo photo6 = new Photo("http://localhost:3000/photos/image5.jpg", 1620, 1080, 5, LocalDateTime.now());
        Photo photo7 = new Photo("http://localhost:3000/photos/image6.jpg", 1620, 1080, 6, LocalDateTime.now());
        photos.add(photo5);
        photos.add(photo6);
        photos.add(photo7);
        AlbumImages album2 = new AlbumImages("album2", "album2", 2, photo5.getUrl(), LocalDate.now(), photos);

        albums.add(album1);
        albums.add(album2);
    }

    /**
     * @param id the unique identifier of the album to get
     * @return an Album with all its images
     * @throws AlbumNotFoundException if the album doesn't exist
     */
    public AlbumImages getAlbum(String id) throws AlbumNotFoundException {
        AlbumImages album = albums.stream().filter(a -> a.getId().equals(id)).findFirst().orElse(null);
        if (album == null) {
            throw new AlbumNotFoundException("Album with name " + id + " not found");
        }
        return album;
    }
}
