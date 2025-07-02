package com.example.backend.api.Repository;

import com.example.backend.api.model.Photo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PhotoRepository extends JpaRepository<Photo, String> {
    List<Photo> findPhotosByAlbumId(String albumId);
    Photo findPhotoById(int id);
}
