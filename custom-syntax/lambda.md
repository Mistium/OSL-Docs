# Lambda Functions

## Advantages of Lambda Functions

1. **Readability**: Lambda functions provide a concise, expressive way to write small functions inline, making shaders more readable.
2. **Reusability**: Quick, single-expression functions can be easily reused across your shader code.
3. **Maintainability**: Their simple syntax makes them easy to update and maintain.
4. **Performance**: Lambda functions are typically inlined, reducing function call overhead.

#### Example

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
3. **Body**: The function body is enclosed in parentheses.

## Return Value

The return value of a lambda function is the result of the expression in the function body.


## Single input lambda functions

If a lambda function has only one input parameter, the parentheses around the parameter can be omitted.

#### Example

```javascript
square = v -> (v * v)

result =  square(5)  // returns 25
```