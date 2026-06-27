# lua

> Execute and run Lua scripts using gopher-lua

```javascript
import "osl/lua"
```

## Methods

- `lua.create()` → `State`
- `lua.doString(code)` → `State`
- `lua.run(code)` → `Result`
- `lua.runFile(path)` → `object`
- `lua.get(code, name)` → `any`
- `lua.eval(code)` → `any`
- `lua.newTable()` → `any`
- `lua.version()` → `string`

## Returned object: `State`

Returned by `lua` methods; call these on the value you get back.

- `state.close()`
- `state.doString(code)` → `boolean`
- `state.doFile(path)` → `boolean`
- `state.getGlobal(name)` → `any`
- `state.setGlobal(name, value)`
- `state.register(name, fn)`
- `state.call(funcName, ...args)` → `any`
- `state.getError()` → `string`
- `state.loadString(code)` → `boolean`
- `state.loadFile(path)` → `boolean`
