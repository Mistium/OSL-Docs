---
description: Run other programs and read their output, start background jobs, and inspect the current process: its arguments, folder and exit code.
package: process
---

# process

`process` is how a program talks to the operating system's processes. Use it to run other programs (`git`, `ffmpeg`, a shell script) and use what they print, to start a long job in the background, to read the program's own command-line arguments and working directory, and to exit with a status code.

```osl fragment
import "std:process"
```

The examples run in a small sandbox, so they stick to `sh`, `echo`, `printf` and `cat`, which every Unix system has.

## Run a command and get its output

`process.exec(command, args...)` runs a command, waits for it and returns what it printed to standard output, as a [result](../learn/errors.md). Arguments are passed straight to the program, without a shell.

```osl
import "std:process"

string out = process.exec("echo", "hello", "from", "echo").unwrap()
log out.trim()
log out.len
```

```output
hello from echo
16
```

Output keeps its trailing newline, so `trim()` it when you want just the text. Because there is no shell, nothing is interpreted: `*`, `$HOME`, `|` and quotes are plain text.

```osl
import "std:process"

log process.exec("echo", "$HOME", "*", "a|b").unwrap().trim()
```

```output
$HOME * a|b
```

Try it: run `printf` with `"%s-%s"` and two arguments.

## When the command fails

`exec` is strict: a command that exits with a non-zero code is an error (`RuntimeError`), and its standard error becomes the message. A program that doesn't exist is a `NotFoundError`.

```osl
import "std:process"

switch process.exec("sh", "-c", "echo oops >&2; exit 3") (
  case ok(out)
    log "fine"
  case err(e)
    log e.kind ":" e.message.trim()
)

log process.exec("no-such-program-xyz").unwrapErr().kind
```

```output
RuntimeError : process.exec: sh exited with code 3: oops
NotFoundError
```

## Run and inspect how it finished

When you need to know the exit code, or want to treat failure as normal, use `process.run(command, args, options)`. It always returns an object with `ok`, `code`, `stdout`, `stderr` and `truncated`, even when the command fails. Here `args` is an array.

```osl
import "std:process"

auto r = process.run("sh", ["-c", "echo out; echo err >&2; exit 2"]).unwrap()
log r.ok r.code
log r.stdout.trim()
log r.stderr.trim()

auto good = process.run("echo", ["fine"]).unwrap()
log good.ok good.code
```

```output
false 2
out
err
true 0
```

Note the difference: `exec` returns the output text and fails on a bad exit; `run` returns a record and fails only when the program can't be started at all. Use `run` for programs like `grep` or `diff`, where a non-zero code carries meaning.

Try it: change the exit code to 0.

## Options for run

`run` takes options as a third argument:

- `cwd` runs the command in another folder.
- `env` adds environment variables.
- `input` sends text to the program's standard input.
- `timeout` stops a slow command (milliseconds).
- `check` turns a non-zero exit into a `RuntimeError`.
- `maxOutput` caps the bytes kept from each stream.

```osl
import "std:process"
import "std:fs"

fs.remove("work", {force: true}).unwrap()
fs.mkdir("work").unwrap()
fs.writeFile("work/note.txt", "inside work").unwrap()

log process.run("cat", ["note.txt"], {cwd: "work"}).unwrap().stdout
log process.run("sh", ["-c", "echo $GREETING"], {env: {GREETING: "hi there"}}).unwrap().stdout.trim()

auto sorted = process.run("sort", [], {input: "pear\napple\nfig\n"}).unwrap()
log sorted.stdout.split("\n")
```

```output
inside work
hi there
["apple","fig","pear",""]
```

## Timeouts and checks

A command that runs too long is killed, and `run` fails with `TimeoutError`. With `check: true`, a failing exit becomes an error too, so you can pass it up with `!`.

```osl
import "std:process"

auto slow = process.run("sh", ["-c", "sleep 5"], {timeout: 100})
log slow.unwrapErr().kind

auto strict = process.run("sh", ["-c", "exit 4"], {check: true})
log strict.unwrapErr().kind
```

```output
TimeoutError
RuntimeError
```

## Real-world: wrap a tool

Put it together as a function that returns a result, so callers decide how to react:

```osl
import "std:process"

def firstLine(string command, string[] args) result<string, error> (
  auto r = process.run(command, args)!
  if !r.ok return result.err(error(command ++ " exited with " ++ r.code))
  return result.ok(r.stdout.split("\n")[1])
)

log firstLine("printf", ["one\ntwo\n"]).unwrap()
log firstLine("sh", ["-c", "exit 1"]).unwrapErr().message
log firstLine("missing-tool-xyz", []).unwrapErr().kind
```

```output
one
sh exited with 1
NotFoundError
```

## Background processes

`process.start(command, args, options)` starts a command and returns a `Child` handle at once. The program keeps running while yours does other work. `wait()` blocks until it finishes and gives the same record as `run`.

