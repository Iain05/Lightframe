# Oracle Cloud Infrastructure (OCI) SDK Setup Guide

## 1. Add OCI SDK Dependencies (Already Done)

Your `build.gradle` already includes the OCI SDK dependencies:
```gradle
implementation 'com.oracle.oci.sdk:oci-java-sdk-objectstorage:3.67.3'
implementation 'com.oracle.oci.sdk:oci-java-sdk-common-httpclient-jersey:3.67.3'
```

**Note:** The HTTP client dependency (`oci-java-sdk-common-httpclient-jersey`) is required for the OCI SDK to function properly. Without it, you'll get the error: "No http provider available".

## 2. OCI Authentication Setup

You need to set up OCI authentication. There are several ways to do this:

### Option A: Config File Authentication (Recommended for Development)

1. Install the OCI CLI and configure it:
   ```bash
   # Install OCI CLI (if not already installed)
   # On Windows, download from: https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/cliinstall.htm
   
   # Configure OCI CLI
   oci setup config
   ```

2. This will create a config file at `~/.oci/config` with your credentials:
   ```ini
   [DEFAULT]
   user=ocid1.user.oc1..your_user_ocid
   fingerprint=your_key_fingerprint
   key_file=~/.oci/oci_api_key.pem
   tenancy=ocid1.tenancy.oc1..your_tenancy_ocid
   region=us-ashburn-1
   ```

### Option B: Instance Principal Authentication (For Production on OCI Compute)

If running on OCI Compute instance, you can use Instance Principal authentication.
Update the ImageUploader constructor to use:
```java
AuthenticationDetailsProvider provider = InstancePrincipalsAuthenticationDetailsProvider.builder().build();
```

### Option C: Environment Variables

Set these environment variables:
- `OCI_CLI_USER`
- `OCI_CLI_FINGERPRINT` 
- `OCI_CLI_KEY_FILE`
- `OCI_CLI_TENANCY`
- `OCI_CLI_REGION`

## 3. Environment Variables Required

Add these to your `.env` file:
```env
# Existing variables...
BUCKET_PREAUTH_URL=https://your-namespace.compat.objectstorage.region.oraclecloud.com/p/your-preauth-token/n/your-namespace/b/your-bucket/o/

# New OCI variables
OCI_BUCKET_NAME=your-bucket-name
OCI_NAMESPACE_NAME=your-namespace-name
```

## 4. Usage Examples

### Uploading an Image (Uses Pre-authorized URL)
```java
ImageUploader uploader = new ImageUploader(preAuthUrl, bucketName, namespaceName);
String key = uploader.resizeAndUpload(multipartFile, "photos/image1.jpg", 1920, 1080);
```

### Deleting an Image (Uses OCI SDK)
```java
uploader.deleteObject("photos/image1.jpg");
```

### Check if OCI Client is Ready
```java
if (uploader.isOciClientReady()) {
    uploader.deleteObject("photos/old-image.jpg");
} else {
    System.err.println("Cannot delete - OCI client not initialized");
}
```

## 5. Common Issues and Troubleshooting

### Error: "OCI client is not initialized"
- Ensure your OCI config file exists and is properly formatted
- Check that the config file path is correct (`~/.oci/config`)
- Verify your API key file exists and has correct permissions

### Error: "BmcException: Authentication failed"
- Check your user OCID, tenancy OCID, and fingerprint
- Ensure your API key is properly uploaded to your OCI user
- Verify your region is correct

### Error: "NotAuthenticated"
- Check your API key file permissions (should be readable only by you)
- Ensure the key file path in config is correct

### Testing Your Setup
You can test the OCI configuration with the OCI CLI:
```bash
oci os bucket list --compartment-id your-compartment-ocid
```

## 6. Security Best Practices

1. **Never commit your OCI config file or private keys to version control**
2. **Use environment-specific configurations**
3. **Rotate your API keys regularly**
4. **Use minimal required permissions for your OCI user**
5. **Consider using Instance Principal authentication in production**

## 7. Required OCI Policies

Your OCI user needs these policies to manage objects:
```
Allow user your-username to manage objects in compartment your-compartment
```

Or more specific permissions:
```
Allow user your-username to use object-family in compartment your-compartment
```
