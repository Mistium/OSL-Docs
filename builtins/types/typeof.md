# typeof(value)

## Description

typeof returns a string representing the type of the given value.

## Parameters

typeof needs one parameter:

- value: The value to check the type of

## Usage

```javascript
log typeof("hello")
// "string"

log typeof(123)
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
