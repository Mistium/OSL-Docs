# Clone Objects (=)

In osl objects are automatically cloned when assigned.

```javascript
obj = {
  key: "value"
}

obj2 = obj
// clone the object

obj2.key = "value2"
// update value on the new object

log obj.key
// "value"

log obj2.key
// "value2"
```
