---
description: Embed Lua 5.1 in an OSL program, from one-off expressions to long-lived interpreters that share data and functions with your code.
package: lua
---

# lua

`std:lua` runs Lua 5.1 code (with gopher-lua, a Lua interpreter written in Go). Use it to give your program a scripting language for rules, configuration, plugins or game logic that people can change without recompiling. You can run a snippet and take its value, or keep an interpreter alive, share data with it and call functions in both directions.

> [!warning]
> Lua code gets the whole standard library, `os` and `io` included, so it can read files and run commands. Don't run code you don't trust. [js](js.md) runs JavaScript in a real sandbox if you need one.

## One-off code

`lua.eval(code)` runs code in a fresh interpreter and returns a result holding its value. The value is that of a single expression, or what a chunk returns:

```osl
import "std:lua"

log lua.eval("1 + 2").unwrap()
log lua.eval("local x = 2 return x * 3").unwrap()
log lua.version()
```

```output
3
6
Lua 5.1 (gopher-lua)
```

Lua tables convert to OSL values: a table with keys 1 to n becomes an array, any other table an object.

```osl
import "std:lua"

log lua.eval("{1, 2, 3}").unwrap()
log lua.eval("{name = 'Ada', n = 3}").unwrap()
```

```output
[1,2,3]
{"n":3,"name":"Ada"}
```

`lua.run(code)` runs code for its effects and returns nothing, and `lua.evalFile(path)` runs a file.

## Failures are results

Every call returns a result. The error kinds are `ParseError` for a syntax error, `RuntimeError` for an error the code raises, `TimeoutError` when it runs too long, and `ValueError` for source over 16 MiB:

```osl
import "std:lua"

auto syntax = lua.run("x = ")
log syntax.unwrapErr().kind

auto raised = lua.run("error('boom')")
log raised.unwrapErr().kind
log raised.unwrapErr().message

auto endless = lua.run("while true do end", {timeout: 100})
log endless.unwrapErr().kind
```

```output
ParseError
RuntimeError
lua.run: <string>:1: boom
TimeoutError
```

The default `timeout` is 5000 milliseconds. Set it per call, or for a whole interpreter in `lua.new`.

## An interpreter that keeps its state

`lua.new()` starts an interpreter whose globals survive between calls. `state.run` defines things, `state.eval` evaluates, `state.get` reads a global, and `state.call(name, args...)` calls a Lua function with each argument as its own value and returns its first result:

```osl
import "std:lua"

*lua.State state = lua.new()
state.run("count = 0 function add(a, b) count = count + 1 return a + b end").unwrap()

log state.call("add", 2, 3).unwrap()
log state.call("add", 10, 5).unwrap()
log state.get("count")

log state.call("missing").unwrapErr().kind
state.close()
```

```output
5
15
2
NotFoundError
```

Close a state when you're done. Using a closed state throws a `StateError`.

## Sending data in

`state.set(name, value)` sets a global to a copy of an OSL value: arrays become tables with keys 1 to n, and objects become tables with string keys. Changes Lua makes to its copy don't reach your variable:

```osl
import "std:lua"

*lua.State state = lua.new()
state.set("items", [10, 20, 30])
state.set("config", {mode: "fast", limit: 5})

log state.eval("#items").unwrap()
log state.eval("config.mode").unwrap()

state.run("total = 0 for _, n in ipairs(items) do total = total + n end").unwrap()
log state.get("total")
state.close()
```

```output
3
fast
60
```

Lua arrays are 1-based like OSL's, so `items[1]` is 10 in both.

## Letting Lua call your functions

`state.register(name, fn)` makes an OSL function callable from Lua. Arguments and return values are converted both ways. This is how a script reaches the rest of your program, and the way to limit what it can do: offer only the functions you choose.

```osl
import "std:lua"

def discount(number price, number percent) number -> (price * (100 - percent)) / 100

*lua.State state = lua.new()
state.register("discount", discount)

log state.eval("discount(80, 25)").unwrap()
state.run("function price(base) return discount(base, 10) end").unwrap()
log state.call("price", 200).unwrap()
state.close()
```

```output
60
180
```

An error that a registered function throws becomes a Lua error. Lua's `pcall` can catch it, and otherwise it fails the run, so the caller sees it as an error result:

```osl
import "std:lua"

*lua.State state = lua.new()
state.register("fail", def() ( throw "nope" ))

auto outcome = state.run("fail()")
log outcome.isErr()

log state.eval("select(2, pcall(fail))").unwrap()
state.close()
```

```output
true
<string>:1: RuntimeError: nope
```

## A rule engine

Rules written in Lua (kept in a string here; a real program would read them with `fs.readFile`) applied to your data one at a time:

```osl
import "std:lua"

string rules = `
function shipping(order)
  if order.total >= 100 then return 0 end
  if order.country == "NZ" then return 5 end
  return 12
end
`

*lua.State state = lua.new()
state.run(rules).unwrap()

auto orders = [
  {total: 120, country: "NZ"},
  {total: 40, country: "NZ"},
  {total: 40, country: "AU"}
]
for order in orders (
  log state.call("shipping", order).unwrap()
)
state.close()
```

```output
0
5
12
```

:::quiz
Lua code runs with `lua.eval`. What can it do?

- [ ] Only compute values.
- [x] Everything Lua's standard library allows, including files and commands.
- [ ] Nothing outside its own variables.

The interpreter isn't sandboxed. Run only code you trust, or use `std:js`.
:::

:::exercise title="Call a Lua function"
Define a Lua function `square` and call it with 7 from OSL.

```osl
import "std:lua"

*lua.State state = lua.new()
log state.eval("1 + 1").unwrap()
state.close()
```

```output
49
```

> [!hint]
> `state.run("function square(n) return n * n end")` defines it, and `state.call("square", 7)` calls it.

```osl solution
import "std:lua"

*lua.State state = lua.new()
state.run("function square(n) return n * n end").unwrap()
log state.call("square", 7).unwrap()
state.close()
```

```output
49
```
:::

## API reference

::api
