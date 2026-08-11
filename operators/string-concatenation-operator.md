# String Concatenation Operator (+)

The string concatenation operator (`+`) in OSL joins two strings together without inserting any space between them.

## Syntax

```javascript
string1 + string2
```

## Description

The `+` operator joins two strings without adding spaces. Both operands must be
strings. Use `++` when values should be converted to strings before joining.
Between two values `++` concatenates; after a variable as a statement (`x ++`) it increments that variable.

## Examples

### Basic String Concatenation

```javascript
result = "hello" + "world"
log result  // Outputs: "helloworld"

// No space is added between "hello" and "world"
```

### Mixed Type Concatenation

```javascript
// ++ converts the number before concatenating it
message = "The answer is" ++ 42
log message  // Outputs: "The answer is42"

// Concatenating multiple items
fullName = "John" + "Doe" + "Smith"
log fullName  // Outputs: "JohnDoeSmith"
```

### Building Sentences

```javascript
subject = "The cat"
verb = "sat"
preposition = "on"
object = "the mat"

// The + operator concatenates without spaces
sentence = subject + " " + verb + " " + preposition + " " + object
log sentence  // Outputs: "The cat sat on the mat"
```

## Comparison with Other String Operators

### + vs. ++ Operator

Both operators join strings without adding spaces, but only `++` converts mixed
operand types:

```javascript
// + operator joins strings without a space
log "hello" + "world"  // Outputs: "helloworld"

// ++ also joins strings without a space
log "hello" ++ "world"  // Outputs: "helloworld"

log "answer: " ++ 42     // Outputs: "answer: 42"
log "answer: " + 42      // TypeError
```

### + vs. .append() Method

The `.append()` method attaches a string to the end without adding a space:

```javascript
str = "hello"
str.append("world")
log str  // Outputs: "helloworld"

// Equivalent to:
str = "hello" + "world"   // "helloworld"
str = "hello" ++ "world"  // "helloworld"
```

## Notes

- Both `+` and `++` concatenate two strings without adding spaces.
- To add spaces between concatenated strings, explicitly include space strings (e.g., `"hello" + " " + "world"`).
- Mixed string and number operands are a type error with `+`; use `++` to convert and join them.
- Known incompatible types fail at compile time. Incompatible `any` values fail at runtime.
