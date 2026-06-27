# `.bind(...args)`

`.bind` performs **partial application**: it returns a new function with the given arguments
pre-filled from the left. Calling the new function supplies the remaining arguments.

OSL has no `this`, so `.bind` is about fixing arguments, not rebinding a context.

```javascript
auto add = (a, b) -> a + b
auto add10 = add.bind(10)   // a is fixed to 10

log add10.call(5)  // 15
log add10.call(1)  // 11
```

## Parameters

Any number of leading arguments to fix. `f.bind()` with no arguments returns an equivalent function.

## Return value

A new function. The original is untouched. The bound function can be called with
[`.call(...)`](README.md) or, if it is held in a plain variable, directly.

```javascript
add5 = (a, b, c) -> a + b + c
addBound = add5.bind(1, 2)   // a=1, b=2 fixed
log addBound(3)              // 6
```

## Chaining

`.bind` can be chained — each call fixes the next leading argument:

```javascript
auto add3 = (a, b, c) -> a + b + c
auto step = add3.bind(1).bind(2)  // a=1, then b=2
log step.call(3)                  // 6
```

## Works on any function value

`.bind` (like `.call`) works on function values of any type — `auto`/unknown values, lambdas with a
concrete signature, named functions, and functions returned from `.bind` itself.

```javascript
mul = (a, b) -> a * b
dbl = mul.bind(2)
log [1, 2, 3].map(x -> dbl.call(x))  // [2, 4, 6]
```

> Calling `.bind` on a non-function value is a `TypeError`.
