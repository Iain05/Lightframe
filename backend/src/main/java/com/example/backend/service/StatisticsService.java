package com.example.backend.service;

import com.example.backend.api.Repository.AlbumRepository;
import com.example.backend.api.Repository.PhotoRepository;
import com.example.backend.api.model.Album;
import com.example.backend.api.model.AlbumImages;
import com.example.backend.api.model.Photo;
import com.example.backend.exception.AlbumNotFoundException;
import com.example.backend.exception.DeletePhotoException;
import com.example.backend.exception.PhotoNotFoundException;
import jakarta.transaction.Transactional;
import org.hibernate.sql.Delete;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class StatisticsService {
    private final PhotoRepository photoRepository;

    public StatisticsService(PhotoRepository photoRepository) {
        this.photoRepository = photoRepository;
    }

    public void downloadPhoto(int id) throws PhotoNotFoundException {
        Photo photo = photoRepository.findPhotoById(id);
        if (photo == null) throw new PhotoNotFoundException("Photo with id " + id + " not found");
        photo.incrementDownloads();
        photoRepository.save(photo);
    }
}
