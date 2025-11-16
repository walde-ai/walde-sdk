# Walde SDK Domain Knowledge Base

## Content Management Domain

### Content Structure
- **Content**: Core entity representing website content with versioning
- **ContentPart**: Modular content components (markdown, key-value, string)
- **FrontendContent**: Client-facing content representation
- **ContentState**: Lifecycle states (draft, published, archived)

### Content Types
- **MarkdownPart**: Rich text content with frontmatter support
- **KeyValuePart**: Structured data as key-value pairs
- **StringPart**: Simple text content
- **FormatPart**: Content formatting specifications

### Content Operations
- **Parse**: Extract content from markdown files with frontmatter
- **Push**: Upload content to platform with versioning
- **List**: Retrieve content collections with filtering
- **Version**: Manage content versions and history

## Site Management Domain

### Site Entity
- **Site**: Website configuration with DNS and state management
- **SiteState**: Operational states (UPDATED, UPDATE_REQUESTED)
- **DnsEntry**: DNS configuration records

### Site Operations
- **Create**: Initialize new website with configuration
- **Update**: Modify site settings and DNS
- **Associate Certificates**: SSL certificate management
- **Deploy**: Publish site changes

## Authentication & Authorization

### Cognito Integration
- **User Pool**: AWS Cognito user management
- **Client ID**: Application identifier for authentication
- **Token Management**: JWT token handling and refresh
- **Credentials**: AWS credentials for service access

### Configuration Management
- **WaldeAdminConfig**: Administrative configuration
- **WorkspaceConfig**: Local workspace settings
- **CredentialsProvider**: Abstraction for credential sources

## File Management

### Upload Operations
- **UI Upload**: Static asset deployment to S3
- **Content Upload**: Structured content to platform
- **Progress Tracking**: Upload progress callbacks
- **Batch Operations**: Multiple file handling

### File Types
- **Static Assets**: CSS, JS, images for UI
- **Content Files**: Markdown with frontmatter
- **Configuration Files**: JSON/YAML settings

## AWS Services Integration

### S3 Integration
- **Bucket Management**: File storage and retrieval
- **Upload Credentials**: Temporary credentials for uploads
- **File Organization**: Structured file paths

### API Gateway
- **Backend Communication**: RESTful API interactions
- **Authentication**: Token-based API access
- **Error Handling**: HTTP status code mapping

## Error Handling Domain

### Error Categories
- **WaldeUserError**: User input or configuration errors
- **WaldeSystemError**: Internal system failures
- **WaldeNetworkError**: Network communication issues
- **WaldeAuthenticationError**: Authentication failures
- **WaldeValidationError**: Data validation failures

### Error Patterns
- **Result<T, E>**: Type-safe error handling
- **Explicit Errors**: No silent failures
- **Error Propagation**: Structured error bubbling
- **Recovery Strategies**: Graceful degradation

## Business Rules

### Content Rules
- Content must have unique keys within a site
- Markdown content requires valid frontmatter
- Content versions are immutable once published
- Content state transitions follow defined workflow

### Site Rules
- Domain names must be unique across platform
- DNS entries require proper validation
- SSL certificates must be associated before deployment
- Site updates require proper authorization

### Authentication Rules
- Tokens must be refreshed before expiration
- Credentials must be validated before use
- User permissions determine available operations
- Session management follows security best practices

## Platform Constraints

### Technical Limits
- File size limits for uploads
- API rate limiting considerations
- Concurrent operation limits
- Storage quotas and billing

### Business Constraints
- User permission levels
- Feature availability by plan
- Geographic restrictions
- Compliance requirements
