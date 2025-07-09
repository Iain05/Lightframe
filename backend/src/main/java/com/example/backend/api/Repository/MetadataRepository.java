package com.example.backend.api.Repository;

import com.example.backend.api.model.Metadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MetadataRepository extends JpaRepository<Metadata, String> {
    Metadata findByKey(String key);
}
