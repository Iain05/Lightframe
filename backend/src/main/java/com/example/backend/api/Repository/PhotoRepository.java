package com.example.backend.api.Repository;

import com.example.backend.api.model.Photo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, String> {
    List<Photo> findPhotosByAlbumId(String albumId);
    @Query("SELECT p.id FROM Photo p WHERE p.albumId = ?1")
    List<Integer> findPhotoIdsByAlbumId(String albumId);
    Photo findPhotoById(int id);
}
