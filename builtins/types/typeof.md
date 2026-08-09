# typeof(value)

## Description

typeof returns a string representing the type of the given value.

Comparing a dynamic variable with `typeof(value) == "object"` (or the reversed strict-equality form) narrows that variable to the matched object, array, string, number, or boolean type inside the matching `if`/`else if` branch. Outside the branch it keeps its original type.

## Parameters

typeof needs one parameter:

- value: The value to check the type of

## Usage

```javascript
log typeof("hello")
// "string"

log typeof(123)
// "int" — whole-number values are ints

log typeof(3.14)
// "number"

log typeof([1,2,3])
// "array"

log typeof({"key": "value"})
// "object"

log typeof(true)
// "boolean"

log typeof(null)
// "null"

// Can be used in conditions
if typeof(value) == "string" (
  // handle string case
)
```
