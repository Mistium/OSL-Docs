# Debugging

The `log` command prints a value to standard output. It is the OSL equivalent of
`print` in Python or `console.log` in JavaScript, and is the main tool for
inspecting values while developing a script.

```javascript
log "hello world"
```

`say` is an alias for `log`:

```javascript
say "hello world"   // same as log
```

## Logging any value

`log` accepts any value. Arrays and objects are printed as JSON, numbers and
booleans as their literal form.

```javascript
log 42                 // 42
log [1, 2, 3]          // [1,2,3]
log { a: 1, b: 2 }     // {"a":1,"b":2}
log true               // true
```

## Building log messages

Use `++` to join a string with another value without adding a space (the value
is converted to a string automatically):

```javascript
auto x = 5
log "x is " ++ x       // x is 5
```

## warn and error

`warn` and `error` work exactly like `log` - they take any number of values and
format them the same way - but they write to **standard error** instead of
standard output. Use them for diagnostics so they stay out of a program's normal
output and can be redirected separately.

```javascript
log "result"            // -> stdout
warn "low on memory"    // -> stderr
error "request failed"  // -> stderr
```

```javascript
def check(n) (
  if n < 0 (
    error "value must not be negative"
    return
  )
  log n
)
```

`warn` and `error` are identical; the two names just signal intent. Both let the
script keep running - to stop execution, use `throw`. For structured or levelled
logging, see the [`osl/log`](../../packages/log.md) package.