```osl
import "std:process"

auto child = process.start("sh", ["-c", "echo working; sleep 0.2; echo done"]).unwrap()
log "started, pid positive:" (child.pid() > 0)
log "still running:" child.isRunning()
auto done = child.wait()
log done.code
log done.stdout.split("\n")
log child.isRunning()
```

```output
started, pid positive: true
still running: true
0
["working","done",""]
false
```

Start several children, then wait for each, and they run at the same time:

```osl
import "std:process"

*process.Child[] jobs = []
for name in ["a", "b", "c"] (
  jobs.append(process.start("sh", ["-c", "sleep 0.2; echo job " ++ name]).unwrap())
)
for job in jobs (
  log job.wait().stdout.trim()
)
```

```output
job a
job b
job c
```

## Stopping a process

`child.kill()` stops it at once, and `child.signal("TERM")` asks politely (`"INT"`, `"TERM"`, `"KILL"`, `"HUP"` and `"QUIT"` are accepted). A killed process has exit code `-1`. `close()` kills the child if it is still running and waits for it, which makes it a good last line of cleanup.

```osl
import "std:process"

auto child = process.start("sh", ["-c", "sleep 30"]).unwrap()
log child.isRunning()
child.signal("TERM").unwrap()
auto r = child.wait()
log r.ok r.code
log child.signal("TERM").unwrapErr().kind
child.close()
```

```output
true
false -1
StateError
```

## The current program

A few functions describe the program itself. `process.args()` gives the command-line arguments after the program name (none here, because the examples start without any), `process.cwd()` the working directory, and `process.chdir(path)` changes it for the whole program.

```osl
import "std:process"
import "std:fs"

log process.args().len

fs.remove("project", {force: true}).unwrap()
fs.mkdir("project").unwrap()

string start = process.cwd().unwrap()
process.chdir("project").unwrap()
log fs.base(process.cwd().unwrap())
process.chdir(start).unwrap()
log process.chdir("nowhere-at-all").unwrapErr().kind
```

```output
0
project
NotFoundError
```

Process IDs identify running programs. They differ on every run, so print facts about them rather than the numbers:

```osl
import "std:process"

log process.pid() > 0
log process.ppid() > 0
log process.isRunning(process.pid())
log process.cpuTime() >= 0
log process.executable().unwrap().len > 0
```

```output
true
true
true
true
true
```

## Listing processes

`process.list()` describes every running process with its `pid`, `ppid`, `user`, `command`, memory and CPU use. It runs `ps`, so it fails with `NotFoundError` where `ps` doesn't exist. The list differs on every machine, so find what you need by filtering. This finds the current program:

```osl varies
import "std:process"

auto me = process.pid()
for p in process.list().unwrap() (
  if p.pid == me (
    log "found myself:" p.command
  )
)
```

## Exit codes

`process.exit(code)` ends the program at once with a status. `0` means success and anything else means failure, which shells and CI systems check. Deferred code doesn't run, so clean up first.

```osl fails
import "std:process"

log "checking..."
bool ok = false
if !ok (
  log "check failed"
  process.exit(3)
)
log "not reached"
```

```output
checking...
check failed
```

:::exercise title="Count words with wc"
Run `sh -c "echo one two three | wc -w"` with `exec` and print the number it reports, converted to an `int`, plus one. If the command fails, print `unavailable`.

```osl
import "std:process"

log process.exec("echo", "unchanged").unwrap().trim()
```

```output
4
```

> [!hint]
> `exec("sh", "-c", "echo one two three | wc -w")` gives text such as `3\n`.

> [!hint]
> `.trim().tryAs<int>.unwrapOr(0)` converts safely. Use `switch` on the exec result to handle failure.

```osl solution
import "std:process"

switch process.exec("sh", "-c", "echo one two three | wc -w") (
  case ok(out)
    log out.trim().tryAs<int>.unwrapOr(0) + 1
  case err(e)
    log "unavailable"
)
```

```output
4
```
:::

:::quiz
What is the difference between `process.exec` and `process.run`?

- [x] `exec` returns the output and fails on a non-zero exit. `run` returns a record and only fails if the command can't start.
- [ ] `run` uses a shell and `exec` doesn't.
- [ ] There is none.

Neither uses a shell. Use `run` when the exit code carries meaning, as with `grep`.
:::

:::exercise title="Report the exit code"
Run `sh -c "exit 7"` with `run`. If it didn't succeed, print `failed with 7` using the real code.

```osl
import "std:process"

log process.run("echo", ["hi"]).unwrap().ok
```

```output
failed with 7
```

> [!hint]
> `process.run("sh", ["-c", "exit 7"]).unwrap()`

> [!hint]
> Check `r.ok`, print `r.code`.

```osl solution
import "std:process"

auto r = process.run("sh", ["-c", "exit 7"]).unwrap()
if !r.ok ( log "failed with" r.code )
```

```output
failed with 7
```
:::

## API reference

::api
