package com.example.backend.api.controller;


import com.example.backend.api.model.AlbumParameters;
import com.example.backend.api.model.AlbumImages;
import com.example.backend.exception.AlbumNotFoundException;
import com.example.backend.service.AlbumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

//@CrossOrigin(origins = {"http://localhost:3000", "http://localhost"})
@RestController
@RequestMapping("/api/album")
public class AlbumController {

    private final AlbumService albumService;

    @Autowired
    public AlbumController(AlbumService albumService) {
        this.albumService = albumService;
    }

    /**
     * Get a photo album formatted as
     * <pre><code>
     *     {
     *         "name": String,
     *         "dateCreated": String,
     *         "id": String,
     *         "coverImage": String,
     *         "numPhotos": int,
     *         "photos": [
     *             {
     *                  "url": "example/image.jpg",
     *                  "width": int,
     *                  "height": int,
     *                  "index": int,
     *                  "dateTaken": String,
     *             }
     *         ]
     *     }
     * </code></pre>
     * @param id is the unique identifier of the album, should also be the url
     * @return An album as formatted above, http not found if the album doesn't exist
     */
    @GetMapping("")
    public AlbumImages getAlbum(@RequestParam String id) {
        try {
            return albumService.getAlbum(id);
        } catch (AlbumNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    /**
     * Create a new album with the given parameters.
     * @param albumParameters the parameters for the album, including name, description, collection,
     *                        public status, and event date
     * @return the unique identifier of the created album
     */
    @PostMapping("create")
    public String createAlbum(@RequestBody AlbumParameters albumParameters) {
        try {
            System.out.println("Creating album with parameters: " + albumParameters);
            return albumService.createAlbum(
                albumParameters.name(),
                albumParameters.description(),
                albumParameters.collection(),
                albumParameters.isPublic(),
                albumParameters.eventDate()
            );
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    /**
     * Delete an album by its unique identifier.
     * @param id the unique identifier of the album to delete
     * @throws ResponseStatusException if the album doesn't exist or if there is an internal server error
     */
    @DeleteMapping("delete")
    public void deleteAlbum(@RequestParam String id) {
        try {
            albumService.deleteAlbum(id);
        } catch (AlbumNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    /**
     * Update an album's public status, name, description, and event date.
     * @param albumParameters the parameters for the album update
     * @param id the unique identifier of the album to update
     * @throws ResponseStatusException if the album doesn't exist or if there is an internal server error
     */
    @PutMapping("update")
    public void updateAlbum(@RequestBody AlbumParameters albumParameters, @RequestParam String id) {
        try {
            albumService.updateAlbum(
                id,
                albumParameters.name(),
                albumParameters.description(),
                albumParameters.isPublic(),
                albumParameters.eventDate()
            );
        } catch (AlbumNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    /**
     * Set the cover image of an album.
     * @param albumId the unique identifier of the album
     * @param photoId the unique identifier of the photo to set as cover image
     */
    @PostMapping("set-cover")
    public void setCoverImage(@RequestParam String albumId, @RequestParam int photoId) {
        try {
            albumService.setCoverImage(albumId, photoId);
        } catch (AlbumNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
}
