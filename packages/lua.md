# lua

> Embed and run Lua scripts

Use `lua` to create an embedded Lua state, execute Lua code, register OSL callbacks, and exchange values.

```javascript
import "osl/lua"
```

## API reference

### `lua`

| Method | Returns | Description |
| --- | --- | --- |
| `lua.create()` | `*State` | Creates a new value. |
| `lua.doString(code: any)` | `*State` | Runs the do string operation. |
| `lua.run(code: any)` | `*Result` | Runs the run operation. |
| `lua.runFile(path: any)` | `object` | Runs file. |
| `lua.get(code: any, name: any)` | `any` | Returns a value. |
| `lua.eval(code: any)` | `any` | Runs the eval operation. |
| `lua.newTable()` | `any` | Runs the new table operation. |
| `lua.version()` | `string` | Runs the version operation. |

### `State` values

Methods available on `State` values returned by this package or constructed by the language.

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

- Standard-library imports accept both `import "osl/lua"` and `import "lua"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
