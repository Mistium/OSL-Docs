# JSON in OSL

## Description

OSL provides powerful and flexible JSON handling with several unique features:

- 1-based array indexing
- Dynamic JSON creation with variables and expressions
- Built-in merging operations
- Support for all OSL data types
- Copy-based operations for data safety

## JSON Creation

### Basic Syntax

```javascript
// Simple object
data = {
    name: "John",
    age: 25 * 2,  // Expressions are evaluated
    items: ["a", "b", "c"]
}

// Object with computed values
multiplier = 10
obj = {
    base: 5,
    computed: self.base * multiplier,  // References other properties
    dynamic: "pre" ++ "fix"  // String concatenation
}

// Object with methods
calculator = {
    value: 100,
    double: def() -> (
        return self.value * 2
    )
}
```

### Merging with ++

The `++` operator merges arrays, objects, or strings:

```javascript
// Object merging
obj1 = {a: 1, b: 2}
obj2 = {b: 3, c: 4}
merged = obj1 ++ obj2  // {a: 1, b: 2, c: 4} (obj1's 'b' preserved)

// Array merging
arr1 = [1, 2]
arr2 = [3, 4]
merged = arr1 ++ arr2  // [1, 2, 3, 4]

// String concatenation without spaces (++), different from + which adds spaces
str = "Hello" ++ " " ++ "World"  // "Hello World"
// Note: We explicitly add a space as a separate string since ++ doesn't add spaces
```

## Type Support

OSL JSON can contain any valid OSL type:

- Numbers (integer and float)
- Strings
- Booleans
- Arrays (1-indexed)
- Objects
- Functions
- null

```javascript
complex = {
    num: 42,
    float: 3.14,
    text: "string",
    bool: true,
    arr: [1, "mixed", true],
    nested: {x: 10},
    func: def(x) -> (return x * 2)
}
```

## Important Notes

- Arrays are 1-indexed (first element is at index 1)
- Most operations create new copies rather than modifying in place
- The `++` operator preserves values from the left operand on key conflicts
- JSON objects can contain functions and reference their own properties with `self`
- Expressions and variables in JSON are evaluated when the object is created
- Nested objects and arrays are supported to any depth
- All OSL data types can be stored in JSON structures
