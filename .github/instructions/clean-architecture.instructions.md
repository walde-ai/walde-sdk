---
applyTo: "**/*.ts"
---

# Clean Architecture Rules
Write code following clean architecture principles. Create "soft" software that adapts to changing requirements without exponential cost increases.

## What You Must Achieve
Create systems that are:
- Independent of frameworks, UI, databases, and external agencies
- Testable business logic without external dependencies
- Able to defer technology decisions until optimal timing
- Plugin architectures where details plug into business rules
- Sustainable development velocity over system lifetime

## Folder Structure
Organize your code using this structure:
```
src/
├── domain/                    # Core business logic (innermost layer)
│   ├── entities/             # Enterprise business rules and critical data
│   ├── interactors/          # Application business rules (use cases)
│   ├── exceptions/           # Business-specific exceptions
│   └── ports/                # Interface definitions (abstractions)
│       ├── in/              # Input ports (driving adapters)
│       └── out/             # Output ports (driven adapters)
├── adapters/                 # Interface adapters layer
│   ├── controllers/          # Handle external requests
│   ├── presenters/           # Format data for presentation
│   ├── gateways/            # Data access implementations
│   └── mappers/             # Data transformation between layers
├── infrastructure/           # Frameworks and drivers (outermost layer)
│   ├── web/                 # Web framework specifics
│   ├── database/            # Database implementations
│   ├── external/            # Third-party service integrations
│   └── config/              # Configuration and dependency injection
└── main/                    # Application entry points
    ├── factories/           # Object creation
    └── composition/         # Dependency wiring
```

**Business Domain Segmentation:**
Segment the domain folder according to business rules rather than software concerns. For example, a restaurant application might have a front-of-house and back-of-house folder within the domain, which then contain their entities, interactors, and ports folders.
Split based on what makes sense for your business problem, not generic software categories. The content of each of the business-defined folders may be some further categorization that makes sense to the business instead of entities, interactors, and ports as shown in the example.

## The Dependency Rule
Ensure source code dependencies point only inward toward higher-level policies. Never allow inner circles to know about outer circles.

- Make entities depend on nothing
- Make use cases depend only on entities
- Make interface adapters depend on use cases and entities
- Make frameworks depend on interface adapters

## SOLID Principles Implementation
### Single Responsibility Principle (SRP)
Make each module responsible to one, and only one, actor.
- Each class serves a single actor (group of users/stakeholders)
- Separate code that serves different actors into distinct classes
- Use Facade pattern to maintain unified interfaces while isolating implementations
- Write functions with single parameters when possible, maximum two
- Write classes with single public methods when possible

**Avoid these violations:**
- Multiple actors depending on same module
- Shared code causing accidental coupling between actors
- Merge conflicts from multiple teams modifying same files

### Open-Closed Principle (OCP)
Make software entities open for extension, closed for modification.

- Add features by extending, never by modifying existing code
- Separate concerns based on how, why, and when they change
- Use interfaces and dependency inversion to protect high-level policies
- Create plugin architectures where new features are plugins
- Partition functionality into components with unidirectional dependencies

**Use:**
- Strategy patterns for varying algorithms
- Template method patterns for varying steps
- Dependency injection for varying implementations
- Abstract factories for varying object creation

### Liskov Substitution Principle (LSP)
Make objects of supertype replaceable with objects of subtypes without breaking functionality.

- Make all implementations of interface truly substitutable
- Avoid special-case handling for different implementations
- Design interfaces that all implementations can honor completely
- Prevent if-statements checking implementation types

**Avoid these violations:**
- Implementations that throw exceptions for interface methods
- Implementations that require special configuration or handling
- Clients needing to know specific implementation details

### Interface Segregation Principle (ISP)
Ensure clients don't depend on interfaces they don't use.

- Create focused interfaces for specific client needs
- Segregate large interfaces into smaller, cohesive ones
- Avoid forcing clients to implement unused methods
- Prevent unnecessary recompilation from unused method changes

**Use:**
- Role interfaces for specific use cases
- Adapter pattern to bridge incompatible interfaces
- Composition over inheritance to avoid interface bloat

