# References To Objects/Variables (@=)

In osl objects are automatically cloned when assigned. Using the @= operator you can create a reference despite this.

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

You can also use this on the variables themselves.

```javascript
val = "hi"

val2 @= val
// create reference

val = "hello"
// update the variable

log val
// "hello"

log val2
// "hello"
```
