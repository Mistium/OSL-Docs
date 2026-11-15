---
description: Run JavaScript from OSL in a sandboxed QuickJS runtime with a time limit and a memory cap, and get the result back as an OSL value.
package: js
---

# js

`std:js` runs JavaScript code inside your program. It uses QuickJS, a small JavaScript engine, in a sandbox: the code can't reach files, the network or your program, it has a time limit and a memory cap, and each call starts with a fresh runtime. The value of the last expression comes back to OSL.

Reach for it to run a user's formula or rule, reuse a small JavaScript library on data you pass in, or evaluate a configuration file written as JavaScript, without trusting the code. For Lua, see [lua](lua.md).

## Evaluating an expression

`js.evaluate(code)` returns a result. On success it holds the value of the last expression:

```osl
import "std:js"

log js.evaluate("1 + 2").unwrap()
log js.evaluate("'x'.repeat(3)").unwrap()
log js.evaluate("[1, 2, 3].reduce((a, b) => a + b)").unwrap()
```

```output
3
xxx
6
```

Code can be a whole program. Whatever its last expression evaluates to is the result:

```osl
import "std:js"

string code = `
  const fib = n => n < 2 ? n : fib(n - 1) + fib(n - 2);
  fib(20)
`
log js.evaluate(code).unwrap()
```

```output
6765
```

## How values convert

The value crosses over as JSON. Numbers, strings, booleans and `null` keep their type, arrays become OSL arrays and objects become OSL objects. `undefined` becomes `null`, and a promise is waited for:

```osl
import "std:js"

auto value = js.evaluate(`({name: "Ada", tags: ["a", "b"], n: null, u: undefined})`).unwrap()
log value.name
log value.tags.len
log value

log js.evaluate("[1, 2, 3].map(n => n * 2)").unwrap()
log js.evaluate("undefined").unwrap()
log js.evaluate("Promise.resolve(5)").unwrap()
```

```output
Ada
2
{"n":null,"name":"Ada","tags":["a","b"]}
[2,4,6]
null
5
```

Because a result is JSON, functions, dates and class instances do not survive the trip: turn them into plain data inside the JavaScript first.

## Passing data in

A run has no variables from your program. Pass data by writing it into the code as JSON, which is valid JavaScript. Build the text with `json.stringify` so quotes and special characters are escaped properly, never by pasting raw strings:

```osl
import "std:js"
import "std:json"

string[] names = ["Ada", "Grace", "Linus"]
string code = "const names = " ++ json.stringify(names) ++ "; names.filter(n => n.length > 3).map(n => n.toUpperCase())"
log js.evaluate(code).unwrap()
```

```output
["GRACE","LINUS"]
```

A user-written formula works the same way: give the formula and its inputs in one program.

```osl
import "std:js"
import "std:json"

def calculate(string formula, object inputs) result<any, error> (
  string code = "const input = " ++ json.stringify(inputs) ++ "; (" ++ formula ++ ")"
  return js.evaluate(code)
)

log calculate("input.price * input.quantity * 1.2", {price: 10, quantity: 3}).unwrap()
log calculate("input.price *", {price: 10}).isErr()
```

```output
36
true
```

## When the code fails

Every failure is an error with a kind. `ParseError` is a syntax error, `RuntimeError` is an exception the code threw (or running out of memory), and `TimeoutError` means it ran too long:

```osl
import "std:js"

auto syntax = js.evaluate("let = ;")
log syntax.unwrapErr().kind

auto thrown = js.evaluate("throw new Error('boom')")
log thrown.unwrapErr().kind
log thrown.unwrapErr().message
```

```output
ParseError
RuntimeError
js.evaluate: Error: boom
```

## Limits

`timeout` (milliseconds, default 60000) and `memoryLimit` (bytes, default 1048576, one mebibyte) bound each run. Use a short timeout for code you don't trust, so an endless loop can't hold your program:

```osl
import "std:js"

auto endless = js.evaluate("while (true) {}", {timeout: 100})
log endless.unwrapErr().kind

auto big = js.evaluate("new Array(10000000).fill(1)", {memoryLimit: 100000})
log big.unwrapErr().kind
```

```output
TimeoutError
RuntimeError
```

A timeout or memory limit of 0 or less throws a `ValueError`.

## What the sandbox lacks

The code has the JavaScript language and its built-ins (`JSON`, `Math`, `Array`, `Promise` and so on), and nothing else. There is no `require`, `fetch` or `process`, no files and no network:

```osl
import "std:js"

log js.evaluate("typeof require + ' ' + typeof fetch + ' ' + typeof process").unwrap()
```

```output
undefined undefined undefined
```

> [!note]
> `typeof` on a name that doesn't exist is `"undefined"`, which is how the code above probes for them without throwing.

:::quiz
JavaScript code in `js.evaluate` runs an endless loop. What happens?

- [ ] Your program hangs.
- [x] It stops with a `TimeoutError` result once the timeout passes.
- [ ] The loop is skipped.

The default timeout is a minute. Pass a shorter `timeout` for code you don't trust.
:::

:::exercise title="Evaluate a rule"
Run the JavaScript `[3, 1, 2].sort().join("-")` and print the result.

```osl
import "std:js"

log js.evaluate("1 + 1").unwrap()
```

```output
1-2-3
```

> [!hint]
> The last expression's value comes back, here a string.

```osl solution
import "std:js"

log js.evaluate("[3, 1, 2].sort().join('-')").unwrap()
```

```output
1-2-3
```
:::

## API reference

::api
