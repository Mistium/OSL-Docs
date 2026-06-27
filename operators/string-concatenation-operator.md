# String Concatenation Operator (+)

The string concatenation operator (`+`) in OSL joins two strings together without inserting any space between them.

## Syntax

```javascript
string1 + string2
```

## Description

The `+` operator joins strings together without adding spaces. If either operand is a string, the other operand will be converted to a string and the operation will use string concatenation rules. This behavior is identical to the `++` operator.

## Examples

### Basic String Concatenation

```javascript
result = "hello" + "world"
log result  // Outputs: "helloworld"

// No space is added between "hello" and "world"
```

### Mixed Type Concatenation

```javascript
// Concatenating strings with numbers
message = "The answer is" + 42
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

The `+` and `++` operators behave identically in OSL-both join strings without adding spaces:

```javascript
// + operator joins strings without a space
log "hello" + "world"  // Outputs: "helloworld"

// ++ operator also joins strings without a space (identical behavior)
log "hello" ++ "world"  // Outputs: "helloworld"
```

### + vs. .append() Method

The `.append()` method attaches a string to the end without adding a space, which is identical to both `+` and `++`:

```javascript
str = "hello"
str.append("world")
log str  // Outputs: "helloworld"

// Equivalent to:
str = "hello" + "world"   // "helloworld"
str = "hello" ++ "world"  // "helloworld"
```

## Notes

- Both `+` and `++` operators concatenate strings without adding spaces.
- To add spaces between concatenated strings, explicitly include space strings (e.g., `"hello" + " " + "world"`).
- The string concatenation behavior applies whenever either operand is a string.
