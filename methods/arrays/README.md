# Arrays

OSL provides a rich set of methods for working with arrays. Arrays in OSL are **1-indexed** - the first element is at index 1.

## Creating Arrays

```javascript
// Array literal
arr = [1, 2, 3]

// Range operator
arr = 1 to 5  // [1, 2, 3, 4, 5]
arr = -2 to 2 // [-2, -1, 0, 1, 2]

// Fill
arr = (1 to 3).fill("hi") // ["hi", "hi", "hi"]
```

## Concatenation

```javascript
// Concatenate arrays with ++
arr = [1, 2] ++ [3, 4]  // [1, 2, 3, 4]

// Prepend value to array
arr = "hello" + ["world"]  // ["hello", "world"]

// Append value to array
arr = ["hello"] + "world"  // ["hello", "world"]

// Concat method
arr = [1, 2, 3].concat([4, 5, 6])  // [1, 2, 3, 4, 5, 6]
```

## Accessing Elements

```javascript
arr = [10, 20, 30, 40, 50]

// Access by index (1-indexed)
arr[1]   // 10
arr[3]   // 30

// Negative indices count from the end
arr[-1]  // 50 (last element)
arr[-2]  // 40 (second to last)

// Out-of-bounds returns null
arr[0]   // null (arrays start at 1)
arr[10]  // null
arr[-10] // null

// First and last
arr.first()  // 10
arr.last()   // 50

// Left and right (get first/last n elements)
arr.left(2)   // [10, 20]
arr.right(2)  // [40, 50]
```

## Searching

```javascript
arr = ["a", "b", "c", "b"]

// Index of value (returns 1-based index, 0 if not found)
arr.index("b")     // 2
arr.index("z")     // 0 (not found)

// Last index of value
arr.lastIndex("b") // 4
arr.lastIndex("z") // 0 (not found)

// Contains (strict equality, no type coercion)
arr.contains("a")  // true
arr.contains(1)    // false (if arr has strings)
```

## Modifying

```javascript
arr = [1, 2, 3]

// Append and prepend (modifies in-place, returns null)
void arr.append(4)    // arr is now [1, 2, 3, 4]
void arr.prepend(0)   // arr is now [0, 1, 2, 3, 4]

// Insert at position
arr = [1, 3, 4]
void arr.insert(2, 2) // arr is now [1, 2, 3, 4]

// Swap elements at positions
arr = [1, 2, 3]
void arr.swap(1, 3)   // arr is now [3, 2, 1]
```

## Transforming

```javascript
arr = [3, 1, 2]

// Sort (ascending)
arr.sort()  // [1, 2, 3]

// Sort descending
arr.sort().reverse()  // [3, 2, 1]

// Reverse
[1, 2, 3].reverse()  // [3, 2, 1]

// Map (apply function to each element)
[1, 2, 3].map(x -> x * 2)  // [2, 4, 6]

// De-duplicate
[1, 2, 2, 3, 1, 4].deDupe()  // [1, 2, 3, 4]

// Trim (slice)
[1, 2, 3, 4, 5].trim(2, 4)  // [2, 3, 4]
```

## Aggregating

```javascript
arr = [1, 2, 3, 4, 5]

// Sum (ignores non-numbers)
arr.sum()  // 15
[1, "two", 3, null].sum()  // 4

// Product
[1, 2, 3, 4].product()  // 24

// Max and Min
arr.max()  // 5
arr.min()  // 1
```

## Random

```javascript
arr = [1, 2, 3]

// Random element
arr.randomOf()  // returns one of 1, 2, or 3
```

## Type Prototypes

You can add custom methods to arrays using type prototypes:

```javascript
Array.double = def() -> (
  return self.map(x -> x * 2)
)

[1, 2, 3].double()  // [2, 4, 6]
```

## Notes

- Arrays use 1-based indexing (first element is at index 1)
- Index 0 returns null (out of bounds)
- Negative indices work from the end (-1 is last element)
- Methods that modify in-place return null - use `void` to discard the return value
