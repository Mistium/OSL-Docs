# Create Object References (@=)

In osl objects are automatically cloned when assigned.

```javascript
obj = {
  key: "value"
}

obj2 @= obj
// create object reference

obj2.key = "value2"
// update value on the new object

log obj.key
// "value2"

log obj2.key
// "value2"
```
