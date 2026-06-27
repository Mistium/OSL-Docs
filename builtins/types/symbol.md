# symbol()

The `symbol()` function creates a unique and immutable data type that can be used as an identifier for object properties. This is a wrapper around JavaScript's native Symbol functionality.

```javascript
// Create a unique symbol
mySymbol = symbol()
```

## Syntax

```javascript
symbol()
```

## Parameters

- `none`: This function does not take any parameters.

## Return Value

Returns a new Symbol object.

Symbols are particularly useful for:

- Creating truly private or hidden properties
- Adding non-enumerable properties to objects
- Defining special behaviors for objects

## Examples

### Basic Symbol Creation

```javascript
// Create a simple symbol
id = symbol()
```

### Using Symbols as Object Keys

```javascript
// Create a symbol for a "private" property
private_data = symbol()

// Create an object with both regular and symbol properties
object user = {
  name: "Alice",
  age: 25
}

// Add a property using the symbol as the key
user[private_data] = "Sensitive information"

// The symbol property won't show up in regular enumeration
each key user.getKeys() (
  log key  // Only outputs "name" and "age"
)

// But can be accessed directly
log user[private_data]  // "Sensitive information"
```

## Notes

- Each symbol value is unique and immutable.
- Symbols are not automatically converted to strings when used with string operations.
- Symbols can be used to avoid property name collisions.
- Unlike JavaScript, OSL's implementation may have some differences in edge cases.
