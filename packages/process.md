# process

Use `process` to run commands, manage child processes, and read the current program's arguments,
working directory and IDs.

```osl
import "std:process"
```

## Example

```osl
import "std:process"

auto out = process.run("git", ["status", "--short"], {timeout: 5000})
if out.ok (
  log out.stdout
) else (
  log "git failed with code " ++ out.code ++ ": " ++ out.stderr
)

string version = process.exec("go", "version")
log version.trim()
```

Commands run directly, with no shell, so arguments are never re-parsed. To use shell syntax such as
pipes, run the shell yourself: `process.run("sh", ["-c", "ls | wc -l"])`.

## Running commands

| Function | Returns | Notes |
| --- | --- | --- |
| `process.run(command, args, options?)` | `result<object, error>` | Runs a command to completion and returns an [output record](#output-records). A non-zero exit is not an error unless `check` is set. |
| `process.exec(command, ...args)` | `result<string, error>` | Runs a command and returns its stdout as is, trailing newline included. Fails with `RuntimeError` (with the command's stderr in the message) on a non-zero exit, and `IOError` when stdout passes 16 MiB. |
| `process.start(command, args, options?)` | `result<*process.Child, error>` | Starts a command in the background. Takes the `maxOutput`, `cwd`, `env` and `input` options. |

Options for `run` and `start`:

| Option | Default | Meaning |
| --- | --- | --- |
| `timeout` | `0` (none) | Milliseconds before the process is killed and `run` fails with `TimeoutError`. `run` only. |
| `maxOutput` | 16 MiB | Bytes kept from each of stdout and stderr. Output past it is dropped and `truncated` is `true`. |
| `cwd` | current directory | Working directory for the command. |
| `env` | none | Variables added to the current environment. |
| `input` | none | Text sent to the command's stdin. |
| `check` | `false` | Fail with `RuntimeError` on a non-zero exit. `run` only. |

`run`, `exec` and `start` fail with `NotFoundError` when the command doesn't exist and
`PermissionError` when it can't be run.

```osl
auto sorted = process.run("sort", [], {input: "pear\napple\n"})
log sorted.stdout

process.run("make", ["test"], {cwd: "server", check: true})
```

### Output records

`process.run` and `child.wait()` return:

| Key | Type | Meaning |
| --- | --- | --- |
| `ok` | `boolean` | The exit code was 0 |
| `code` | `int` | The exit code, or `-1` when a signal killed the process |
| `stdout` | `string` | Captured standard output |
| `stderr` | `string` | Captured standard error |
| `truncated` | `boolean` | Output went past `maxOutput` |

## Child processes

`process.start` returns a `*process.Child` handle. Its output is collected for `wait()`.

```osl
auto server = process.start("python3", ["-m", "http.server", "8000"])
log "started " ++ server.pid()

wait 2
server.signal("TERM")
log server.wait().code
```

| Method | Returns | Notes |
| --- | --- | --- |
| `child.pid()` | `int` | The process ID. |
| `child.isRunning()` | `boolean` | Whether the process hasn't exited yet. |
| `child.wait()` | `object` | Blocks until the process exits and returns its [output record](#output-records). Calling it again returns the same record. |
| `child.kill()` | `result<unit, error>` | Stops the process immediately (`SIGKILL`). Fails with `StateError` when it has already exited. |
| `child.signal(name)` | `result<unit, error>` | Sends `"INT"`, `"TERM"`, `"KILL"`, `"HUP"` or `"QUIT"` (a `SIG` prefix is allowed). Throws `ValueError` for another name; fails with `StateError` when the process has exited. |
| `child.close()` | `void` | Kills the process if it is still running and waits for it. Closing again does nothing. |

## Other processes

| Function | Returns | Notes |
| --- | --- | --- |
| `process.kill(pid)` | `result<unit, error>` | Stops a process immediately (`SIGKILL`). Fails with `NotFoundError` when it doesn't exist and `PermissionError` when it belongs to another user. Throws `ValueError` for a `pid` of 0 or less. |
| `process.signal(pid, name)` | `result<unit, error>` | Sends a signal by name, as for `child.signal`. Fails like `process.kill`. |
| `process.isRunning(pid)` | `boolean` | Whether a process with this ID exists, including other users' processes. |
| `process.list()` | `result<object[], error>` | Every running process, read from `ps` (macOS, Linux and other Unix systems). Fails with `NotFoundError` when `ps` isn't available. |

Each `process.list()` record has these keys:

| Key | Type | Meaning |
| --- | --- | --- |
| `pid`, `ppid` | `int` | Process and parent process ID |
| `user` | `string` | Owner |
| `cpu`, `mem` | `number` | Percent of CPU and memory |
| `rssBytes`, `vszBytes` | `int` | Resident and virtual memory, in bytes |
| `stat` | `string` | Process state, as `ps` prints it |
| `start` | `string` | Start time as `ps aux` prints it: `"15:04"` today, `"Oct06"` this year, otherwise the year |
| `startTime` | `int` | Start time in unix milliseconds |
| `time` | `string` | CPU time, as `ps` prints it |
| `command` | `string` | The command line |

```osl
for p in process.list() (
  if p.command.contains("node") ( log p.pid ++ " uses " ++ p.rssBytes ++ " bytes" )
)
```

## This program

| Function | Returns | Notes |
| --- | --- | --- |
| `process.pid()` | `int` | This program's process ID. |
| `process.ppid()` | `int` | The ID of the process that started this one. |
| `process.args()` | `string[]` | The arguments the program was started with, without the program itself. |
| `process.executable()` | `result<string, error>` | The path of the running program. Fails with `IOError` when the OS can't report it. |
| `process.cwd()` | `result<string, error>` | The working directory. Fails with `NotFoundError` when it has been deleted. |
| `process.chdir(path)` | `result<unit, error>` | Changes the working directory for the whole program. Fails with `NotFoundError` when `path` doesn't exist and `IOError` when it isn't a directory. |
| `process.cpuTime()` | `number` | CPU time used so far, user and system combined, in milliseconds. |
| `process.exit(code)` | `void` | Ends the program immediately. Deferred blocks don't run. |

With `osl run`, pass program arguments after `--`: `osl run app.osl -- --port 8080`.

## Deprecated

These still work for one release, with an `OSL-DEPRECATED` warning at each call. The old forms
return `false`, `""`, `0` or objects with `success` and `error` keys on failure instead of a result.

| Deprecated | Use instead |
| --- | --- |
| `process.spawn(command, ...args)` and its `run`, `start`, `wait`, `kill`, `signal`, `isRunning`, `getPID` methods | `process.run(command, args, options?)`, or `process.start(command, args, options?)` and the `*process.Child` methods |
| `p.runLimited(maxBytes)` | `process.run(command, args, {maxOutput: bytes})` |
| `p.runTimeout(seconds)` | `process.run(command, args, {timeout: milliseconds})` |
| `p.runTimeoutLimited(seconds, maxBytes)` | `process.run(command, args, {timeout, maxOutput})` |
| `process.spawnShell(command)` | `process.run("sh", ["-c", command])` |
| `process.background(command, ...args)` | `process.start(command, args)` |
| `process.daemonize(command, ...args)` | `process.start(command, args)` and `process.exit(0)` |
| `process.pipe(p1, p2)` | `process.run(command, args, {input: text})`, or `process.run("sh", ["-c", "a \| b"])` |
| `process.waitPID(pid)` | `process.start(command, args)` and `child.wait()` |
| `process.execAsUser(user, command, ...args)` | `process.run("sudo", ["-u", user, command, ...])` |
| `process.fork()` | `process.start(process.executable(), process.args())`; `fork` always fails with `UnsupportedError` |
| `process.getPID()`, `process.getPPID()` | `process.pid()`, `process.ppid()` |
| `process.killPID(pid)` | `process.kill(pid)` |
| `process.signalPID(pid, sig)` | `process.signal(pid, name)` |
| `process.isPIDRunning(pid)` | `process.isRunning(pid)` |
| `process.findByPID(pid)`, `process.findByName(name)` | `process.list()`, filtered by `pid` or `command` |
| `process.killByName(name)` | `process.list()` and `process.kill(pid)` |
| `process.environment()` | `env.all()` |
| `process.getEnvironment(key)` | `env.get(key)` |
| `process.setEnvironment(key, value)` | `env.set(key, value)` |
| `process.workingDir()` | `process.cwd()` |
| `process.setWorkingDir(path)` | `process.chdir(path)` |
| `process.getArguments()` | `process.args()`, which leaves out the program |
| `process.getArg(index)` | `process.args()[index]` |
| `process.getExecutablePath()` | `process.executable()` |
| `process.getMemoryMB()` | `mem.stats().sys`, in bytes |
| `process.getCPUTime()` | `process.cpuTime()`, in milliseconds |
| `process.getNumGoroutines()` | `mem.stats().goroutines` |
| `process.getNumCPU()` | `sys.cpus()` |
| `process.setNumCPU(n)` | No replacement |
| `process.sleep(seconds)` | The `wait` statement, as in `wait 0.5` |
| `process.getExitCode()` | No replacement; it always throws `UnsupportedError` |
| Record keys `rss`, `vsz` from `process.list()` (kilobyte strings) | `rssBytes`, `vszBytes` |

## Behavior and limits

The older `import "osl/process"` spelling still works, with a migration warning.

When output passes `maxOutput`, the captured text is the exact prefix and `truncated` is `true`; `ok`
still reflects only the exit code. A timed-out process is killed and reaped before `run` fails.
`process.chdir` affects every thread, and relative paths everywhere resolve against the new
directory.
