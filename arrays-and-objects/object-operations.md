# Object Operations

## Basic Operations

Objects in OSL provide various ways to access and modify their properties:

```javascript
obj = {x: 1, y: 2}

// Accessing properties
val1 = obj.x          // Using dot notation
val2 = obj["x"]       // Using bracket notation

// Modifying properties
obj.x = 10            // Using dot notation
obj["x"] = 10         // Using bracket notation
```

## Object Methods

```javascript
// Getting object information
keys = obj.getKeys()      // Returns array of keys
values = obj.getValues()  // Returns array of values

// Checking for properties
exists = obj.contains("x")  // Returns true/false
```

## Object Merging

The `++` operator combines objects, preserving values from the left operand:

```javascript
obj1 = {a: 1, b: 2}
obj2 = {b: 3, c: 4}
merged = obj1 ++ obj2    // {a: 1, b: 2, c: 4}

// Multiple merges
final = obj1 ++ obj2 ++ {d: 5}
```

## Using Self Reference

Objects can reference their own properties using `self`:

```javascript
calculator = {
    base: 100,
    tax: 0.2,
    total: self.base * (1 + self.tax),
    calculate: def() -> (
        return self.base * (1 + self.tax)
    )
}
```

## Computed Properties

Objects can include computed values when created:

```javascript
multiplier = 2
price = 10

product = {
    base: price,
    doubled: price * multiplier,
    withTax: self.base * 1.2
}
```

## Important Notes

- Properties can be accessed using dot or bracket notation
- The `++` operator preserves left operand values in conflicts
- Use `self` to reference object's own properties
- `.contains()` checks for property existence
- `.getKeys()` and `.getValues()` return arrays
- Computed properties are evaluated at creation time
- Objects can contain methods using `def() ->` 