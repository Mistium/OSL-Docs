# sys

Use `sys` for information about the operating system, machine and user, and to open URLs in the
default app.

```osl
import "std:sys"
```

For the program's own arguments, working directory and process IDs, use [`process`](process.md).
For environment variables, use [`env`](env.md).

## Example

```osl
import "std:sys"

log sys.os() ++ "/" ++ sys.arch() ++ ", " ++ sys.cpus() ++ " CPUs"
log "user " ++ sys.username() ++ ", home " ++ sys.homeDir()

if (sys.uid() ?? -1) == 0 ( log "running as root" )
```

## API reference

| Function | Returns | Notes |
| --- | --- | --- |
| `sys.os()` | `string` | The operating system: `"linux"`, `"darwin"` (macOS), `"windows"`, `"freebsd"` and so on. |
| `sys.arch()` | `string` | The processor architecture, such as `"amd64"` or `"arm64"`. |
| `sys.cpus()` | `int` | The number of logical CPUs. |
| `sys.hostname()` | `result<string, error>` | The machine's host name. Fails with `IOError` when the OS can't report it. |
| `sys.username()` | `result<string, error>` | The name of the user running the program. Fails with `NotFoundError` when the OS has no record of the user. |
| `sys.homeDir()` | `result<string, error>` | The current user's home directory. Fails with `NotFoundError` when it isn't known. |
| `sys.uid()` | `int?` | The user's numeric ID, or `null` on Windows. |
| `sys.gid()` | `int?` | The user's numeric group ID, or `null` on Windows. |
| `sys.openURL(url)` | `result<unit, error>` | Opens a URL, or a file given as a `file://` URL, in the default app without waiting for it. Fails with `ParseError` when `url` has no scheme or contains control characters, and `NotFoundError` when the system opener (`open`, `xdg-open` or `rundll32`) isn't available. |

`uid` and `gid` are nullable, so compare them through a fallback such as `(sys.uid() ?? -1) == 0`;
comparing an `int?` directly with `0` is a compile error.

## Deprecated

These still work for one release, with an `OSL-DEPRECATED` warning at each call. The old forms
return `""` or `false` on failure instead of a result.

| Deprecated | Use instead |
| --- | --- |
| `sys.getArgs()` | `process.args()`, which leaves out the program |
| `sys.getEnv(key)` | `env.get(key)` |
| `sys.setEnv(key, value)` | `env.set(key, value)` |
| `sys.unsetEnv(key)` | `env.unset(key)` |
| `sys.getCwd()` | `process.cwd()` |
| `sys.chdir(path)` | `process.chdir(path)` |
| `sys.getPid()` | `process.pid()` |
| `sys.getPpid()` | `process.ppid()` |
| `sys.getUid()`, `sys.getGid()` | `sys.uid()`, `sys.gid()` |
| `sys.getUsername()` | `sys.username()` |
| `sys.getHomeDir()` | `sys.homeDir()` |
| `sys.cmd(cmd, ...args)` | `process.exec(command, ...args)` |
| `sys.getExecutablePath()` | `process.executable()` |

## Behavior and limits

The older `import "osl/sys"` spelling still works, with a migration warning.

`openURL` passes the URL to the opener as a single argument, never through a shell, and reaps the
opener process once it exits.
