package com.example.backend.api.controller;


import com.example.backend.api.model.Collection;
import com.example.backend.exception.CollectionNotFoundException;
import com.example.backend.service.CollectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

//@CrossOrigin(origins = {"http://localhost:3000", "http://localhost"})
@RestController
public class CollectionController {

    private final CollectionService collectionService;

    @Autowired
    public CollectionController(CollectionService collectionService) {
        this.collectionService = collectionService;
    }

    /**
     *
     * Get an album collection formatted as
     * <pre><code>
     *     {
     *         "id": String,
     *         "count": int,
     *         "albums": [
     *             {
     *                  "id": String,
     *                  "index": int,
     *                  "name": String,
     *                  "description": String,
     *                  "coverImage": String,
     *                  "dateCreated": String,
     *                  "numPhotos": int,
     *                  "collection": String,
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
            Collection collection = collectionService.getCollection(id);
            return collection;
        } catch (CollectionNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
}
