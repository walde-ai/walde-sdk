---
applyTo: "**/*.ts"
---

# Coding Practices Rules
Follow these core coding practices in all implementations.

Adhere to the styling rules and conventions of the language at hand.

- Use established formatting conventions for the specific language
- Apply standard naming conventions for the language
- Follow structural patterns expected in the language ecosystem
- Maintain consistency with existing codebase style

## Explicit Branch Handling Rules
Avoid defaults as they lead to opaque behaviors. Do not assume "if not a then b" as the result may be c.

**Apply explicit branch handling:**
```
if (condition_a) {
    doA();
} else if (condition_b) {
    doB();
} else {
    throw new WeDidNotExpectThisState();
}
```

**Follow these rules:**
- Cover all branches explicitly in conditional logic
- Never rely on implicit defaults or assumptions about state
- Make all possible states visible in code
- Throw exceptions for unexpected states rather than assuming defaults

## Error Handling Rules
Do not use default values from returns or silence errors. Do not return null or undefined when receiving unexpected input.

**Handle unexpected input by:**
- Throwing explicit exceptions describing the unexpected state
- Returning result objects that represent valid/invalid states (similar to Rust's Result type)
- Making error states explicit at appropriate levels
- Don't hide errors with default values

**Exception handling:**
- Use exceptions defined in exceptions folder over native language errors
- Prefer existing exceptions over creating new ones
- Throw exceptions in getters when items not found rather than returning null/undefined
- Make all error conditions explicit

## Documentation
Write docstrings for every method and class.
- Document all public methods with purpose, parameters, and return values
- Document all classes with their responsibility and usage
- Never write per-line comments to explain code unless explicitly requested
- Keep documentation focused on what and why, not how

## Anti-Patterns to Eliminate
- Conditional logic that assumes default cases without explicit handling
- Methods that return null/undefined for error conditions
- Silent error handling that hides failures
- Code that relies on implicit language defaults for business logic
- Exception handling that catches and ignores without proper resolution
