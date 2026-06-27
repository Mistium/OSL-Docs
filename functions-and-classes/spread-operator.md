# Spread Operator in Functions

## Description

The spread operator (`...`) in function definitions collects all passed arguments into a single array. This is useful when you want to handle a variable number of arguments in your function.

## Syntax

```javascript
def functionName(...parameterName) (
    // Inside the function, parameterName is an array containing all arguments
)
```

## Usage Examples

```javascript
// Basic example - counting arguments
def countArgs(...args) (
    return args.len
)

log countArgs(1, 2, 3)      // 3
log countArgs("a", "b")     // 2
log countArgs()             // 0

// Summing numbers
def sum(...numbers) (
    total = 0
    for i numbers.len (
        total += numbers[i]
    )
    return total
)

log sum(1, 2, 3, 4)        // 10
log sum(10, 20)            // 30

// Finding maximum value
def findMax(...values) (
    if values.len == 0 (
        return null
    )
    max = values[1]
    for i values.len (
        if values[i] > max (
            max = values[i]
        )
    )
    return max
)

log findMax(1, 5, 3, 9, 2) // 9

// Joining strings with separator
def join(...strings) (
    return strings.join(" ")
)

log join("hello", "world", "!") // "hello world !"
```

## Spreading an array into a call

The same `...` operator works at the **call site**: spreading an array passes each
of its elements as a separate argument. This is the inverse of a rest parameter.

```javascript
def add3(a, b, c) (
    return a + b + c
)

auto xs = [1, 2, 3]
log add3(...xs)        // 6 - same as add3(1, 2, 3)
```

It can be combined with fixed leading arguments, and used to forward a rest
parameter to another function:

```javascript
def add4(a, b, c, d) (
    return a + b + c + d
)

auto rest = [3, 4]
log add4(1, 2, ...rest)   // 10
```

Spreading also works into built-in functions that take a list of numbers:

```javascript
auto nums = [4, 1, 9, 2]
log max(...nums)   // 9
log min(...nums)   // 1
```

## Important Notes

- The rest parameter must be the last (and often only) parameter in the function definition
- Inside the function, the rest parameter is treated as a regular array
- If no arguments are passed, the rest parameter will be an empty array
- You can use any valid array methods on the rest parameter
- A rest parameter (in a definition) **collects** arguments into an array, while a
  spread argument (at a call) **expands** an array into separate arguments