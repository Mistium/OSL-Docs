# Modifying An Array

## Basic Operations

Arrays in OSL provide several methods for modification and access.

```javascript
arr = [1, 2, 3, 4]

// Accessing elements (1-indexed)
first = arr[1]    // 1
second = arr[2]   // 2

// Modifying elements
arr[1] = 10      // [10, 2, 3, 4]

// Getting length
length = arr.len  // Number of elements
```

## Adding and Removing Elements

```javascript
// Adding elements
arr.append(5)     // Adds to end
arr.prepend(0)    // Adds to beginning

// Removing elements
last = arr.pop()    // Removes and returns last element
first = arr.shift() // Removes and returns first element
```

## Array Methods

```javascript
// Sorting
arr.sort()        // Ascending order
arr.sort("desc")  // Descending order

// Swapping elements
arr.swap(1, 2)    // Swaps elements at indices 1 and 2

// Getting random element
random = arr.randomOf()

// Slicing arrays
slice = arr.trim(2, 4)  // Gets elements from index 2 to 4 inclusive

// Mapping over elements
doubled = arr.map(def(x) -> (return x * 2))

// Fill array with value
numbers = (1 to 10).fill("hi")  // ["hi", "hi", "hi", "hi", "hi", "hi", "hi", "hi", "hi", "hi"]
```

## Array Merging

```javascript
// Using the ++ operator
arr1 = [1, 2]
arr2 = [3, 4]
combined = arr1 ++ arr2  // [1, 2, 3, 4]
```

## Array Destructuring

```javascript
// Assign multiple variables from array
var1, var2, var3 = [1, 2, 3]

// Skip elements
first, , third = [1, 2, 3]
```

## Important Notes

- Arrays are 1-indexed in OSL
- Most operations create new copies
- `.trim()` is used for array slicing
- Destructuring can skip elements using empty slots
- The `++` operator combines arrays
- Methods like `sort()` and `map()` return new arrays
