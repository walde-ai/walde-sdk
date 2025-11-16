# Walde SDK Standards

## TypeScript Conventions

### Naming
- **camelCase**: Variables, functions, methods
- **PascalCase**: Classes, interfaces, types, enums
- **SCREAMING_SNAKE_CASE**: Constants
- **kebab-case**: File names
- **Interface prefix**: Use 'I' only when distinguishing from concrete implementations

### Type Definitions
- Explicit types for all function parameters and return values
- Interfaces for object shapes, type aliases for union types
- Generic types for reusable components
- Property parameter syntax for class constructors

### Error Handling
- Use Result<T, E> pattern instead of throwing exceptions
- Custom error classes extending base WaldeError
- Validate inputs at function boundaries with type guards
- Never return null/undefined for error conditions

### Async Operations
- Use async/await exclusively (no .then()/.catch() chaining)
- Handle errors with try/catch around await statements
- Return Result<T, E> for operations that can fail

## Architecture Standards

### Clean Architecture Compliance
- Domain entities have no external dependencies
- Use cases orchestrate business logic through ports
- Infrastructure implements domain ports
- Dependency injection through factories

### Dependency Direction
- Inner layers never depend on outer layers
- Interfaces defined in domain, implemented in infrastructure
- Use dependency inversion principle throughout

### Error Handling Strategy
- Business errors as Result<T, E> return types
- System errors as exceptions (caught and converted to Results)
- Explicit error types for different failure modes
- No silent failures or default values

## Code Organization

### File Structure
- Single responsibility per file
- Group related types in .types.ts files
- Utility functions in .utils.ts files
- Business logic separate from infrastructure

### Import/Export Style
- Named imports/exports exclusively
- Three import groups: external libraries, internal modules, relative imports
- Separate groups with blank lines

### Function Declarations
- Arrow functions for inline callbacks and expressions
- Function declarations for top-level functions and methods
- Explicit return types for all functions

## Data Patterns

### Versioning
- All persistent contracts include apiVersion field
- Date-based version identifiers (YYYY-MM-DD format)
- Separate contract classes for each version
- DTO mappers handle version conversion

### Entity Design
- Immutable entities with readonly properties
- Constructor parameter properties for user-initializable fields
- Business logic methods on entities when appropriate
- No persistence concerns in entities

### Port Definitions
- Input ports for driving adapters (controllers)
- Output ports for driven adapters (repositories, external services)
- Clear interface segregation
- No implementation details in port definitions

## Testing Standards

### Unit Testing
- Domain logic tested in isolation
- Mock external dependencies through ports
- Test business rules and edge cases
- No framework dependencies in domain tests

### Integration Testing
- Test adapter implementations with real external services
- Use test doubles for expensive operations
- Verify contract compliance between layers

### Error Testing
- Test all error paths explicitly
- Verify proper error type propagation
- Test error message clarity and usefulness

## Documentation Requirements

### Code Documentation
- Docstrings for all public methods and classes
- Document purpose, parameters, and return values
- Focus on what and why, not how
- No per-line comments unless explicitly needed

### API Documentation
- Clear examples for all public APIs
- Document error conditions and return types
- Show fluent API usage patterns
- Include configuration examples

## Performance Guidelines

### Lazy Evaluation
- Use Future pattern for method chaining
- Defer expensive operations until resolve()
- Collect parameters without execution

### Memory Management
- Avoid unnecessary object creation
- Use readonly properties where possible
- Clean up resources in finally blocks

### Network Efficiency
- Batch operations when possible
- Use appropriate HTTP methods
- Handle rate limiting gracefully
