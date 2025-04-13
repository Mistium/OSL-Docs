# symbol()

The `symbol()` function creates a unique and immutable data type that can be used as an identifier for object properties. This is a wrapper around JavaScript's native Symbol functionality.

```javascript
// Create a unique symbol
mySymbol = symbol("description")
```

## Syntax

```javascript
symbol([description])
```

## Parameters

- `description` (optional): String - A description of the symbol, used for debugging purposes but not for accessing the symbol itself

## Return Value

Returns a new Symbol with the optional description.

## Description

Symbols are unique identifiers that can be used as property keys in objects, ensuring that the property will not conflict with any other property, regardless of what name is used.

Symbols are particularly useful for:
- Creating truly private or hidden properties
- Adding non-enumerable properties to objects
- Defining special behaviors for objects

## Examples

### Basic Symbol Creation

```javascript
// Create a simple symbol
id = symbol()

// Create a symbol with a description
userSymbol = symbol("user")
```

### Using Symbols as Object Keys

```javascript
// Create a symbol for a "private" property
private_data = symbol("privateData")

// Create an object with both regular and symbol properties
object user = {
  name: "Alice",
  age: 25
}

// Add a property using the symbol as the key
user[private_data] = "Sensitive information"

// The symbol property won't show up in regular enumeration
for key in user (
  log key  // Only outputs "name" and "age"
)

// But can be accessed directly
log user[private_data]  // "Sensitive information"
```

### Using Symbols for Special Behavior

```javascript
// Define a symbol for a custom iterator
iterator = symbol("iterator")

// Create an object with a custom iteration behavior
object collection = {
  items: [1, 2, 3, 4, 5],
  [iterator]: def() -> (
    return {
      index: 0,
      items: this.items,
      next: def() -> (
        if this.index < this.items.len (
          value = this.items[this.index]
          this.index++
          return { value: value, done: false }
        )
        return { done: true }
      )
    }
  )
}

// Use the custom iterator
iter = collection[iterator]()
result = iter.next()  // { value: 1, done: false }
```

## Notes

- Each symbol value is unique and immutable.
- Symbols are not automatically converted to strings when used with string operations.
- Symbols are not enumerated in `for...in` loops or by `Object.keys()`.
- Symbols can be used to avoid property name collisions.
- Unlike JavaScript, OSL's implementation may have some differences in edge cases.