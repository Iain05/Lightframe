package com.example.backend.service;

import com.example.backend.api.Repository.AlbumRepository;
import com.example.backend.api.Repository.PhotoRepository;
import com.example.backend.api.model.Album;
import com.example.backend.api.model.AlbumImages;
import com.example.backend.api.model.Photo;
import com.example.backend.exception.AlbumNotFoundException;
import com.example.backend.exception.PhotoNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class StatisticsService {
    private final PhotoRepository photoRepository;
    private final AlbumRepository albumRepository;

    public StatisticsService(PhotoRepository photoRepository, AlbumRepository albumRepository) {
        this.photoRepository = photoRepository;
        this.albumRepository = albumRepository;
    }

    public void downloadPhoto(int id) throws PhotoNotFoundException {
        Photo photo = photoRepository.findPhotoById(id);
        if (photo == null) throw new PhotoNotFoundException("Photo with id " + id + " not found");
        photo.incrementDownloads();
        photoRepository.save(photo);
    }

    public void viewAlbum(String albumId) throws AlbumNotFoundException {
        Album album = albumRepository.findAlbumById(albumId);
        if (album == null) throw new AlbumNotFoundException("Album with id " + albumId + "not found");
        album.incrementViews();
        albumRepository.save(album);
    }
}
