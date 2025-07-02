package com.example.backend.api.Repository;

import com.example.backend.api.model.Album;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for managing Album entities.
 */
@Repository
public interface AlbumRepository extends JpaRepository<Album, String> {
    List<Album> findAlbumsByCollection(String collection);
    Album findAlbumById(String id);
}
