# Lambda Functions

### Example

Here's a basic example of a lambda function that adds two numbers:

```javascript
(x, y) -> (x + y)

```

## Syntax

Lambda functions are defined using the following syntax:

```javascript
// Usage example:
add = (x, y) -> (x + y)

result = add(5, 3)  // returns 8
```

The syntax consists of the following parts:

1. **Parameters**: The input parameters are enclosed in parentheses.
2. **Arrow**: The arrow `->` separates the parameters from the function body.
3. **Body**: Use a concise expression, or parentheses for a multi-statement body.

## Return Value

The return value of a lambda function is the result of the expression in the function body.

## Single input lambda functions

If a lambda function has only one input parameter, the parentheses around the parameter can be omitted.

```javascript
square = v -> (v * v)

result =  square(5)  // returns 25
```

## Typed lambda functions

Parameters can be given types, and a return type can be written between the
parameter list and the arrow. Untyped parameters and return values default to `any`.

```javascript
double = (number x) number -> x * 2
maybeDouble = (number x) number? -> x > 0 ? x * 2 null

double(3)       // returns 6
maybeDouble(3)   // returns 6
maybeDouble(-1)  // returns null

add = (number x, number y) -> x + y

add(1, 2)  // returns 3
```

Typed lambdas (and typed named functions) can be passed anywhere a function is
expected, including array methods:

```javascript
[1, 2, 3].map((number x) number -> x * 2)  // returns [2, 4, 6]
[1, 2, 3].filter((number x) -> x > 1)      // returns [2, 3]
```

The `def(...)` spelling supports the same parameter and return annotations,
including user-defined classes, structs, and enums:

```javascript
values.map(def(FizzValue value) any -> (
  return value
))
```

Long concise expressions can continue on following lines:

```javascript
matches = handlers.filter(handler ->
  handler.name == command and
  (username == null or handler.registeredBy == username)
)
```
