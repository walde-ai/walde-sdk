# S3Client Dependency Injection Refactoring

## Current Status
AwsS3FilesRepo currently hardcodes the creation of S3Client instances inside its uploadFile method. Each time a file is uploaded, it creates a new S3Client using the AWS SDK directly with credentials passed from the UiUploadCredentials parameter. This violates dependency inversion principles because the repository depends directly on the concrete AWS SDK S3Client class rather than an abstraction.

## Problem
The hardcoded S3Client creation makes the AwsS3FilesRepo impossible to unit test without making actual AWS calls. It also couples the repository tightly to the AWS SDK implementation, preventing substitution of alternative S3-compatible clients or mock implementations for testing.

## Solution
Create an S3ClientFactory interface with a createS3Client method that accepts UiUploadCredentials and returns a configured S3Client. Inject this factory into AwsS3FilesRepo through its constructor. The repository will call the factory method with runtime credentials for each upload operation.

## Implementation Approach
Create S3ClientFactory interface in domain ports with createS3Client method. Implement AWS version in infrastructure that creates S3Client with provided credentials. Modify AwsS3FilesRepo constructor to accept S3ClientFactory. Update uploadFile method to call factory.createS3Client instead of hardcoded new S3Client. Update DefaultS3FilesRepoFactory to accept and pass S3ClientFactory. Update WaldeAdminFactory to create AWS S3ClientFactory and inject it. Extend WaldeAdminConfig to optionally accept custom S3ClientFactory, defaulting to AWS implementation.

## Mock Implementation Requirements
Create S3MockClient class in src/sdk/dev that extends or implements the same interface as AWS SDK S3Client. The mock client must override the send() method to intercept PutObjectCommand and make HTTP requests to the writer-api mock server.

The mock server enforces authentication through:
- X-Amz-Security-Token header containing session token from UiUploadCredentials
- Session token must exist in STS state and not be expired
- Credentials must have associated IAM role with S3 policies
- Role must have inline policies containing 'S3' or 's3' in policy name
- Bucket must exist in S3 state

S3MockClient must:
- Accept endpoint parameter in constructor (required, no default)
- Implement send() method that handles PutObjectCommand by converting to HTTP PUT
- Extract bucket, key, body, and ContentType from PutObjectCommand
- Set X-Amz-Security-Token header with sessionToken from credentials
- Make PUT request to {endpoint}/{bucket}/{key} format
- Handle 403 responses as authentication/authorization failures
- Handle 200 responses as successful uploads
- Throw compatible errors that match AWS SDK error format
- Maintain same async interface as real S3Client

S3MockClientFactory creates S3MockClient instances with required endpoint parameter and credentials from UiUploadCredentials. Both must be exported for user injection into WaldeAdminConfig. Users must provide endpoint explicitly when using mock implementations.

## Success Criteria
Implementation complete when all criteria met:

**Dependency Injection:**
- AwsS3FilesRepo accepts S3ClientFactory in constructor instead of hardcoding S3Client creation
- S3ClientFactory interface defined in domain ports with createS3Client method accepting UiUploadCredentials
- AWS S3ClientFactory implementation creates real S3Client with provided credentials
- DefaultS3FilesRepoFactory accepts and passes S3ClientFactory to AwsS3FilesRepo
- WaldeAdminFactory creates AWS S3ClientFactory and injects through dependency chain
- WaldeAdminConfig accepts optional s3ClientFactory parameter, defaults to AWS implementation

**Mock Implementation:**
- S3MockClient successfully uploads file with valid credentials and returns without error
- S3MockClient throws authentication error when invalid session token provided
- S3MockClient throws authorization error when credentials lack S3 policies
- S3MockClientFactory exported and usable in WaldeAdminConfig

**Integration:**
- AwsS3FilesRepo works identically with S3MockClientFactory and real AWS S3ClientFactory
- Mock and real implementations produce same success/error behavior patterns
- Unit tests can inject mock S3ClientFactory without AWS dependencies
- Users can configure WaldeAdmin with custom S3ClientFactory for testing

## Testing Benefits
Unit tests can inject mock S3Client constructors that return test doubles instead of real AWS clients. Integration tests can verify the full dependency chain works with the real AWS SDK. The repository logic becomes testable in isolation from AWS infrastructure. Users can test against local mock S3 server using provided mock implementations.
