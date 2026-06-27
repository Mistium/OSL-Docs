# process

> Spawn, manage and signal processes

Use `process` to spawn external commands, capture output, stream input, manage environment variables, and signal processes.

```javascript
import "osl/process"
```

## Example

```javascript
import "osl/process"

auto p = process.run("echo", ["hello"])
log p.stdout
```

## API reference

### `process`

| Method | Returns | Description |
| --- | --- | --- |
| `process.spawn(command: any, ...args: any)` | `*Process` | Runs the spawn operation. |
| `process.spawnShell(command: any)` | `*Process` | Runs the spawn shell operation. |
| `process.getPID()` | `number` | Returns pid. |
| `process.getPPID()` | `number` | Returns ppid. |
| `process.killPID(pid: any)` | `boolean` | Runs the kill pid operation. |
| `process.signalPID(pid: any, sig: any)` | `boolean` | Runs the signal pid operation. |
| `process.isPIDRunning(pid: any)` | `boolean` | Reports whether pidrunning. |
| `process.list()` | `array` | Runs the list operation. |
| `process.findByPID(pid: any)` | `object` | Runs the find by pid operation. |
| `process.findByName(name: any)` | `array` | Runs the find by name operation. |
| `process.killByName(name: any)` | `number` | Runs the kill by name operation. |
| `process.environment()` | `object` | Runs the environment operation. |
| `process.setEnvironment(key: any, value: any)` | `boolean` | Sets environment. |
| `process.getEnvironment(key: any)` | `string` | Returns environment. |
| `process.workingDir()` | `string` | Runs the working dir operation. |
| `process.setWorkingDir(path: any)` | `boolean` | Sets working dir. |
| `process.getArguments()` | `array` | Returns arguments. |
| `process.getArg(index: any)` | `string` | Returns arg. |
| `process.getExecutablePath()` | `string` | Returns executable path. |
| `process.exec(command: any, ...args: any)` | `string` | Runs the exec operation. |
| `process.execAsUser(user: any, command: any, ...args: any)` | `string` | Runs the exec as user operation. |
| `process.pipe(process1: *Process, process2: *Process)` | `boolean` | Runs the pipe operation. |
| `process.background(command: any, ...args: any)` | `*Process` | Runs the background operation. |
| `process.daemonize(command: any, ...args: any)` | `boolean` | Runs the daemonize operation. |
| `process.fork()` | `object` | Runs the fork operation. |
| `process.waitPID(pid: any)` | `object` | Runs the wait pid operation. |
| `process.getMemoryMB()` | `number` | Returns memory mb. |
| `process.getCPUTime()` | `number` | Returns cputime. |
| `process.getNumGoroutines()` | `number` | Returns num goroutines. |
| `process.getNumCPU()` | `number` | Returns num cpu. |
| `process.setNumCPU(n: any)` | `void` | Sets num cpu. |
| `process.sleep(seconds: any)` | `number` | Runs the sleep operation. |
| `process.exit(code: any)` | `void` | Runs the exit operation. |
| `process.getExitCode()` | `number` | Returns exit code. |

### `Process` values

Methods available on `Process` values returned by this package or constructed by the language.

| Method | Returns | Description |
| --- | --- | --- |
| `value.run()` | `object` | Runs the run operation. |
| `value.start()` | `boolean` | Starts the resource. |
| `value.wait()` | `object` | Runs the wait operation. |
| `value.kill()` | `boolean` | Runs the kill operation. |
| `value.signal(sig: any)` | `boolean` | Runs the signal operation. |
| `value.isRunning()` | `boolean` | Reports whether running. |
| `value.getPID()` | `number` | Returns pid. |

## Notes

- Standard-library imports accept both `import "osl/process"` and `import "process"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
