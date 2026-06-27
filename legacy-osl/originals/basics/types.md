# Types

OSL supports six fundamental data types that can be used to represent various kinds of data.

## String

Text values enclosed in double quotation marks.

```javascript
// Basic string
name = "Hello"

// String with spaces
message = "Hello, World!"

// String with special characters
path = "C:/Users/Documents"
```

## Boolean

Logical values representing true or false (case-insensitive).

```javascript
// Boolean values
isTrue = true
isFalse = false

// In conditions
if true (
    log "This will execute"
)

// Boolean operations
result = true and false  // false
```

## Number

Numeric values including integers and decimals.

```javascript
// Integers
count = 42
negative = -10

// Decimals
price = 19.99
temperature = -2.5

// In calculations
total = 10.5 + 20  // 30.5
```

## Array

Ordered collections of values enclosed in square brackets.

```javascript
// Simple array
names = ["Alice", "Bob", "Charlie"]

// Mixed type array
data = [1, "two", true, 4.5]

// Nested array
matrix = [[1, 2], [3, 4]]

// Empty array
empty = []
```

## Object

Key-value collections enclosed in curly braces.

```javascript
// Simple object
person = {
    name: "John",
    age: 30
}

// Nested object
user = {
    info: {
        id: 123,
        email: "user@example.com"
    },
    settings: {
        theme: "dark"
    }
}

// Object with arrays
data = {
    numbers: [1, 2, 3],
    flags: [true, false]
}
```

## null

Represents an empty or undefined value.

```javascript
// Explicit null
value = null

// Checking for null
if value == null (
    log "Value is null"
)

// In objects
user = {
    name: "John",
    middleName: null
}
```

## Type Checking

You can check the type of a value using the `typeof()` function:

```javascript
 typeof("Hello")     // "string"
typeof(42)          // "number"
typeof(true)        // "boolean"
typeof([1,2,3])     // "array"
typeof({x:1})       // "object"
typeof(null)        // "null"
```

## Important Notes

* Strings must use double quotes (`"`)
* Booleans are case-insensitive (`True` or `true`)
* Numbers must match the pattern `[0-9.\-]+`
* Arrays can contain mixed types
* Object keys don't need quotes
* `null` represents absence of value
* All types support the `.getType()` method
