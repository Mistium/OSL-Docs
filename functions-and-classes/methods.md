# Methods

In OSL you can define custom methods on specific types.

```javascript
// define on the object type
object.funny = def() -> (
  return "FUNNY"
)

// call the method on an object
log {}.funny()
// FUNNY
```

Inside a custom method, `self` is the value the method was called on.

Custom methods work with object, array, number, boolean and string values.

A custom method with the same name as a built-in method overrides the built-in for the rest of the program:

```javascript
Array.sum = def() -> (
  return "my sum"
)

log [1, 2, 3].sum()
// "my sum" (the custom method wins over the built-in)
```
