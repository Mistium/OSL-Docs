---
description: Levelled, timestamped console logging with printf-style messages, grouping, tables, progress bars and a history you can query or export.
package: log
---

# log

`log` is a logger for programs that run unattended or print a lot: servers, scripts, tools. Every entry has a level (`DEBUG`, `INFO`, `SUCCESS`, `WARN` or `ERROR`), a time and a message. You can hide the noisy levels, keep the recent entries to inspect or export them, and draw tables and progress bars.

```osl fragment varies
import "std:log"
```

For quick printing while you work, the `log` statement from the language (`log a b`) is simpler. Reach for this package when you want levels, timestamps and a record of what happened.

## Levels

Each level has a function that takes a message. Lines start with the time of day and the level, and are coloured in a terminal. Because the time changes on every run, these examples are marked as varying.

```osl varies
import "std:log"

log.info("server starting")
log.success("listening on port 8080")
log.warn("cache is cold")
log.error("could not reach the database")
log.debug("this one is hidden")
```

Debug entries are below the default level, so they are dropped. Output goes to standard output. Levels, from least to most severe, are `DEBUG`, `INFO` (and `SUCCESS`, which ranks the same), `WARN` and `ERROR`.

Try it: swap `log.warn` for `log.error` and watch the colour change in a terminal.

## Choose what you see

`log.setLevel(name)` sets the least severe level that is printed. `log.level()` tells you what it is now. Entries below the level are neither printed nor recorded.

```osl
import "std:log"

log log.level()
log.setLevel("WARN")
log log.level()
log.info("dropped")
log.warn("kept")
log.setLevel("DEBUG")
log log.level()
log log.history().len
log log.history()[1].message
log.setLevel("LOUD") catch ( log "not a level" )
```

An unknown level name is a `ValueError`. Turn on debug output while chasing a problem, and set `WARN` in a program that should only speak when something is wrong.

Try it: set the level to `ERROR` and see which lines survive.

## Printf-style messages

Messages take printf verbs (`%s`, `%d`, `%f`, `%v`) filled from the arguments that follow. Leftover arguments are appended with a space, so you can also pass plain values.

```osl varies
import "std:log"

log.info("%s logged in from %s (%d attempts)", "ada", "10.0.0.2", 3)
log.info("retrying in", 5, "seconds")
log.warn("disk at %.1f%%", 91.256)
for h in log.history() ( log h.level ":" h.message )
```

The recorded `message` is the formatted text, without the time or level. The level lines themselves printed above the list, with times, so run it yourself to see them.

## Plain output

`log.plain` prints without a level, time or colour, and isn't recorded. `log.json` prints a value as one line of JSON, and `log.table` a text table. `log.separator`, `log.group` and `log.groupEnd` structure the output.

```osl
import "std:log"

log.group("Report")
log.plain("total: %d items", 42)
log.json({ok: true, items: [1, 2]})
log.table(["name", "qty"], [["bolt", 12], ["nut", 30]])
log.groupEnd()
log.separator()
```

```output

--- Report ---
total: 42 items
{"items":[1,2],"ok":true}
+------+-----+
| name | qty |
+------+-----+
| bolt | 12  |
| nut  | 30  |
+------+-----+
--- End Group ---

--------------------------------------------------------------------------------
```

## Timestamps

`log.time(message)` prefixes the time of day to the millisecond, `log.timestamp(message)` the unix time in microseconds, and `log.withTimestamp(level, message)` the full date. They are meant for measuring and correlating, and always differ between runs.

```osl varies varies
import "std:log"

log.time("request received")
log.timestamp("tick")
log.withTimestamp("INFO", "something happened")
```

## Check conditions

`log.assert(condition, message)` logs an error when the condition is false, and does nothing otherwise. It never stops the program: use [testing](testing.md) when a failure must be fatal.

