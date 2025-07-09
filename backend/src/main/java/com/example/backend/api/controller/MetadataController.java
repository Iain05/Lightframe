package com.example.backend.api.controller;

import com.example.backend.exception.NoMetadataEntryException;
import com.example.backend.service.MetadataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/metadata")
public class MetadataController {

    private final MetadataService metadataService;

    @Autowired
    public MetadataController(MetadataService metadataService) {
        this.metadataService = metadataService;
    }

    /**
     * Retrieves the value for a given metadata key.
     *
     * @param key the metadata key
     * @return the value associated with the key otherwise 404 Not Found if no entry exists
     */
    @GetMapping("/{key}")
    public String getMetadataValue(@PathVariable String key) {
        try {
            return metadataService.getMetadataValue(key);
        } catch (NoMetadataEntryException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }


}
