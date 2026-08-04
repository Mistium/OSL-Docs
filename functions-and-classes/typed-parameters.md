# Typed Parameters

In OSL, you can specify the expected type of a function parameter to improve code clarity and enable better error checking. This feature allows you to declare what type of data a function expects, making your code more robust and self-documenting.

Editor signature inference, signature help and typed hover read the function name, parameter types and return type from the same header.

## Syntax

```javascript
def functionName(type paramName) (
  // function body
)
```

## Supported Types

You can use any of the following types for parameter type annotations:

- `string` - Text values
- `number` - Numeric values (integers and decimals)
- `boolean` - Logical values (true/false)
- `array` - JSON arrays
- `object` - JSON objects
- `function` - A function value (lambda or named function); `fnc` is accepted as a shorthand
- `any` - Any type (default if no type is specified)

## Examples

### Basic Type Annotations

```javascript
// Function with a number parameter
def double(number val) (
  return val * 2
)

// Function with a string parameter
def greet(string name) (
  // Using ++ to concatenate without spaces
  return "Hello, " ++ name ++ "!"
)

// Function with multiple typed parameters
def createPerson(string name, number age) (
  return {
    name: name,
    age: age
  }
)
```

### Using Type Annotations for Validation

When you specify a type for a parameter, OSL will automatically validate that the provided argument matches the expected type. If an incorrect type is provided, an error will be thrown.

```javascript
def double(number val) (
  return val * 2
)

log double(10)    // Works correctly, outputs: 20
log double("10")  // Error: Expected number but got string
```

### Optional Parameters (`type?`)

Adding `?` to a parameter's type makes it **nullable and optional**. A `?` parameter
accepts `null`, and if it is a trailing parameter, callers may omit it entirely — the
value defaults to `null`.

```javascript
def silly(number value, number? add) number (
  if add == null (
    return value
  )
  return value + add
)

log silly(10, 10)   // 20
log silly(10, null) // 10
log silly(10)       // 10 — omitted, add is null
```

Multiple trailing optionals fill left to right:

```javascript
def multi(number a, number? b, number? c) number (
  out = a
  if b != null (
    out += b
  )
  if c != null (
    out += c
  )
  return out
)

log multi(1)       // 1
log multi(1, 2)    // 3
log multi(1, 2, 3) // 6
```

Notes:

- Only **trailing** `?` parameters may be omitted. A `?` parameter followed by a
  required one (e.g. `def f(number? a, number b)`) is still nullable, but must be
  passed explicitly.
- This differs from passing `null` to a plain typed parameter: a plain `number`
  parameter coerces `null` to `0`, while a `number?` parameter preserves the `null`
  so you can test for it with `== null`.
- `?` works in lambdas too: `silly = def(number value, number? add) -> ( ... )`.

### Function Signature Types (`fnc(...)`)

A parameter typed `function` (or `fnc`) accepts any function value. To require a
*specific* signature, write the parameter types in parentheses followed by an optional
return type — the same shape as a `def` header, without the body:

```javascript
def apply(fnc(number) number f, number x) number (
  return f(x)
)

double = def(number n) number -> (n * 2)
log apply(double, 21) // 42
```

`fnc(number, number) number` means "takes two numbers, returns a number". Omit the
return type (`fnc(number)`) to accept any return value.

Signature types are checked at compile time, in both directions:

```javascript
shout = def(string s) string -> (s.toUpper())
apply(shout, 21) // TypeError: expects fnc(number) number, got fnc(string) string

def apply2(fnc(number) number f) number (
  return f("hi") // TypeError: Argument 1 to f expects number, got string
)
```

Calls *through* the typed parameter are checked against the signature, and the call's
return type is known to the compiler, so results flow into typed expressions without
casting.

Untyped lambdas passed where a signature is expected have their parameter types
inferred from it:

```javascript
log apply(def(n) -> (n * 2), 10) // n is inferred as number → 20
```

Notes:

- A bare `function`/`fnc` parameter still accepts any function, including
  signature-typed ones, and vice versa — signatures only tighten checking where you
  ask for it.
- Signatures compare structurally: parameter counts must match and each type must be
  compatible; an untyped lambda parameter is compatible with anything.
- `.call()` and `.bind()` work on signature-typed values as usual.

### Complex Type Annotations

You can also use type annotations with more complex function signatures:

```javascript
// Function that takes a callback function
def processData(array data, processor) (
  result = []
  for i data.len (
    result = result.append(processor(data[i]))
  )
  return result
)

// Using the function
numbers = [1, 2, 3, 4, 5]
log processData(numbers, double)  // Outputs: [2, 4, 6, 8, 10]
```

## Benefits of Typed Parameters

1. **Self-documenting code** - Type annotations make it clear what kind of data a function expects
2. **Early error detection** - Type mismatches are caught when the function is called
3. **Better IDE support** - Enables better code completion and hints
4. **Improved maintainability** - Makes code easier to understand and modify

## Notes

- Type annotations are optional - you can mix typed and untyped parameters
- If no type is specified, the parameter accepts any type; an omitted parameter list is empty
- Type checking happens at runtime when the function is called
- Type annotations do not affect the function's return value
- Function declarations and imported function assignments share parameter-type resolution and signature registration; local imports use the same file and directory path rules as normal imports
- Cached local imports reuse parsed signatures across parallel workers while returning isolated deep-cloned syntax trees.
