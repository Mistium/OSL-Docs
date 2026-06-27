# process

> Process management utilities

```javascript
import "osl/process"
```

## Methods

- `process.spawn(command, ...args)` → `Process`
- `process.spawnShell(command)` → `Process`
- `process.getPID()` → `number`
- `process.getPPID()` → `number`
- `process.killPID(pid)` → `boolean`
- `process.signalPID(pid, sig)` → `boolean`
- `process.isPIDRunning(pid)` → `boolean`
- `process.list()` → `array`
- `process.findByPID(pid)` → `object`
- `process.findByName(name)` → `array`
- `process.killByName(name)` → `number`
- `process.environment()` → `object`
- `process.setEnvironment(key, value)` → `boolean`
- `process.getEnvironment(key)` → `string`
- `process.workingDir()` → `string`
- `process.setWorkingDir(path)` → `boolean`
- `process.getArguments()` → `array`
- `process.getArg(index)` → `string`
- `process.getExecutablePath()` → `string`
- `process.exec(command, ...args)` → `string`
- `process.execAsUser(user, command, ...args)` → `string`
- `process.pipe(process1, process2)` → `boolean`
- `process.background(command, ...args)` → `Process`
- `process.daemonize(command, ...args)` → `boolean`
- `process.fork()` → `object`
- `process.waitPID(pid)` → `object`
- `process.getMemoryMB()` → `number`
- `process.getCPUTime()` → `number`
- `process.getNumGoroutines()` → `number`
- `process.getNumCPU()` → `number`
- `process.setNumCPU(n)`
- `process.sleep(seconds)` → `number`
- `process.exit(code)`
- `process.getExitCode()` → `number`

## Returned object: `Process`

Returned by `process` methods; call these on the value you get back.

- `process.run()` → `object`
- `process.start()` → `boolean`
- `process.wait()` → `object`
- `process.kill()` → `boolean`
- `process.signal(sig)` → `boolean`
- `process.isRunning()` → `boolean`
- `process.getPID()` → `number`
