---
applyTo: "**/*.ts"
---

# Design Patterns Rules
Apply these patterns based on specific circumstances. Use patterns to solve problems, not to add complexity.

## Class Design Rules
Design each class with a single responsibility and ideally a single public function. Create focused classes that serve one purpose and expose minimal public interfaces.

**Function Parameter Rules:**
- Write functions that accept a single parameter when possible
- Occasionally use two parameters when necessary
- NEVER use more than three parameters
- Use parameter objects or builders for complex data requirements

## Strategy Pattern
Encapsulate algorithms into interchangeable objects for runtime switching. Apply when multiple classes differ only in behavior or conditional statements select behaviors. Extract varying behaviors into interfaces, create concrete implementations, compose main class with behavior objects, and use setters for runtime changes.

## Observer Pattern
Establish one-to-many relationships where state changes automatically notify dependents. Apply when multiple objects depend on another's state or you need loose coupling. Define Subject and Observer interfaces, maintain observer list, call notify() on state changes, and use pull model for complex data or push model for simple data.

## Decorator Pattern
Attach responsibilities dynamically by wrapping objects with new behaviors. Apply when subclassing creates class explosion or you need to combine multiple optional features. Implement same interface as wrapped objects, use composition for behavior, delegate to wrapped object with added behavior before/after, and chain decorators for multiple features.

## Factory Method Pattern
Define an interface for creating objects but let subclasses decide which class to instantiate. Apply when a class cannot anticipate object types or you need to delegate creation to subclasses. Create abstract creator with abstract factory method, implement concrete creators returning specific products, and return abstract product types only.

## Abstract Factory Pattern
Provide an interface for creating families of related objects. Apply when system works with multiple product families that must be consistent. Define abstract factory interface with creation methods, implement concrete factories for each family, use composition, and return abstract product types.

## Command Pattern
Encapsulate requests as objects for parameterization and undo support. Apply when you queue, log, or support undo operations. Define Command interface with execute(), store receiver reference in concrete commands, implement undo() with previous state, and use MacroCommand for composites.

## Template Method Pattern
Define algorithm skeleton in a method, letting subclasses override specific steps. Apply when multiple classes share structure but differ in steps. Define skeleton in abstract base class, use abstract methods for varying steps, use hook methods for optional customization, and make template method final.

## Proxy Pattern
Provide a placeholder to control access to another object. Apply when you need lazy loading, access control, remote access, or caching. Implement same interface as real object, control creation and access, delegate when appropriate, and add cross-cutting concerns transparently.

## Composite Pattern
Compose objects into tree structures treating individual and composite objects uniformly. Apply when representing hierarchies or needing recursive operations on trees. Define component interface for all objects, implement leaf objects with no children, implement composites managing children, and use recursive operations for traversal.

## Iterator Pattern
Provide sequential access to collections without exposing underlying representation. Apply when you need uniform access to different collections or multiple simultaneous traversals. Define Iterator interface with hasNext() and next(), implement concrete iterators for each collection type, and support fail-fast behavior for concurrent modifications.

## Event Sourcing Pattern
Store all state changes as events enabling audit trails and state reconstruction. Apply when you need complete audit trails or temporal queries. Store events in append-only log, build read models from event streams, use event handlers to process events, and implement snapshots for performance.

## Pattern Selection Guidelines
Choose patterns based on problem characteristics:

**Behavioral changes:** Strategy, State, Command
**Object creation:** Factory Method, Abstract Factory, Singleton
**Interface adaptation:** Adapter, Facade, Proxy
**Structure composition:** Composite, Decorator
**Algorithm structure:** Template Method
**State notifications:** Observer
**Sequential access:** Iterator

## Data Versioning Pattern
Version all objects stored to permanent storage enabling migration and format evolution while maintaining clean architecture. Apply when objects persist to storage and need backward compatibility. Add `apiVersion` as first field, create separate contract classes per version (UserV1, UserV2), organize by entity and version in folders, use date-based identifiers, and build DTO mappers with version routing. Layer responsibilities: Domain has pure entities, Contracts have versioned structures with embedded objects, DTO Mappers handle version detection and conversion, Infrastructure uses DTO mappers for serialization.

## Anti-Patterns You Avoid
Never apply patterns when:
- Simple solution exists without patterns
- Pattern adds unnecessary complexity
- Problem doesn't match pattern intent
- Using pattern just to use pattern
- Pattern violates SOLID principles in context

**Method Overload/Override Forbidden:**
Never use method overloading or overriding concrete methods as it leads to unintended behaviors. Only implement methods from interfaces or abstract classes, never override concrete method implementations. Use composition instead of inheritance. Create distinct method names for different behaviors and compose objects with specific implementations rather than relying on parameter-based method selection or concrete method overriding.