### Dependency Inversion Principle (DIP)
Make high-level modules independent of low-level modules. Both depend on abstractions.

- Never refer to volatile concrete classes
- Never derive from volatile concrete classes
- Never override concrete functions
- Never mention concrete and volatile names
- Use Abstract Factories for object creation
- Define interfaces in high-level modules, implement in low-level

## Business Rules Architecture

### Entities
Write entities that contain Critical Business Rules and Critical Business Data that would exist without automation.

- Use business domain language in naming
- Add no framework dependencies
- Include no persistence logic
- Represent pure business concepts only
- Keep methods minimal, prefer interactors for manipulation

**Example Structure:**
```js
class Order {
    private OrderId id;
    private CustomerId customerId;
    
    public boolean canBeCancelled() {
        // Pure business rule
    }
}
```

### Use Cases (Interactors)
Write use cases that contain application-specific business rules orchestrating entity interactions.

- Orchestrate entity flow for specific use cases
- Handle application business logic
- Remain ignorant of UI, database, and framework details
- Use dependency injection for external dependencies
- Return simple data structures, never entities

**Structure each use case:**
- Input: Request model
- Processing: Orchestrate entities and call output ports
- Output: Response model

### Ports (Interfaces)
Define contracts between layers without implementation details.

**Input Ports (Driving):**
- Define use case interfaces
- Get called by controllers
- Represent what application can do

**Output Ports (Driven):**
- Define external service interfaces
- Get implemented by gateways
- Represent what application needs

## Boundary Management
Use Dependency Inversion Principle with interfaces and polymorphism.

- Pass simple data structures across boundaries
- Never pass entity objects across boundaries
- Never pass database rows across boundaries
- Use data transfer objects (DTOs) for boundary crossing
- Convert data formats at boundary adapters

Choose appropriate boundary based on operational needs: Source Level (monolithic deployment), Deployment Level (separate components), or Service Level (separate processes). Start with source-level, evolve as needed.
Draw boundaries at axes of change: different rates, reasons, actors, or abstraction levels. Defer decisions to leave options open.

## Component Organization
**Reuse/Release Equivalence (REP):** Make classes in component form cohesive group released together with same version.

**Common Closure (CCP):** Gather classes that change for same reasons, minimizing redeployment.

**Common Reuse (CRP):** Put classes reused together in same component, preventing unnecessary dependencies.

**Acyclic Dependencies (ADP):** Prohibit cycles in dependency graph. Break cycles using Dependency Inversion.

**Stable Dependencies (SDP):** Point dependencies toward stability. Make unstable components depend on stable ones.

**Stable Abstractions (SAP):** Make stable components abstract, unstable components concrete.

## Implementation
### Humble Object
Separate hard-to-test behaviors from easy-to-test. Views contain minimal code to move data to screen. Presenters contain testable presentation logic.

### Gateway
Isolate database access behind interfaces with CRUD operations. Implement in infrastructure layer using dependency injection. Keep SQL in gateway implementations.

### Factory
Manage object creation without violating Dependency Rule. Define Abstract Factories in high-level modules, implement in low-level modules, inject into use cases.

## Testing 
Treat tests as outermost components. Tests depend inward on system, never reverse. Design for testability from start.

## Framework and Technology Rules
Treat frameworks as tools in outer circles. Isolate in infrastructure layer, use dependency injection, create anti-corruption layers, test business logic independently. This includes Database and Web dependencies.

## Code Review Checklist
Verify these requirements:
- [ ] Dependencies point inward only
- [ ] Business logic independent of frameworks
- [ ] Simple data structures cross boundaries
- [ ] Interfaces defined in inner layers
- [ ] Implementations in outer layers
- [ ] Single responsibility per component
- [ ] Can add features without modifying existing code
- [ ] Tests don't depend on external systems
- [ ] Framework code isolated in infrastructure
- [ ] Use cases testable without UI/database

## Anti-Patterns You Must Eliminate
Never write:
- Business logic in controllers or presenters
- Use cases importing web framework classes
- Entities handling their own persistence
- Hard-coded dependencies on concrete classes
- Cyclic dependencies between components
- Framework inheritance in business objects
- Database queries in use case layer
- UI logic mixed with business logic
