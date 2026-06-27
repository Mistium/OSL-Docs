# function() / def()

Functions and lambdas in OSL are defined using the `function` or `def` keyword with parameter syntax and a body.

## Syntax

```javascript
myFunc = function(params) -> ( body )

myFunc = def(params) -> ( body )
```

## Parameters

- `params`: Parameter names (can be zero or more, comma-separated)
- `body`: The function body containing the logic to execute

## Return Value

Returns a callable function object.

## Usage

### Single Parameter

```javascript
add10 = def(v) -> ( v + 10 )

log add10(5)
// 15
```

### Multiple Parameters

```javascript
add = def(a, b) -> ( a + b )

log add(3, 7)
// 10
```

### No Parameters

```javascript
greet = def() -> ( "Hello" )

log greet()
// Hello
```

### Multi-line Body

```javascript
calculate = def(x) -> (
  squared = x * x
  squared + 10
)

log calculate(5)
// 35
```

## Notes

- Both `function` and `def` keywords work identically for defining lambdas
- The arrow `->` separates parameters from the body
- The body can be a single expression or multiple statements in parentheses
- Functions are first-class values and can be passed as arguments or stored in variables
