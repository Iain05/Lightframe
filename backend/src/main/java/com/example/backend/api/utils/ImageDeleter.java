package com.example.backend.api.utils;

import com.oracle.bmc.ConfigFileReader;
import com.oracle.bmc.Region;
import com.oracle.bmc.auth.AuthenticationDetailsProvider;
import com.oracle.bmc.auth.ConfigFileAuthenticationDetailsProvider;
import com.oracle.bmc.auth.InstancePrincipalsAuthenticationDetailsProvider;
import com.oracle.bmc.objectstorage.ObjectStorage;
import com.oracle.bmc.objectstorage.ObjectStorageClient;
import com.oracle.bmc.objectstorage.requests.DeleteObjectRequest;
import com.oracle.bmc.objectstorage.responses.DeleteObjectResponse;
import com.example.backend.exception.DeletePhotoException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.io.IOException;

@Component
public class ImageDeleter {

    @Value("${oci.bucket.name}")
    private String bucketName;

    @Value("${oci.bucket.namespace}")
    private String namespaceName;

    @Value("${oci.region:us-phoenix-1}")
    private String region;

    @Value("${oci.config.profile:DEFAULT}")
    private String configProfile;

    @Value("${oci.auth.method:config_file}")
    private String authMethod;

    private ObjectStorage objectStorageClient;

    @PostConstruct
    private void initializeClient() {
        try {
            AuthenticationDetailsProvider provider = createAuthenticationProvider();
            objectStorageClient = ObjectStorageClient.builder()
                    .region(Region.fromRegionId(region))
                    .build(provider);
            
            System.out.println("OCI ObjectStorage client initialized successfully");
            System.out.println("Bucket: " + bucketName);
            System.out.println("Namespace: " + namespaceName);
            System.out.println("Region: " + region);
        } catch (Exception e) {
            System.err.println("Failed to initialize OCI ObjectStorage client: " + e.getMessage());
            System.err.println("Photo deletion functionality will be disabled. Make sure OCI is properly configured.");
            // Don't throw exception to allow app to start without OCI
            objectStorageClient = null;
        }
    }

    private AuthenticationDetailsProvider createAuthenticationProvider() throws IOException {
        // For now, only support config file authentication
        // Instance principals can be added later if needed
        try {
            return new ConfigFileAuthenticationDetailsProvider(configProfile);
        } catch (Exception e) {
            throw new IOException("Failed to create config file authentication provider. " +
                    "Make sure you have OCI CLI configured with 'oci setup config'. Error: " + e.getMessage(), e);
        }
    }

    /**
     * Delete an object from OCI Object Storage
     *
     * @param objectName The name/key of the object to delete
     * @throws DeletePhotoException if deletion fails
     */
    public void deleteObject(String objectName) throws DeletePhotoException {
        if (objectStorageClient == null) {
            throw new DeletePhotoException("OCI ObjectStorage client is not initialized. Photo deletion is disabled.");
        }
        
        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .namespaceName(namespaceName)
                    .bucketName(bucketName)
                    .objectName(objectName)
                    .build();

            DeleteObjectResponse response = objectStorageClient.deleteObject(deleteObjectRequest);
        } catch (Exception e) {
            System.err.println("Error deleting object " + objectName + ": " + e.getMessage());
            throw new DeletePhotoException("Failed to delete object from OCI bucket: " + e.getMessage());
        }
    }

    /**
     * Delete multiple objects (different sizes) for a single photo
     *
     * @param photoPath The base path of the photo (without size prefix)
     * @throws DeletePhotoException if any deletion fails
     */
    public void deletePhotoAllSizes(String photoPath) throws DeletePhotoException {
        String[] sizes = {"small/", "medium/", "large/"};
        
        for (String size : sizes) {
            try {
                deleteObject(size + photoPath);
            } catch (DeletePhotoException e) {
                // Log the error but continue with other sizes
                System.err.println("Failed to delete " + size + photoPath + ": " + e.getMessage());
                // You might want to decide whether to throw here or continue
                // For now, we'll continue and delete what we can
            }
        }
    }

    @PreDestroy
    private void cleanup() {
        if (objectStorageClient != null) {
            try {
                objectStorageClient.close();
                System.out.println("OCI ObjectStorage client closed successfully");
            } catch (Exception e) {
                System.err.println("Error closing OCI ObjectStorage client: " + e.getMessage());
            }
        }
    }
}
