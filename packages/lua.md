# lua

Use `lua` to create an embedded Lua state, execute Lua code, register OSL callbacks, and exchange values.

```osl
import "std:lua"
```

## API reference

### `lua`

| Method | Returns | Notes |
| --- | --- | --- |
| `lua.create()` | `*State` |  |
| `lua.doString(code: any)` | `*State` | Creates a state with `lua.create()`, runs code, and returns it. |
| `lua.run(code: any)` | `*Result` |  |
| `lua.runFile(path: any)` | `object` | Runs a file and returns flat `success` and `error` fields. |
| `lua.get(code: any, name: any)` | `any` | Runs the code and returns the named Lua global. |
| `lua.eval(code: any)` | `any` | Evaluates an expression, or executes a statement and returns its result when present. |
| `lua.newTable()` | `any` |  |
| `lua.version()` | `string` |  |
| `lua.runTimeout(code: any, timeout: any)` | `result` | Runs code with a timeout and returns an error result on failure. |

### `State` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.close()` | `void` | Closes the resource. |
| `value.doString(code: any)` | `boolean` |  |
| `value.doFile(path: any)` | `boolean` |  |
| `value.getGlobal(name: any)` | `any` | Returns global. |
| `value.setGlobal(name: any, value: any)` | `void` | Sets global. |
| `value.register(name: any, fn: any)` | `void` |  |
| `value.call(funcName: any, ...args: any)` | `any` |  |
| `value.getError()` | `string` | Returns error. |
| `value.loadString(code: any)` | `boolean` | Loads string. |
| `value.loadFile(path: any)` | `boolean` | Loads file. |

## Notes

- Prefer `import "std:lua"`; the older `import "osl/lua"` spelling remains supported.

## Behavior and limits

Lua execution has a default timeout and a source-size limit. A state remains safe to reuse or close
after a timeout. `eval` first tries an expression, then a setup-and-return snippet, and finally a
statement. All three forms use the same timeout.
