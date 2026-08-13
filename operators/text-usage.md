# Text Usage

The `+` operator joins two strings. It does not convert a number or another type
to text automatically.

## Join Strings

Use `+` when both values are strings:

```javascript
log "hello" + "world"
// joins the two input strings, returning "helloworld"

log "10 + 5 =" + 15
// TypeError: + cannot join a string and a number
```

Use `++` to convert mixed values and concatenate them:

```javascript
log "hello" ++ "world"
// joins the two input strings, returning "helloworld"

log "10 + 5 =" ++ 15
// converts 15 to text, returning "10 + 5 =15"
```

## Repeat A String

You can use the `*` operator to repeat a string a set number of times

```javascript
log "hello" * 3
// returns the string repeated 3 times, "hellohellohello"
```

A negative repeat count is invalid. When the compiler can see that the count is negative, it reports
the error during compilation; otherwise the runtime reports it when the expression is evaluated.
