# String Concatenation Operator (+)

The string concatenation operator (`+`) in OSL joins two strings together with a space automatically inserted between them.

## Syntax

```javascript
string1 + string2
```

## Description

Unlike many other programming languages where `+` simply joins strings without adding spaces, the OSL `+` operator automatically inserts a space between the concatenated strings. This makes it particularly useful for building readable sentences and text.

If either operand is a string, the other operand will be converted to a string and the operation will use string concatenation rules.

## Examples

### Basic String Concatenation

```javascript
result = "hello" + "world"
log result  // Outputs: "hello world"

// Notice the space is automatically added between "hello" and "world"
```

### Mixed Type Concatenation

```javascript
// Concatenating strings with numbers
message = "The answer is" + 42
log message  // Outputs: "The answer is 42"

// Concatenating multiple items
fullName = "John" + "Doe" + "Smith"
log fullName  // Outputs: "John Doe Smith"
```

### Building Sentences

```javascript
subject = "The cat"
verb = "sat"
preposition = "on"
object = "the mat"

// Each + operation adds a space
sentence = subject + verb + preposition + object
log sentence  // Outputs: "The cat sat on the mat"
```

## Comparison with Other String Operators

### + vs. ++ Operator

OSL provides two different operators for string operations:

```javascript
// + operator adds a space between strings
log "hello" + "world"  // Outputs: "hello world"

// ++ operator joins strings without adding a space
log "hello" ++ "world"  // Outputs: "helloworld"
```

### + vs. .append() Method

The `.append()` method attaches a string to the end without adding a space:

```javascript
str = "hello"
str.append("world")
log str  // Outputs: "helloworld"

// Equivalent to:
str = "hello" ++ "world"  // "helloworld"

// Different from:
str = "hello" + "world"   // "hello world"
```

## Notes

- The automatic space insertion is a feature specific to OSL and differs from many other programming languages.
- When working with formats where spaces matter (like URLs or file paths), use the `++` operator instead.
- The string concatenation behavior applies whenever either operand is a string.
