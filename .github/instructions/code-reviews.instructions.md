---
applyTo: "**/*"
excludeAgent: ["coding-agent"]
---

# Code Review Instructions

## Review Checklist

### Documentation
Check that all public methods have docstrings with purpose, parameters, and return values. Check that all classes have docstrings describing responsibility and usage. Check that exported interfaces and types are documented.

**Rationale:** Public interfaces serve as contracts. Without documentation, consumers cannot understand usage without reading implementation details, violating encapsulation and increasing cognitive load.

### Explicit Configuration
Check there are no opaque default values (e.g., `process.env.VAR || "default"`). Check that environment variables have clear error messages when missing required values. In general, prefer erroring rather than silently falling back to defaults.

**Rationale:** Opaque defaults hide runtime behavior and make debugging difficult. When a default is used, it's unclear whether it was intentional or because configuration failed. Explicit handling forces conscious decisions about fallback behavior.

### Factory Pattern
Check that factories are ALWAYS instantiable classes, not static classes. Check that factory methods are instance methods (e.g., `factory.create()`), not static (e.g., `Factory.create()`). Check that factories can be dependency injected.

**Rationale:** Static factories cannot be mocked, replaced, or configured per-instance. Instantiable factories enable dependency injection, testing with mocks, and runtime configuration changes. This maintains the Dependency Inversion Principle by allowing high-level modules to depend on factory abstractions.

### Error Handling
Check for silent error catching without explicit handling. Check that methods throw exceptions rather than returning null/undefined for error states. Check that all conditional branches are explicit with no implicit defaults.

**Rationale:** Explicit error handling makes failure modes visible. Returning null/undefined pushes error handling to consumers, spreading error logic throughout the codebase.

## Providing Feedback

### Format
Provide feedback as direct, actionable statements:

### Rules
- Describe the issue in one sentence
- Provide concrete fix in 1-3 sentences, if not obvious
- Never use generic suggestions like "improve error handling"
- Never use questions like "Should this have a docstring?"
- Focus on violations of documented standards, not opinions
