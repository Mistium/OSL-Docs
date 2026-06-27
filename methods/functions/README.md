# Functions

In OSL a function is an ordinary value: you can store it in a variable, pass it to other functions and return it. This page covers the methods you call **on** a function value. For how to _define_ functions and lambdas, see [Functions](../../functions-and-classes/functions.md) and [Lambda](../../functions-and-classes/lambda.md).

```javascript
// a function stored in a variable
auto double = x -> x * 2
```

## Methods

#### `.call(...args)` → `unknown`

Invokes the function, passing `args`, and returns its result. This is the way to call a function value whose type is `auto`/unknown.

```javascript
auto double = x -> x * 2
log double.call(5)   // 10

auto add = (a, b) -> a + b
log add.call(3, 4)   // 7
```

`.call` works on any function value - `auto`/unknown values, lambdas with a concrete signature, named functions, and bound functions.

#### `.bind(...args)` → function

Returns a new function with the leading arguments pre-filled (**partial application**). See [`.bind(...args)`](bind.md) for details.

```javascript
auto add10 = add.bind(10)
log add10.call(5)  // 15
```

## Calling functions directly

A **named** function defined with `def` is called by name:

```javascript
def add(a, b) (
  return a + b
)
log add(3, 4)  // 7
```

A function held in a plain (untyped) variable can also be called directly:

```javascript
f = x -> x * 2
log f(5)  // 10
```

> OSL has no `this`. Functions are plain values and **closures** capture the variables in scope where they were defined; object and prototype methods refer to their receiver with `self` (see [Methods](../../functions-and-classes/methods.md)). The [`.bind`](bind.md) method exists, but it does partial application of arguments - it does not rebind a context.

## Passing functions around

Functions are commonly passed to array methods as the transform or predicate:

```javascript
log [1, 2, 3].map(x -> x * 2)        // [2, 4, 6]
log [1, 2, 3, 4].filter(x -> x > 2)  // [3, 4]
```

See [Array methods → Transforming](../arrays/transforming.md).
