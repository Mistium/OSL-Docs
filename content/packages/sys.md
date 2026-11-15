---
description: Find out which operating system, machine and user your program runs on, and open a URL in the default app.
package: sys
---

# sys

`sys` answers "where am I running?": the operating system, the processor, the user and the machine. Use it to pick a path or a command that differs between systems, or to open a link in the browser.

```osl fragment
import "std:sys"
```

## What system is this?

`sys.os()` and `sys.arch()` return short names such as `linux`, `darwin` (macOS), `windows`, `amd64` and `arm64`. The answer depends on the machine, so this example is marked as varying: run it and see your own.

```osl varies
import "std:sys"

log sys.os() sys.arch()
log sys.cpus() "logical CPUs"
```

> [!tip]
> Edit the example and print `sys.os() == "linux"`. Comparing strings in OSL ignores case.

## Branch on the system

The common use is a decision. This picks the command that lists files:

```osl
import "std:sys"

def listCommand() string (
  if sys.os() == "windows" return "dir"
  return "ls"
)

log listCommand().len > 0
log sys.cpus() >= 1
```

```output
true
true
```

## The user and the machine

`username`, `homeDir` and `hostname` are [results](../learn/errors.md), because the system might not know. `uid` and `gid` are numbers, or `null` on Windows, which has no such IDs.

```osl varies
import "std:sys"

log sys.username().unwrapOr("unknown")
log sys.homeDir().unwrapOr("no home")
log sys.hostname().unwrapOr("no name")
log sys.uid() sys.gid()
```

Facts about the machine make poor test data, so print stable properties instead. These always hold:

```osl
import "std:sys"

log sys.username().isOk()
log sys.homeDir().unwrap().startsWith("/")
log sys.hostname().unwrap().len > 0
```

```output
true
true
true
```

Try it: build the path of a config file with `fs.joinPath(sys.homeDir().unwrap(), ".myapp.json")`, using [fs](fs.md).

## Open a URL

`sys.openURL(url)` opens a web address, or a `file://` path, in the default app and returns at once. It needs a desktop, so this example is compiled but not run.

```osl norun
import "std:sys"

switch sys.openURL("https://osl-lang.org") (
  case ok(_)
    log "opened"
  case err(e)
    log "could not open:" e.kind
)
```

A URL without a scheme (`osl-lang.org`) is a `ParseError`, and a system with no opener (`open`, `xdg-open`) gives `NotFoundError`.

:::quiz
Why does `sys.username()` return a result instead of a string?

- [ ] Because user names can change while the program runs.
- [x] Because the system may have no record of the user, such as in a minimal container.
- [ ] Because it needs a network request.

Anything that asks the operating system can fail, so the failure is part of the type.
:::

:::exercise title="Describe this machine"
Print `ok` if the machine has at least one CPU and the OS name is not empty, otherwise `strange`.

```osl
import "std:sys"

log sys.os()
```

```output
ok
```

> [!hint]
> Combine two comparisons with `and`.

```osl solution
import "std:sys"

if sys.cpus() >= 1 and sys.os() != "" (
  log "ok"
) else (
  log "strange"
)
```

```output
ok
```
:::

## API reference

::api
