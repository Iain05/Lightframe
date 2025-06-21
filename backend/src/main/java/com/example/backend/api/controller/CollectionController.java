package com.example.backend.api.controller;


import com.example.backend.api.model.AlbumImages;
import com.example.backend.api.model.Collection;
import com.example.backend.exception.AlbumNotFoundException;
import com.example.backend.exception.CollectionNotFoundException;
import com.example.backend.service.AlbumService;
import com.example.backend.service.CollectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class CollectionController {

    private CollectionService collectionService;

    @Autowired
    public CollectionController(CollectionService collectionService) {
        this.collectionService = collectionService;
    }

    /**
     * Get a photo album formatted as
     * <pre><code>
     *     {
     *         "name": String,
     *         "dateCreated": String,
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
     * @return An album as formatted above, null otherwise
     */
    @GetMapping("/api/collection")
    public Collection getCollection(@RequestParam String id) {
        try {
            return collectionService.getCollection(id);
        } catch (CollectionNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
}
