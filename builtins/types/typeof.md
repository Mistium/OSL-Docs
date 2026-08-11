# typeof(value)

## Description

typeof returns a string representing the type of the given value.

Comparing a dynamic variable with `typeof(value) == "object"` (including reversed and strict equality) narrows it to the matched object, array, string, number, or boolean type inside matching `if`, `else if`, and `while` bodies. Multiple guards joined by `and` narrow together. A negative `typeof` guard narrows its `else` branch.

Typed variables declared in a narrowed branch can be used normally in nested blocks within that branch.

Optional values also narrow after null checks. This applies inside the non-null branch and after a returning guard clause:

```javascript
def label(string? value) string (
  if value == null (
    return ""
  )
  return value.toUpper()
)
```

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
