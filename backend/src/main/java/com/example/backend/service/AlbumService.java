package com.example.backend.service;

import com.example.backend.api.Repository.AlbumRepository;
import com.example.backend.api.Repository.PhotoRepository;
import com.example.backend.api.model.Album;
import com.example.backend.api.model.AlbumImages;
import com.example.backend.api.model.Photo;
import com.example.backend.exception.AlbumNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlbumService {

    private final PhotoRepository photoRepository;
    private final AlbumRepository albumRepository;

    public AlbumService(PhotoRepository photoRepository, AlbumRepository albumRepository) {
        this.photoRepository = photoRepository;
        this.albumRepository = albumRepository;
    }

    /**
     * @param id the unique identifier of the album to get
     * @return an Album with all its images
     * @throws AlbumNotFoundException if the album doesn't exist
     */
    public AlbumImages getAlbum(String id) throws AlbumNotFoundException {
        Album album = albumRepository.findAlbumById(id);
        List<Photo> photosInAlbum = photoRepository.findPhotosByAlbumId(id);
        if (album == null) {
            throw new AlbumNotFoundException("Album with id " + id + " not found");
        }
        return new AlbumImages(album, photosInAlbum);
    }

    public String createAlbum(String name, String description, String collection, boolean isPublic) {
        Album album = new Album(name, description, collection, isPublic);
        albumRepository.save(album);
        return album.getId();
    }
}
