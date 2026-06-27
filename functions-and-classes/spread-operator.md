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
    max = values[0]
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

## Important Notes

- The spread parameter must be the last (and often only) parameter in the function definition
- Inside the function, the spread parameter is treated as a regular array
- If no arguments are passed, the spread parameter will be an empty array
- You can use any valid array methods on the spread parameter
- The spread operator in function definitions is different from the spread operator used to expand arrays