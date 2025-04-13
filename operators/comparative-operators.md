# Comparative Operators

A comparative operator is an operator that takes in operands and returns a boolean.

## Equal to (==) (===)

When you want to check if a value is equal to another value in osl, there's multiple levels of how to do it.

### Case Insensitive

When you want to do an equals check for two values that is case and type insensitive, you can use `==`

```javascript
log "hello" == "Hello"
// this will return true
```

### Case Sensitive

When you want to do an equals check for two values that is case and type sensitive, you can use `===`

```javascript
log "hello" === "Hello"
// this will return false

log "world" === "world"
// this will return true
```

Type Sensitivity is also a benefit of using `===`

```javascript
log "10" == 10
// this will return true

log "10" === 10
// this will return false
```

## Greater than

You can check if a value is greater than another using the `>` operator. Greater than is always case insensitive when using strings

```javascript
log 10 > 5
// this will return true
// 10 is greater than 5

log "a" > "b"
// this will return false because a is before b in the alphabet
// you can also use !> for strings too

log 5 >= 5
// returns true
// this will check if both values are greater than or equal to each other
```

## Less than

You can also do the inverse of greater than and check if a value is less than another using the `<` operator

```javascript
log 10 < 5
// this will return false
// 10 is less than 5

log "a" < "b"
// this will return true because a is before b in the alphabet

log 5 <= 5
// returns true
// this will check if both values are less than or equal to each other
```

## Checking Contains

You can check if a value contains another value using

```javascript
log "1" in "1234"
// returns true
```

## Ternary Operator (?)

The `?` operator provides a shorthand way to write simple if-else statements. It takes three operands: a condition followed by two values, where the first value is returned if the condition is true, and the second value if it's false.

```javascript
// Basic syntax:
condition ? value1 value2

// Examples
age = 20
status = age >= 18 ? "adult" "minor"
// If age is >= 18, status will be "adult", otherwise "minor"

score = 85
result = score > 60 ? "pass" "fail"
// If score is > 60, result will be "pass", otherwise "fail"

// Can be used in expressions
text "Points: " + (points > 100 ? "max" points)
// Shows "max" if points > 100, otherwise shows the points value
// Note: The + operator here adds a space between "Points: " and the result
```

## Inverting A Comparison

You can simply place a ! infront of any comparison below to make it do the opposite of the norm.

```javascript
log 10 != 5
// returns true
// functions as the inverse of ==

log 10 !== 5
// returns true
// functions as the inverse of ===

log 10 !> 5
// returns false
// functions as the inverse of >

log 10 !< 5
// returns true
// functions as the inverse of <

log "1" !in "1234"
// returns false
// functions as the inverse of in
```
