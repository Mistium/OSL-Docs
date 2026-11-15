---
description: Show desktop notifications and alert dialogs from a program, on macOS, Linux and Windows.
package: notify
---

# notify

`notify` tells the person at the computer something: a build finished, a download is done, a long job failed. It shows a desktop notification, or a dialog that waits for them.

```osl fragment
import "std:notify"
```

Notifications need a desktop session, so the examples on this page are compiled but not run.

## Send a notification

```osl norun
import "std:notify"

notify.send("Build finished", "All 42 tests passed").unwrap()
```

`send(title, message)` returns a [result](../learn/errors.md). It uses `osascript` on macOS, `notify-send` on Linux and PowerShell on Windows. Try it on your own machine.

## Check first

Servers and containers have no desktop. `notify.isAvailable()` says whether `send` can work here, so a script can fall back to printing.

```osl norun
import "std:notify"

def tell(string title, string message) (
  if notify.isAvailable() (
    notify.send(title, message).unwrap()
  ) else (
    log title ++ ": " ++ message
  )
)

tell("Backup", "finished")
```

## Handle failure

Without a check, a failure is an error value you can look at. `UnsupportedError` means this system can't show notifications, `NotFoundError` that the helper program isn't installed (install `libnotify` for `notify-send`), and `RuntimeError` that the helper failed.

```osl norun
import "std:notify"

switch notify.send("Hello", "from OSL") (
  case ok(_)
    log "sent"
  case err(e)
    log "could not notify:" e.kind
)
```

## A sound on macOS

Pass `sound` with a system sound name. Only macOS supports it, and asking elsewhere is an `UnsupportedError`.

```osl norun
import "std:notify"

notify.send("Done", "The export is ready", {sound: "Glass"}).unwrap()
```

## Wait for an answer

`notify.alert(title, message)` shows a dialog with an OK button and waits until it is dismissed. Use it when the person must see the message before the program goes on. On Linux it needs `zenity`, and falls back to a notification without it.

```osl norun
import "std:notify"

notify.alert("Delete everything?", "Press OK to continue.").unwrap()
log "continuing"
```

:::quiz
Your script runs on a server with no screen. What is the safest way to use `notify`?

- [ ] Call `send` and hope.
- [x] Check `notify.isAvailable()` and print to the console when it is false.
- [ ] Use `alert`, which always works.

`isAvailable` tells you whether a notification can be shown here at all.
:::

:::exercise title="Notify or print"
Real notifications can't be recorded here, so practise the decision. Write `route(desktop, message)`: with a desktop it returns `notify: ` and the message, without one it returns `print: ` and the message. Then in your own program, pass it `notify.isAvailable()`.

```osl
import "std:notify"

log "todo"
```

```output
notify: build ok
print: build ok
```

> [!hint]
> A function with an `if` and two `return` lines is enough.

```osl solution
import "std:notify"

def route(boolean desktop, string message) string (
  if desktop return "notify: " ++ message
  return "print: " ++ message
)

log route(true, "build ok")
log route(false, "build ok")
```

```output
notify: build ok
print: build ok
```
:::

## API reference

::api
