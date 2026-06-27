# sys

> System info, environment, and running shell commands

Use `sys` for process arguments, environment variables, working directories, process IDs, shell commands, and opening URLs.

```javascript
import "osl/sys"
```

## Example

```javascript
import "osl/sys"

log sys.getArgs()
log sys.getCwd()
```

## API reference

### `sys`

| Method | Returns | Description |
| --- | --- | --- |
| `sys.getArgs()` | `array` | Returns args. |
| `sys.getEnv(key: string)` | `string` | Returns env. |
| `sys.setEnv(key: string, value: string)` | `boolean` | Sets env. |
| `sys.getCwd()` | `string` | Returns cwd. |
| `sys.chdir(path: string)` | `boolean` | Runs the chdir operation. |
| `sys.getPid()` | `number` | Returns pid. |
| `sys.getPpid()` | `number` | Returns ppid. |
| `sys.getUid()` | `number` | Returns uid. |
| `sys.getGid()` | `number` | Returns gid. |
| `sys.getUsername()` | `string` | Returns username. |
| `sys.getHomeDir()` | `string` | Returns home dir. |
| `sys.cmd(cmd: string, ...args: string)` | `string` | Runs the cmd operation. |
| `sys.getExecutablePath()` | `string` | Returns executable path. |
| `sys.openURL(url: string)` | `boolean` | Opens url. |

## Notes

- Standard-library imports accept both `import "osl/sys"` and `import "sys"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
