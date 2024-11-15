# Text Usage

Operators will use their text variant if either of their operands are strings.

## Join Strings

You can use the simple `+` operator when you want to join two values together

```javascript
log "hello" + "world"
// joins the two input strings using a space, returning "hello world"

log "10 + 5 =" + 15
// this will also work and the number will be appended to the string
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

## Nullish Coalescence

You can check if a value exists by using this operator.

```javascript
obj = {"key":1}

log obj.key2 ?? 2
// logs "2" because obj.key2 is null

log null ?? 1
// logs 1 because null is null

log 1 ?? 2
// logs 1 because the left hand operand isnt null

log null ?? null
// logs null because the left hand operand is null so it returns the right hand operand
```
