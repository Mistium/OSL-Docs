# sys

Use `sys` for process arguments, environment variables, working directories, process IDs, shell commands, and opening URLs.

```osl
import "std:sys"
```

## Example

```osl
import "std:sys"

log sys.getArgs()
log sys.getCwd()
```

## API reference

### `sys`

| Method | Returns | Notes |
| --- | --- | --- |
| `sys.getArgs()` | `array` | Returns args. |
| `sys.getEnv(key: string)` | `string` | Returns env. |
| `sys.setEnv(key: string, value: string)` | `boolean` | Sets env. |
| `sys.unsetEnv(key: string)` | `boolean` | Removes an environment variable. |
| `sys.getCwd()` | `string` | Returns cwd. |
| `sys.chdir(path: string)` | `boolean` |  |
| `sys.getPid()` | `number` | Returns pid. |
| `sys.getPpid()` | `number` | Returns ppid. |
| `sys.getUid()` | `number` | Returns uid. |
| `sys.getGid()` | `number` | Returns gid. |
| `sys.getUsername()` | `string` | Returns the current user's name. |
| `sys.getHomeDir()` | `string` | Returns the current user's home directory. |
| `sys.cmd(cmd: string, ...args: string)` | `string` | Runs a command with arguments forwarded directly. Returns stdout up to 16 MiB, or an empty string on command failure or excess output. |
| `sys.getExecutablePath()` | `string` | Returns executable path. |
| `sys.openURL(url: string)` | `boolean` | Opens a validated URL using the exact platform command. |

## Notes

- Prefer `import "std:sys"`; the older `import "osl/sys"` spelling remains supported.

## Behavior and limits

Environment and working-directory changes are safe across threads. User and group ID `0` is
reported rather than treated as missing. `openURL` rejects malformed URLs and unsupported schemes.
