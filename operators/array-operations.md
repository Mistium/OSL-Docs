# Array Operations

## Appending Or Prepending To An Array With A Value

You can use the `+` operator to append or prepend a string to an array

```javascript
log "hello" + ["world"]
// This prepends a value to an array, returning ["hello","world"]

log ["hello"] + "world"
// This appends a value to an array, returning ["hello","world"]
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
