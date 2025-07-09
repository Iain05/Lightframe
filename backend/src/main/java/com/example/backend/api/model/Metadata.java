package com.example.backend.api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "metadata")
public class Metadata {

    @Id
    @Column(name = "key")
    private String key;

    @Column(name = "value")
    private String value;

    public Metadata(String key, String value) {
        this.key = key;
        this.value = value;
    }

    public Metadata() {}

    public String getKey() {
        return key;
    }

    public String getValue() {
        return value;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
