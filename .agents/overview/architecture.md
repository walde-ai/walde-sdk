# Walde SDK Architecture

## Clean Architecture Implementation

The SDK follows clean architecture principles with strict dependency inversion:

```
src/
├── sdk/                      # Main SDK implementation
│   ├── domain/              # Core business logic (innermost layer)
│   │   ├── entities/        # Business objects (Site, Content, etc.)
│   │   ├── interactors/     # Use cases (CreateSite, PushContent, etc.)
│   │   ├── errors/          # Business-specific exceptions
│   │   └── ports/           # Interface definitions
│   │       ├── in/          # Input ports (driving adapters)
│   │       └── out/         # Output ports (driven adapters)
│   ├── infra/               # Infrastructure layer (outermost)
│   │   ├── adapters/        # External service implementations
│   │   ├── factories/       # Dependency injection
│   │   ├── futures/         # Fluent API implementation
│   │   └── mappers/         # Data transformation
│   └── contracts/           # Versioned data contracts
└── std/                     # Standard library utilities
    └── domain/entities/     # Result, Option, Future types
```

## Core Design Patterns

### 1. Dependency Inversion
- Domain defines interfaces (ports)
- Infrastructure implements interfaces (adapters)
- Factories inject dependencies at runtime

### 2. Future Pattern for Fluent APIs
Enables lazy evaluation and method chaining:

```typescript
// Collects parameters through chain, executes on resolve()
const result = await walde
  .site('example.com')
  .content('blog-post')
  .push(contentData)
  .resolve();
```

### 3. Result<T, E> Pattern
Explicit error handling without exceptions:

```typescript
function apiCall(): Result<Data, ApiError> {
  try {
    const data = makeRequest();
    return ok(data);
  } catch (error) {
    return err(new ApiError(error.message));
  }
}
```

### 4. Data Versioning Pattern
All persistent contracts include versioning:

```typescript
interface ContentV1 {
  apiVersion: "2025-11-15";
  id: string;
  content: string;
}
```

## Layer Responsibilities

### Domain Layer
- **Entities**: Pure business objects with no external dependencies
- **Interactors**: Orchestrate business logic using entities and ports
- **Ports**: Define contracts for external dependencies
- **Errors**: Business-specific error types

### Infrastructure Layer
- **Adapters**: Implement domain ports (HTTP clients, file systems, AWS services)
- **Factories**: Create and wire dependencies
- **Futures**: Implement fluent API pattern
- **Mappers**: Transform between domain entities and external data formats

### Standard Library
- **Result<T, E>**: Type-safe error handling
- **Option<T>**: Null-safe value handling
- **Future<T, P>**: Lazy evaluation for fluent APIs

## Key Architectural Decisions

### 1. AWS-First Design
- Built specifically for AWS ecosystem
- Cognito for authentication
- S3 for file storage
- API Gateway for backend communication

### 2. Type Safety Over Runtime Flexibility
- Strong TypeScript typing throughout
- Compile-time error detection
- Explicit error handling patterns

### 3. Configuration Flexibility
Multiple configuration sources supported:
- File-based configuration
- Environment variables
- Static configuration objects
- Runtime configuration

### 4. Clean Separation of Concerns
- Business logic independent of frameworks
- Infrastructure details isolated in adapters
- Easy to test and maintain

## Data Flow

1. **User calls fluent API**: `walde.site('example.com').content('post')`
2. **Future collects parameters**: Builds parameter chain without execution
3. **resolve() triggers execution**: Calls appropriate interactor
4. **Interactor orchestrates**: Uses entities and calls output ports
5. **Adapters handle external calls**: HTTP, file system, AWS services
6. **Result returned**: Type-safe success or error response

## Testing Strategy

- **Domain**: Pure unit tests, no external dependencies
- **Infrastructure**: Integration tests with mocked external services
- **End-to-End**: Full workflow tests with test doubles
- **Contract**: Verify data transformation between layers
