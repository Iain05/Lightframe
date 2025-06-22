package com.example.backend.api.Repository;

import com.example.backend.api.model.Album;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Repository interface for managing Album entities.
 */
public interface AlbumRepository extends JpaRepository<Album, String> {
    List<Album> findAlbumsByCollection(String collection);
    Album findAlbumById(String id);
}
