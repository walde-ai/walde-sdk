# Standard Library

Rust-inspired type-safe utilities for robust error handling and optional values.

## Result<T, E>

Represents operations that can succeed with a value or fail with an error.

```typescript
import { Result, ok, err, unwrap, expect } from './index';

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return err('Division by zero');
  }
  return ok(a / b);
}

const result = divide(10, 2);
if (result.isOk()) {
  console.log(result.value); // 5
} else {
  console.log(result.error); // string
}

// Rust-style unwrap (throws if Err)
const value = divide(10, 2).unwrap(); // 5 or throws
const safeValue = divide(10, 2).expect('Division failed'); // 5 or throws with message
```

## Option<T>

Represents values that may or may not exist, preventing null/undefined errors.

```typescript
import { Option, some, none } from './index';

function findUser(id: string): Option<User> {
  const user = users.find(u => u.id === id);
  return user ? some(user) : none();
}

const userOption = findUser('123');
if (userOption.isSome()) {
  console.log(userOption.value.name); // User object guaranteed
} else {
  console.log('User not found');
}
```

## Future<T, P>

Enables lazy method chaining that resolves to a Promise for fluent API patterns.

```typescript
import { Future } from './index';

class WriterFuture extends Future<Writer, never> {
  constructor() {
    super({ parent: undefined as never });
  }
  
  site(name: string): SiteFuture {
    return new SiteFuture({ parent: this, siteName: name });
  }
}

class SiteFuture extends Future<Site, WriterFuture> {
  constructor({ parent, siteName }: { parent: WriterFuture, siteName: string }) {
    super({ parent });
    this.siteName = siteName;
  }
  
  content(id: string): ContentFuture {
    return new ContentFuture({ parent: this, contentId: id });
  }
}

class ContentFuture extends Future<Content, SiteFuture> {
  async resolve(): Promise<Result<Content, string>> {
    // Collect parameters from chain and make single API call
    const siteName = this.parent.siteName;
    return apiCall({ siteName, contentId: this.contentId });
  }
}

// Usage
const result = await new WriterFuture()
  .site('example.com')
  .content('post-1')
  .resolve();
```

## Type Safety

- **Result**: Eliminates exceptions by making errors explicit in return types
- **Option**: Prevents null/undefined access by enforcing type-level checks
- **Future**: Enables type-safe method chaining with parent parameter collection
- **NonNullable**: Option<T> automatically excludes null/undefined from T
