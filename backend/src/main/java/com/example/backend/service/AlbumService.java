package com.example.backend.service;

import com.example.backend.api.Repository.AlbumRepository;
import com.example.backend.api.Repository.PhotoRepository;
import com.example.backend.api.model.Album;
import com.example.backend.api.model.AlbumImages;
import com.example.backend.api.model.Photo;
import com.example.backend.exception.AlbumNotFoundException;
import com.example.backend.exception.PhotoNotFoundException;
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

        if (album == null) throw new AlbumNotFoundException("Album with id " + id + " not found");

        return new AlbumImages(album, photosInAlbum);
    }

    /**
     * Create a new album with the given parameters.
     * @param name the name of the album
     * @param description the description of the album
     * @param collection the collection the album belongs to
     * @param isPublic whether the album is public or private
     * @return the unique identifier of the created album
     */
    public String createAlbum(String name, String description, String collection, boolean isPublic) {
        Album album = new Album(name, description, collection, isPublic);
        albumRepository.save(album);
        return album.getId();
    }

    /**
     * Delete an album by its unique identifier.
     * @param id the unique identifier of the album to delete
     * @throws AlbumNotFoundException
     */
    public void deleteAlbum(String id) throws AlbumNotFoundException {
        Album album = albumRepository.findAlbumById(id);

        if (album == null) throw new AlbumNotFoundException("Album with id " + id + " not found");

        albumRepository.delete(album);
    }

    /**
     * Update an album's public status, name, or description.
     * @param id the unique identifier of the album to update
     * @param name the new name of the album, can be null to keep the same
     * @param description the new description of the album, can be null to keep the same
     * @param isPublic the new public status of the album
     */
    public void updateAlbum(String id, String name, String description, boolean isPublic) throws AlbumNotFoundException {
        Album album = albumRepository.findAlbumById(id);
        if (album == null) throw new AlbumNotFoundException("Album with id " + id + " not found");

        if (name != null) album.setName(name);

        if (description != null) album.setDescription(description);

        album.setPublic(isPublic);

        albumRepository.save(album);
    }

    /**
     * Set the cover image of an album.
     * @param albumId the unique identifier of the album
     * @param imageId the unique identifier of the photo to set as cover image
     * @throws AlbumNotFoundException if the album doesn't exist
     * @throws PhotoNotFoundException if the photo doesn't exist
     */
    public void setCoverImage(String albumId, int imageId) throws AlbumNotFoundException, PhotoNotFoundException {
        Album album = albumRepository.findAlbumById(albumId);
        if (album == null) throw new AlbumNotFoundException("Album with id " + albumId + " not found");

        Photo photo = photoRepository.findPhotoById(imageId);
        if (photo == null) throw new PhotoNotFoundException("Photo with id " + imageId + " not found");

        album.setCoverImage(photo.getUrl());
        albumRepository.save(album);
    }
}
