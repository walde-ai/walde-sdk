---
applyTo: "**/*.ts"
---

# TypeScript Style Rules

## Type Definitions
Define explicit types for all function parameters and return values. Use interfaces for 
object shapes and type aliases for union types. Leverage generic types for reusable 
components.

## Naming Conventions
Use camelCase for variables, functions, and methods. Use PascalCase for classes, 
interfaces, types, and StaticClasses. Use SCREAMING_SNAKE_CASE for constants. Use 
kebab-case for file names. Prefix interfaces with 'I' only when distinguishing from 
concrete implementations.

## Async Operations
Use async/await for all asynchronous operations. NEVER use .then() or .catch() 
chaining. Handle errors with try/catch blocks around await statements.

## Import/Export Style
Use named imports and exports exclusively. Organize imports in three groups: external 
libraries, internal modules, relative imports. Separate groups with blank lines.

## Function Declarations
Use arrow functions for inline callbacks and function expressions. Use function 
declarations for top-level functions and methods. Specify return types explicitly for all 
functions.

## Error Handling
Create custom error classes extending Error. Use Result<T, E> pattern for operations 
that can fail. Validate inputs at function boundaries with type guards.

## Code Organization
Limit files to single responsibility. Group related types in separate .types.ts files. 
Place utility functions in .utils.ts files. Keep business logic separate from 
infrastructure concerns.

## TypeScript Configuration
Ensure tsconfig.json includes strict mode and noEmitOnError settings when setting up new 
projects or refactoring existing ones. Set "strict": true and "noEmitOnError": true in 
compilerOptions. Verify these settings exist before proceeding with TypeScript work.

## Property Parameter Syntax
Always use property parameter syntax to define user-initializable properties in a class.
```ts
// Correct usage of property parameter syntax
class Content {
  constructor(
    public readonly id: string,
    public readonly siteId: string,
  ) {}
}
```
