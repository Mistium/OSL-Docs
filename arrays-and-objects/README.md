# Arrays and Objects in OSL

## Description

OSL provides powerful handling of arrays and objects with several unique features:
- Arrays are 1-indexed (first element is at index 1)
- Dynamic creation with variables and expressions
- Built-in merging with the `++` operator
- Copy-based operations for data safety
- Deep cloning by default with `=`
- References with `@=`

## Arrays

### Creating Arrays

```javascript
// Simple array
numbers = [1, 2, 3, 4, 5]

// Array with expressions
base = 10
computed = [base * 1, base * 2, base * 3]  // [10, 20, 30]

// Mixed type array
mixed = [1, "text", true, {x: 10}]

// Array with computed values
vals = [1 + 1, "pre" ++ "fix", 10 * 2]  // [2, "prefix", 20]
```

### Array Operations

```javascript
arr = [1, 2, 3, 4]

// Accessing elements (1-indexed)
first = arr[1]    // 1
second = arr[2]   // 2

// Modifying elements
arr[1] = 10      // [10, 2, 3, 4]

// Adding elements
arr.append(5)     // [10, 2, 3, 4, 5]
arr.prepend(0)    // [0, 10, 2, 3, 4, 5]

// Removing elements
arr.pop()         // Removes and returns last element
arr.shift()       // Removes and returns first element

// Array information
length = arr.len  // Number of elements

// Array slicing
slice = arr.trim(2, 4)  // Gets elements from index 2 to 4 inclusive
```

### Array Methods

```javascript
arr = [3, 1, 4, 1, 5, 9]

// Sorting
arr.sort()        // Ascending order
arr.sort("desc")  // Descending order

// Element operations
arr.swap(1, 2)    // Swaps elements at indices 1 and 2
random = arr.randomOf()  // Returns random element

// Joining arrays
arr1 = [1, 2]
arr2 = [3, 4]
combined = arr1 ++ arr2  // [1, 2, 3, 4]

// Mapping
doubled = arr.map(def(x) -> (return x * 2))
```

## Objects

### Creating Objects

```javascript
// Simple object
person = {
    name: "John",
    age: 30
}

// Object with computed values
multiplier = 2
product = {
    price: 10,
    discount: 0.2,
    final: self.price * (1 - self.discount) * multiplier
}

// Object with methods
calculator = {
    value: 100,
    double: def() -> (
        return self.value * 2
    )
}
```

### Object Operations

```javascript
obj = {x: 1, y: 2}

// Accessing properties
val = obj.x       // 1
// or
val = obj["x"]    // 1

// Modifying properties
obj.x = 10
// or
obj["x"] = 10

// Getting information
keys = obj.getKeys()     // ["x", "y"]
values = obj.getValues() // [10, 2]

// Check if key exists
hasKey = obj.contains("x")  // true

// Merging objects
obj1 = {a: 1, b: 2}
obj2 = {b: 3, c: 4}
merged = obj1 ++ obj2    // {a: 1, b: 2, c: 4}
```

### Cloning vs Referencing

```javascript
// Reference: `=` makes both names point to the same data
obj1 = {x: 1, y: {z: 2}}
obj2 = obj1  // obj2 references the same object as obj1

// Modifying through the reference affects the original
obj2.x = 10  // Also changes obj1.x to 10

// Independent copy: use .clone()
obj3 = obj1.clone()  // obj3 is a deep copy of obj1
obj3.x = 20          // Only changes obj3.x
```

## Important Notes

- Arrays are always 1-indexed in OSL
- Most operations create new copies rather than modifying in place
- The `++` operator preserves values from the left operand on key conflicts
- Objects can contain functions and reference their own properties with `self`
- Expressions and variables are evaluated when the array/object is created
- Nested structures are supported to any depth
- All OSL data types can be stored in arrays and objects
- Assignment with `=` creates a reference (both names share the same data); use `.clone()` for an independent deep copy
- Use `.contains()` to check for object keys
- Use `.trim()` for array slicing 