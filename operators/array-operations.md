# Array Operations

## Appending Or Prepending To An Array With A Value

You can use the `+` operator to append or prepend a value to an array

```javascript
log "hello" + ["world"]
// This prepends a value to an array, returning ["hello","world"]
// Note: The + operator does NOT add a space when used between a string and an array

log ["hello"] + "world"
// This appends a value to an array, returning ["hello","world"]
// Note: The + operator does NOT add a space when used between an array and a string
```

## Removing A Value From An Array

You can use the `-` operator to remove a value at an index or a value in the array

```javascript
log ["hello"] - "hello"
// This removes all items of the array that are equal to "hello" and returns, []

array_result2 = ["hello"] - 1
// This removes the item at index 1 of the array and returns, []
```

## Concatenating Arrays

You can use the `++` operator to concatenate and join multiple arrays together

```javascript
log ["hello"] ++ ["world"]
// This concatonated(joins) two arrays together and returns ["hello", "world"]
```

## Range Operator (to)

The `to` operator creates an array containing sequential numbers from the first operand to the second operand (inclusive).

```javascript
// Basic range creation
1 to 5     // Returns [1, 2, 3, 4, 5]
-2 to 2    // Returns [-2, -1, 0, 1, 2]
10 to 15   // Returns [10, 11, 12, 13, 14, 15]

// Common uses
// Iterate over a range
each value 1 to 5 (
    log value  // Prints numbers 1 through 5
)

// Generate index arrays
indices = 0 to array.len - 1

// Create arrays for visualization
y_positions = -100 to 100  // Array of y-coordinates
```