```osl
import "std:log"

log.assert(1 + 1 == 2, "arithmetic works")
log.assert(1 + 1 == 3, "arithmetic is broken")
log log.countByLevel()
```

## The history

The last 1000 entries are kept. `log.history()` returns them oldest first, each with `time` (unix milliseconds), `level` and `message`. `log.countByLevel()` counts them by level, and levels with no entries are absent.

```osl varies
import "std:log"

log.info("one")
log.warn("two")
log.warn("three")
log.error("four")

log log.history().len
for h in log.history() ( log h.level h.message )
log log.countByLevel()

log.clearHistory()
log log.history().len
log.disableHistory()
log.info("not recorded")
log log.history().len
```

`exportHistory(path)` writes the entries to a file, one per line as `[HH:MM:SS] [LEVEL] message`. It returns a [result](../learn/errors.md), because the file may not be writable.

```osl varies
import "std:log"
import "std:fs"

log.info("started")
log.error("failed once")
log.exportHistory("run.log").unwrap()
for line in fs.lines("run.log").unwrap() (
  log line.len > 0 line.endsWith("started") or line.endsWith("failed once")
)
log log.exportHistory("no/such/dir/run.log").unwrapErr().kind
```

## Progress, spinners and countdowns

`log.progress(current, total, options)` draws a bar on the current line and redraws it in place on every call, ending the line when `current` reaches `total`. Options are `width` and `label`. `log.spinner(message, done)` animates in the same way. `log.countdown(from, message)` counts down one number per second.

```osl norun
import "std:log"
import "std:thread"

for i in 0 to 20 (
  log.progress(i, 20, {label: "Copying", width: 30})
  thread.sleep(100)
)
for i in 1 to 10 (
  log.spinner("Waiting", false)
  thread.sleep(100)
)
log.spinner("Waiting", true)
log.countdown(3, "Launching!")
```

These write control characters that move the cursor, so they are meant for a terminal and not for log files. For richer building blocks (bars as strings, tables, colours), see [tui](tui.md).

## Buffering busy output

A program that prints many lines makes many small writes. `log.setBuffer(ms)` batches output, writing it at most that many milliseconds later or once 64 KB is waiting. `log.flush()` writes whatever is held back. `setBuffer(0)` turns buffering off again.

```osl
import "std:log"

log.setBuffer(50)
for i in 1 to 3 ( log.plain("line %d", i) )
log.flush()
log.setBuffer(0)
```

```output
line 1
line 2
line 3
```

## Stopping on fatal errors

`log.fatal(message)` logs at `ERROR` level with a `[FATAL]` prefix and exits with status 1 at once. Deferred code doesn't run and threads stop. Use it for errors no caller could recover from, and prefer returning a result or throwing otherwise.

```osl fails varies
import "std:log"

log.plain("starting")
log.fatal("configuration is missing")
log.plain("never printed")
```

:::quiz
With the default level, what happens to `log.debug("x")`?

- [ ] It is printed in grey.
- [x] It is dropped.
- [ ] It throws.

DEBUG is below INFO. Call `log.setLevel("DEBUG")` to see it.
:::

:::exercise title="A tidy summary"
Print a group named `Totals` that holds the plain lines `apples: 3` and `pears: 5`, then the JSON line of both.

```osl
import "std:log"

log.plain("nothing yet")
```

```output

--- Totals ---
apples: 3
pears: 5
--- End Group ---

{"apples":3,"pears":5}
```

> [!hint]
> `log.group`, `log.plain` and `log.groupEnd`

> [!hint]
> `log.json({apples: 3, pears: 5})`

```osl solution
import "std:log"

log.group("Totals")
log.plain("apples: %d", 3)
log.plain("pears: %d", 5)
log.groupEnd()
log.json({apples: 3, pears: 5})
```

```output

--- Totals ---
apples: 3
pears: 5
--- End Group ---

{"apples":3,"pears":5}
```
:::

## API reference

::api
