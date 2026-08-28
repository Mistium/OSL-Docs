# process

Use `process` to spawn external commands, capture output, stream input, manage environment variables, and signal processes.

```osl
import "std:process"
```

## Example

```osl
import "std:process"

auto p = process.spawn("echo", "hello")
log p.run().output
```

## API reference

### `process`

| Method | Returns | Notes |
| --- | --- | --- |
| `process.spawn(command: any, ...args: any)` | `*Process` | Creates a process handle without starting it. |
| `process.spawnShell(command: any)` | `*Process` |  |
| `process.getPID()` | `number` | Returns pid. |
| `process.getPPID()` | `number` | Returns ppid. |
| `process.killPID(pid: any)` | `boolean` |  |
| `process.signalPID(pid: any, sig: any)` | `boolean` |  |
| `process.isPIDRunning(pid: any)` | `boolean` |  |
| `process.list()` | `array` | Lists processes with a 16 MiB command-output limit. Returns an empty array if discovery fails or exceeds the limit. |
| `process.findByPID(pid: any)` | `object` |  |
| `process.findByName(name: any)` | `array` |  |
| `process.killByName(name: any)` | `number` |  |
| `process.environment()` | `object` |  |
| `process.setEnvironment(key: any, value: any)` | `boolean` | Sets environment. |
| `process.getEnvironment(key: any)` | `string` | Returns environment. |
| `process.workingDir()` | `string` |  |
| `process.setWorkingDir(path: any)` | `boolean` | Sets working dir. |
| `process.getArguments()` | `array` | Returns arguments. |
| `process.getArg(index: any)` | `string` | Returns arg. |
| `process.getExecutablePath()` | `string` | Returns executable path. |
| `process.exec(command: any, ...args: any)` | `string` | Runs a command through `sys.cmd`, returning at most 16 MiB of stdout or an empty string. |
| `process.execAsUser(user: any, command: any, ...args: any)` | `string` | Runs a command through `sudo` with a 16 MiB combined-output limit. |
| `process.pipe(process1: *Process, process2: *Process)` | `boolean` |  |
| `process.background(command: any, ...args: any)` | `*Process` |  |
| `process.daemonize(command: any, ...args: any)` | `boolean` |  |
| `process.fork()` | `object` |  |
| `process.waitPID(pid: any)` | `object` |  |
| `process.getMemoryMB()` | `number` | Returns memory mb. |
| `process.getCPUTime()` | `number` | Returns cputime. |
| `process.getNumGoroutines()` | `number` | Returns num goroutines. |
| `process.getNumCPU()` | `number` | Returns num cpu. |
| `process.setNumCPU(n: any)` | `void` | Sets num cpu. |
| `process.sleep(seconds: any)` | `number` |  |
| `process.exit(code: any)` | `void` |  |
| `process.getExitCode()` | `number` | Returns exit code. |

### `Process` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.run()` | `object` | Runs the process and captures at most 16 MiB of combined output. |
| `value.runLimited(maxBytes: any)` | `object` | Runs with a combined-output limit. Nonpositive values use 16 MiB; values above 1 GiB use 1 GiB. |
| `value.runTimeout(timeout: any)` | `object` | Runs for at most 300 seconds, captures at most 16 MiB of combined output, and always reaps the child; nonpositive timeouts use one millisecond. |
| `value.runTimeoutLimited(timeout: any, maxBytes: any)` | `object` | Combines the timeout and output limits from `runTimeout` and `runLimited`. |
| `value.start()` | `boolean` | Starts the resource. |
| `value.wait()` | `object` | Waits for a started process and returns the same lifecycle result shape as `run`. |
| `value.kill()` | `boolean` | Kills the running process. |
| `value.signal(sig: any)` | `boolean` | Sends a signal to the running process. |
| `value.isRunning()` | `boolean` | Reports whether the process is running. |
| `value.getPID()` | `number` | Returns the process ID, or `0` before start. |

## Notes

- Prefer `import "std:process"`; the older `import "osl/process"` spelling remains supported.

## Behavior and limits

Missing commands, failed starts, timeouts, invalid process IDs, and repeated `wait`, `kill`, or
`signal` calls return failure values instead of panicking.
Run results include `timeout` and `truncated` flags. When output exceeds its limit, `output` contains
the exact captured prefix, `truncated` is `true`, and `success` is `false` even when the child exits zero.
Only one call may start or wait on a given `Process` at a time. `kill`, `signal`, `isRunning`, and
`getPID` remain available while `run` waits.
