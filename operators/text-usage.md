# Text Usage

Operators will use their text variant if either of their operands are strings.

## Join Strings

You can use the simple `+` operator when you want to join two values together with a space

```javascript
log "hello" + "world"
// joins the two input strings using a space, returning "hello world"

log "10 + 5 =" + 15
// this will also work and the number will be appended to the string with a space
```

You can join two strings without a space using the `++` operator

```javascript
log "hello" ++ "world"
// joins the two input strings, returning "helloworld"
```

## Remove From String

You can use the simple `-` operator when you want to remove a value from another

```javascript
log "hello world" - " world"
// removes the string " world" from "hello world", returning "hello"
```

## Repeat A String

You can use the `*` operator to repeat a string a set number of times

```javascript
log "hello" * 3
// returns the string repeated 3 times, "hellohellohello"
```
