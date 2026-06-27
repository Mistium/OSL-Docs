# Clone Objects (=)

In osl, the `=` operator assigns objects by reference, meaning both variables point to the same object. To create an independent copy, use the `.clone()` method.

```javascript
obj = {
  key: "value"
}

obj2 = obj
// reference to the same object

obj2.key = "value2"
// updates the original object

log obj.key
// "value2" (both refer to the same object)

log obj2.key
// "value2"
```

## Creating a Copy

To create an independent copy of an object, use `.clone()`:

```javascript
obj = {
  key: "value"
}

obj2 = obj.clone()
// independent copy

obj2.key = "value2"
// only affects the copy

log obj.key
// "value"

log obj2.key
// "value2"
```
