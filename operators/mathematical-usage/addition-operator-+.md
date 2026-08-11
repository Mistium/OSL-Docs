# Addition Operator (+)

Use `+` to add two numbers. Both operands must be numbers; OSL reports a
compile-time type error when it can prove they are incompatible, and checks
dynamic (`any`) values at runtime.

```javascript
log 10 + 5
// does an addition on its two operands and returns 15
// this is doing 10 plus 5
```

Two strings can also be joined with `+`, but `+` does not convert mixed types:

```javascript
log "hello" + "world" // "helloworld"
log "count: " + 5      // TypeError
log "count: " ++ 5     // "count: 5"
```
