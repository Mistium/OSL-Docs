# Text Usage

Operators will use their text variant if either of their operands are strings.

## Join Strings

You can use the simple `+` operator when you want to join two values together

```javascript
log "hello" + "world"
// joins the two input strings, returning "helloworld"

log "10 + 5 =" + 15
// this will also work and the number will be appended to the string, returning "10 + 5 =15"
```

You can also use the `++` operator, which produces identical output to `+`

```javascript
log "hello" ++ "world"
// joins the two input strings, returning "helloworld"
```

## Repeat A String

You can use the `*` operator to repeat a string a set number of times

```javascript
log "hello" * 3
// returns the string repeated 3 times, "hellohellohello"
```
