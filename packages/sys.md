# sys

> System info, environment, and running shell commands

Use `sys` for process arguments, environment variables, working directories, process IDs, shell commands, and opening URLs.

```javascript
import "std:sys"
```

## Example

```javascript
import "std:sys"

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
| `sys.unsetEnv(key: string)` | `boolean` | Removes an environment variable. |
| `sys.getCwd()` | `string` | Returns cwd. |
| `sys.chdir(path: string)` | `boolean` | Runs the chdir operation. |
| `sys.getPid()` | `number` | Returns pid. |
| `sys.getPpid()` | `number` | Returns ppid. |
| `sys.getUid()` | `number` | Returns uid. |
| `sys.getGid()` | `number` | Returns gid. |
| `sys.getUsername()` | `string` | Returns the username through the shared current-user lookup. |
| `sys.getHomeDir()` | `string` | Returns the home directory through the shared current-user lookup. |
| `sys.cmd(cmd: string, ...args: string)` | `string` | Runs a command with arguments forwarded directly. Returns stdout up to 16 MiB, or an empty string on command failure or excess output. |
| `sys.getExecutablePath()` | `string` | Returns executable path. |
| `sys.openURL(url: string)` | `boolean` | Opens a validated URL using the exact platform command. |

## Notes

- Prefer `import "std:sys"`; the older `import "osl/sys"` spelling remains supported.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

## Edge-case behavior

Environment and working-directory changes are synchronized. UID/GID zero is
reported correctly, and `openURL` rejects malformed or unsupported URLs.
