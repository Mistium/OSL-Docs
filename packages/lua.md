# lua

Use `lua` to run Lua 5.1 code with gopher-lua, either in one-off calls or in a `*lua.State` that
keeps its globals, calls Lua functions, and exposes OSL functions to Lua.

Lua code gets the whole Lua standard library, including `os` and `io`, so don't run untrusted code
with it. [`js`](js.md) runs JavaScript in a sandbox.

```osl
import "std:lua"
```

## Example

```osl
import "std:lua"

log lua.eval("1 + 2")                     // 3
log lua.eval("local x = 2 return x * 3")  // 6

*lua.State L = lua.new({timeout: 2000})
defer L.close()

L.set("name", "Ada")
L.register("greet", def(string who) -> ( return "hi " ++ who ))
L.run("function double(n) return n * 2 end")

log L.eval("greet(name)")  // hi Ada
log L.call("double", 21)   // 42

L.run("x = ") catch (err) (
  log err.kind // ParseError
)
```

## API reference

### `lua`

| Method | Returns | Notes |
| --- | --- | --- |
| `lua.new(options?: object)` | `*lua.State` | Starts an interpreter that keeps its globals between calls. Option: `timeout`, the default limit in milliseconds for each `run`, `eval`, and `call` (default 5000). Close it when done. |
| `lua.run(code: string, options?: object)` | `result<unit, error>` | Runs code in a fresh interpreter. Option: `timeout` in milliseconds (default 5000). |
| `lua.eval(code: string, options?: object)` | `result<any, error>` | Runs code in a fresh interpreter and returns its value. |
| `lua.evalFile(path: string, options?: object)` | `result<any, error>` | Runs a Lua file in a fresh interpreter and returns what it returns, or `null`. |
| `lua.version()` | `string` | The Lua version the interpreter implements, `Lua 5.1 (gopher-lua)`. |

`eval` returns the value of code that is a single expression, as in `lua.eval("1 + 2")`, or what a
chunk returns, as in `"local x = 2 return x * 3"`, or `null`. Code that returns several values gives
the last one. Tables with keys 1 to n become arrays, and other tables become objects.

### `*lua.State`

Every method except `close` throws `StateError` once the state is closed. The `timeout` option
defaults to the one given to `lua.new`.

| Method | Returns | Notes |
| --- | --- | --- |
| `L.run(code: string, options?: object)` | `result<unit, error>` | Runs code in this state, so the globals it sets stay for later calls. |
| `L.eval(code: string, options?: object)` | `result<any, error>` | Runs code in this state and returns its value, like `lua.eval`. |
| `L.runFile(path: string, options?: object)` | `result<unit, error>` | Runs a Lua file in this state. |
| `L.evalFile(path: string, options?: object)` | `result<any, error>` | Runs a Lua file in this state and returns what it returns, or `null`. |
| `L.get(name: string)` | `any` | The value of a global, or `null` when it is nil. |
| `L.set(name: string, value: any)` | `void` | Sets a global to a copy of `value`. Arrays become tables with keys 1 to n, and objects become tables with string keys. |
| `L.call(name: string, ...args)` | `result<any, error>` | Calls the global Lua function `name` and returns its first result, or `null`. |
| `L.register(name: string, fn: function)` | `void` | Makes `fn` callable from Lua as the global function `name`. Arguments and the return value are converted between Lua and OSL. |
| `L.close()` | `void` | Shuts the interpreter down. Closing twice does nothing. |

An error a registered OSL function throws becomes a Lua error. Lua's `pcall` can catch it;
otherwise it fails the run with the error's own kind.

## Errors

The run, eval, and call functions fail with:

- `ParseError` for a Lua syntax error;
- `TimeoutError` when the code runs past its timeout;
- `ValueError` for source over 16 MiB;
- `RuntimeError` when the code raises an error;
- `NotFoundError` or `IOError` when a file can't be read (`evalFile`, `runFile`);
- `NotFoundError` when `call` names something that isn't a global function.

A state stays usable after a timeout.

## Changes from earlier versions

`lua.create`, `lua.doString`, `lua.runTimeout`, `lua.get`, and `lua.newTable` are gone, along with
the `L.doString`, `L.loadString`, `L.doFile`, `L.getGlobal`, `L.setGlobal`, `L.callTimeout`, and
`L.getError` methods. Use `lua.new`, `L.run`, `L.runFile`, `L.get`, and `L.set`, which report
failures with `catch`. Timeouts are in milliseconds. `lua.runFile` is now `lua.evalFile`.

## Notes

- Prefer `import "std:lua"`; the older `import "osl/lua"` spelling remains supported.
