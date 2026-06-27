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
