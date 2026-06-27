# sys

> OS utilities

```javascript
import "osl/sys"
```

## Methods

- `sys.getArgs()` → `array`
- `sys.getEnv(key)` → `string`
- `sys.setEnv(key, value)` → `boolean`
- `sys.getCwd()` → `string`
- `sys.chdir(path)` → `boolean`
- `sys.getPid()` → `number`
- `sys.getPpid()` → `number`
- `sys.getUid()` → `number`
- `sys.getGid()` → `number`
- `sys.getUsername()` → `string`
- `sys.getHomeDir()` → `string`
- `sys.cmd(cmd, ...args)` → `string`
- `sys.getExecutablePath()` → `string`
- `sys.openURL(url)` → `boolean`
