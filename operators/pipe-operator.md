# Pipe Operator (|>)

The pipe operator (`|>`) in OSL allows you to chain function calls in a more readable way by passing the result of one expression as the input to another function. This creates a data pipeline that flows from left to right.

## Syntax

```javascript
expression |> function
```

This is equivalent to:

```javascript
function(expression)
```

## Description

The pipe operator takes the value on its left side and passes it as the first argument to the function on its right side. This allows you to create chains of operations that are more readable than nested function calls.

Key benefits of using the pipe operator:
- Improves code readability by showing data flow from left to right
- Reduces nesting of function calls
- Makes complex transformations easier to understand

## Important Constraints

In OSL, the pipe operator must be passed a function object directly, not a function call with parameters. This is because:

1. The pipe operator expects a function object on its right side
2. If you include parameters, the function would be executed first, and its return value (not the function itself) would be passed to the pipe

For example:
```javascript
// CORRECT: Passing a function object
10 |> double

// INCORRECT: This would try to pass the result of double(3) to 10
10 |> double(3)  // This doesn't work as expected
```

## Examples

### Basic Usage

```javascript
def double(number val) (
  return val * 2
)

// Without pipe operator
log double(10)  // Outputs: 20

// With pipe operator
log 10 |> double  // Outputs: 20
```

### Chaining Multiple Operations

The pipe operator really shines when you need to apply multiple transformations in sequence:

```javascript
def double(number val) (
  return val * 2
)

def addFive(number val) (
  return val + 5
)

def square(number val) (
  return val * val
)

// Without pipe operator (nested calls, read from inside out)
log square(addFive(double(10)))  // Outputs: 625

// With pipe operator (linear flow, read from left to right)
log 10 |> double |> addFive |> square  // Outputs: 625
```

### Working with Functions That Need Additional Parameters

If you need to use a function that requires additional parameters with the pipe operator, you need to create a wrapper function:

```javascript
def multiplyBy(number val, number factor) (
  return val * factor
)

// This won't work:
// 10 |> multiplyBy(3)

// Instead, create a wrapper function:
def multiplyByThree(number val) (
  return multiplyBy(val, 3)
)

log 10 |> multiplyByThree  // Outputs: 30

// Alternatively, use an anonymous function:
log 10 |> def(val) -> (
  return multiplyBy(val, 3)
)  // Outputs: 30
```

### Working with Arrays

The pipe operator is particularly useful when working with array transformations:

```javascript
numbers = [1, 2, 3, 4, 5]

def filterEven(array arr) (
  result = []
  for i arr.len (
    if arr[i] % 2 == 0 (
      result = result.append(arr[i])
    )
  )
  return result
)

def sum(array arr) (
  total = 0
  for i arr.len (
    total += arr[i]
  )
  return total
)

// For functions that need additional parameters, create wrapper functions
def multiplyAllByThree(array arr) (
  return arr.map(def(val) -> (
    return val * 3
  ))
)

// Without pipe operator
log sum(multiplyAllByThree(filterEven(numbers)))  // Outputs: 18

// With pipe operator
log numbers |> filterEven |> multiplyAllByThree |> sum  // Outputs: 18
```

## Notes

- The pipe operator passes the left value as the first argument to the function on the right
- The function on the right must be a function object, not a function call with parameters
- To use functions with additional parameters, create wrapper functions or use anonymous functions
- The pipe operator has lower precedence than most other operators
- You can chain multiple pipe operations: `value |> func1 |> func2 |> func3`
- The pipe operator works with both named functions and anonymous functions 