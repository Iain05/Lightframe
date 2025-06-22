package com.example.backend.api.Repository;

import com.example.backend.api.model.Album;
import com.example.backend.api.model.AlbumDB;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlbumRepository extends JpaRepository<AlbumDB, String> {
    List<AlbumDB> findAlbumsByCollection(String collection);
}
