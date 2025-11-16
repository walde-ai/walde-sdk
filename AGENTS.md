# Walde SDK

TypeScript SDK for the Walde platform - a content management and website hosting service with AWS integration.

## Quick Start

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Development with watch mode
npm run dev

# Clean build artifacts
npm run clean
```

## Project Structure

The SDK follows clean architecture principles with clear separation of concerns:

- **Domain Layer** (`src/sdk/domain/`) - Core business logic and entities
- **Infrastructure Layer** (`src/sdk/infra/`) - External integrations and implementations
- **Standard Library** (`src/std/`) - Rust-inspired utilities for type-safe error handling

## Key Features

### Content Management
- Create and manage website content with versioning
- Parse markdown files with frontmatter
- Push content to Walde platform

### Site Management
- Create and configure websites
- Manage DNS entries and SSL certificates
- Upload UI assets to S3

### Authentication & Configuration
- AWS Cognito integration for authentication
- Flexible configuration management (file-based, static, or environment)
- Token refresh and credential management

### Type Safety
- Result<T, E> pattern for explicit error handling
- Option<T> for null-safe operations
- Future<T, P> for fluent API chaining

## Architecture Patterns

### Clean Architecture
- **Entities**: Core business objects (Site, Content, etc.)
- **Use Cases**: Application business rules (CreateSite, PushContent, etc.)
- **Interface Adapters**: Controllers, presenters, and gateways
- **Frameworks & Drivers**: AWS SDK, file system, HTTP clients

### Dependency Inversion
- Domain layer defines interfaces (ports)
- Infrastructure layer implements interfaces (adapters)
- Factories handle dependency injection

### Future Pattern
Enables fluent API design with lazy evaluation:

```typescript
const result = await walde
  .site('example.com')
  .content('blog-post')
  .push(contentData)
  .resolve();
```

## Development Guidelines

### Error Handling
Use Result<T, E> pattern instead of throwing exceptions:

```typescript
function divide(a: number, b: number): Result<number, string> {
  if (b === 0) return err('Division by zero');
  return ok(a / b);
}
```

### Configuration
Support multiple configuration sources through factory pattern:
- File-based configuration
- Environment variables
- Static configuration objects

### Testing
- Domain logic is framework-independent and easily testable
- Use dependency injection for external dependencies
- Mock infrastructure adapters for unit tests

## Key Dependencies

- **AWS SDK**: S3 and Cognito integration
- **Amazon Cognito Identity JS**: Authentication flows
- **Gray Matter**: Markdown frontmatter parsing
- **TypeScript**: Type safety and modern JavaScript features

## Entry Points

- `MakeWalde(config)` - Frontend SDK for content operations
- `MakeWaldeAdmin(config)` - Admin SDK with full platform access
