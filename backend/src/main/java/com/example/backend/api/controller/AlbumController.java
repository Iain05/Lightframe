package com.example.backend.api.controller;


import com.example.backend.api.model.Album;
import com.example.backend.service.AlbumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class AlbumController {

    private AlbumService albumService;

    @Autowired
    public AlbumController(AlbumService albumService) {
        this.albumService = albumService;
    }

    @GetMapping("/api/album")
    public Album getAlbum(@RequestParam String name) {
        Album album;
        try {
            return albumService.getAlbum(name);
        } catch (Exception e) {
            return null;
        }
    }
}
