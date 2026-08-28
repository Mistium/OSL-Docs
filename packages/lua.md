# lua

Use `lua` to create an embedded Lua state, execute Lua code, register OSL callbacks, and exchange values.

```javascript
import "std:lua"
```

## API reference

### `lua`

| Method | Returns | Description |
| --- | --- | --- |
| `lua.create()` | `*State` | Creates a new value. |
| `lua.doString(code: any)` | `*State` | Creates a state with `lua.create()`, runs code, and returns it. |
| `lua.run(code: any)` | `*Result` | Runs the run operation. |
| `lua.runFile(path: any)` | `object` | Runs a file and returns flat `success` and `error` fields. |
| `lua.get(code: any, name: any)` | `any` | Executes bounded source through the shared run path and returns a global value. |
| `lua.eval(code: any)` | `any` | Evaluates an expression, or executes a statement and returns its result when present. |
| `lua.newTable()` | `any` | Runs the new table operation. |
| `lua.version()` | `string` | Runs the version operation. |
| `lua.runTimeout(code: any, timeout: any)` | `result` | Runs bounded source through the shared state lifecycle and returns an error result on failure. |

### `State` values

| Method | Returns | Description |
| --- | --- | --- |
| `value.close()` | `void` | Closes the resource. |
| `value.doString(code: any)` | `boolean` | Runs the do string operation. |
| `value.doFile(path: any)` | `boolean` | Runs the do file operation. |
| `value.getGlobal(name: any)` | `any` | Returns global. |
| `value.setGlobal(name: any, value: any)` | `void` | Sets global. |
| `value.register(name: any, fn: any)` | `void` | Runs the register operation. |
| `value.call(funcName: any, ...args: any)` | `any` | Runs the call operation. |
| `value.getError()` | `string` | Returns error. |
| `value.loadString(code: any)` | `boolean` | Loads string. |
| `value.loadFile(path: any)` | `boolean` | Loads file. |

## Notes

- Prefer `import "std:lua"`; the older `import "osl/lua"` spelling remains supported.

## Edge-case behavior

Lua execution has a finite default timeout and bounded source size. A timed-out
state can be reused or closed safely. Evaluation uses the same bounded execution
path for expressions, setup-and-return snippets, and statement fallback.
