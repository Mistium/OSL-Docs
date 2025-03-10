# Methods

In osl you can define custom methods on specific types

```javascript
// define on the object type
Object.funny = def() -> (
  return "FUNNY" self
  // return "FUNNY" and the value that this method is called on "self": {}
)

// call the method on an object
log {}.funny()
// FUNNY {}
```

Works with object, array, number, boolean and string
