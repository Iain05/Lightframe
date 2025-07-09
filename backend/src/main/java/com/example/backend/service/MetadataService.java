package com.example.backend.service;

import com.example.backend.api.Repository.MetadataRepository;
import com.example.backend.api.model.Metadata;
import com.example.backend.exception.NoMetadataEntryException;
import org.springframework.stereotype.Service;

@Service
public class MetadataService {
    private final MetadataRepository metadataRepository;

    public MetadataService(MetadataRepository metadataRepository) {
        this.metadataRepository = metadataRepository;
    }

    /**
     * Retrieves the value for a given metadata key.
     *
     * @param key the metadata key
     * @return the value associated with the key
     * @throws NoMetadataEntryException if no entry is found for the given key
     */
    public String getMetadataValue(String key) throws NoMetadataEntryException {
        Metadata metadata = metadataRepository.findByKey(key);
        if (metadata == null) {
            throw new NoMetadataEntryException("No metadata entry found for key: " + key);
        }
        return metadata.getValue();
    }
}
