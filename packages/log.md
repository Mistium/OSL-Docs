# log

Use `log` for levelled, timestamped console logging, a history of recent entries, and progress
output.

```osl
import "std:log"
```

Importing the package doesn't change the `log` statement: `log value` still prints a value as is.

## Example

```osl
import "std:log"

log.info("server started on port %d", 8080)
log.warn("cache is empty")
log.error("request failed:", "timeout")

log.setLevel("DEBUG")
log.debug("connection pool size %d", 4)
```

```text
19:08:32 [INFO] server started on port 8080
19:08:32 [WARN] cache is empty
19:08:32 [ERROR] request failed: timeout
19:08:32 [DEBUG] connection pool size 4
```

Messages are coloured by level in a terminal.

## Levels

From least to most severe, the levels are `DEBUG`, `INFO`, `SUCCESS` (which ranks with `INFO`), `WARN`
and `ERROR`. Messages below the current level are neither printed nor recorded. The default is
`INFO`.

| Function | Returns | Notes |
| --- | --- | --- |
| `log.setLevel(level)` | `void` | Sets the least severe level that is printed and recorded. Names are case-insensitive, and `INFORMATION`, `WARNING`, `ERR` and `OK` are accepted as aliases. Throws `ValueError` for any other name. |
| `log.level()` | `string` | The current level's name, such as `"INFO"`. |

## Logging

`info`, `warn`, `error`, `debug`, `success`, `log`, `withTimestamp` and `plain` apply printf-style
verbs (`%s`, `%d`, `%f`, ...) in `message` to `args`. Arguments left over are appended with spaces.

| Function | Returns | Notes |
| --- | --- | --- |
| `log.info(message, ...args)` | `void` | Prints at `INFO` with the time. |
| `log.warn(message, ...args)` | `void` | Prints at `WARN`. |
| `log.error(message, ...args)` | `void` | Prints at `ERROR`. |
| `log.debug(message, ...args)` | `void` | Prints at `DEBUG`, which is hidden until `log.setLevel("DEBUG")`. |
| `log.success(message, ...args)` | `void` | Prints at `SUCCESS`. |
| `log.trace(message)` | `void` | Prints at `DEBUG`, prefixed with `[TRACE]`. |
| `log.log(level, message, ...args)` | `void` | Prints at a named level. Throws `ValueError` for an unknown level. |
| `log.withTimestamp(level, message, ...args)` | `void` | Like `log.log`, with the date and time before the message. |
| `log.plain(message, ...args)` | `void` | Prints without a level, time or colour. It ignores the level and isn't recorded. |
| `log.assert(condition, message?)` | `void` | Logs `message` (`"Assertion failed"` without one) at `ERROR` when `condition` is false. It never throws; use [`testing`](testing.md) to stop on a failed check. |
| `log.fatal(message)` | `void` | Logs at `ERROR`, prefixed with `[FATAL]`, and exits with status 1 at once. Deferred code doesn't run and running threads stop. Throw an error instead when callers should be able to recover. |

## Formatting helpers

These print directly and are not recorded in the history.

| Function | Returns | Notes |
| --- | --- | --- |
| `log.json(data)` | `void` | Prints `data` as JSON on one line. |
| `log.table(headers, rows)` | `void` | Prints rows (arrays of cells) under headers as a text table. |
| `log.separator()` | `void` | Prints a line of 80 dashes. |
| `log.group(title)` | `void` | Prints a heading that starts a group of output. |
| `log.groupEnd()` | `void` | Prints the line that ends the group. |
| `log.time(message)` | `void` | Prints `message` after the time of day to the millisecond, such as `[14:03:07.123]`. |
| `log.timestamp(message)` | `void` | Prints `message` after the current time in unix microseconds. |
| `log.clear()` | `void` | Clears the terminal screen. |

```osl
log.table(["name", "age"], [["Ada", 36], ["Linus", 28]])
```

```text
+-------+-----+
| name  | age |
+-------+-----+
| Ada   | 36  |
| Linus | 28  |
+-------+-----+
```

## Progress

| Function | Returns | Notes |
| --- | --- | --- |
| `log.progress(current, total, options?)` | `void` | Draws a progress bar on the current line, redrawing in place on each call, and ends the line once `current` reaches `total`. Options: `width` (characters, default 30) and `label` (text before the bar, default `""`). Throws `ValueError` when `total` isn't above 0 or `width` is negative. |
| `log.spinner(message, done)` | `void` | Prints the next spinner frame before `message` on the current line. Call it repeatedly to animate it, then with `done` set to `true` to replace it with a check mark and end the line. |
| `log.countdown(from, message)` | `void` | Counts down from `from` to 1 on one line, one number per second, then prints `message` and `Done!`. Blocks for `from` seconds. Throws `ValueError` when `from` is negative. |

```osl
for i 5 (
  log.progress(i, 5, {width: 20, label: "copying"})
)
```

## History

The package records the most recent 1000 entries that were printed at or above the level in force
at the time. History is on by default.

| Function | Returns | Notes |
| --- | --- | --- |
| `log.history()` | `object[]` | The recorded entries, oldest first, as `{time, level, message}` records. `time` is unix milliseconds; `message` is formatted, without the time or level. |
| `log.countByLevel()` | `object` | How many recorded entries each level has, keyed by level name. Levels with no entries are absent. |
| `log.exportHistory(path)` | `result<unit, error>` | Writes the entries to a file, one `[HH:MM:SS] [LEVEL] message` line each, replacing the file. Fails with `NotFoundError`, `PermissionError` or `IOError`. |
| `log.clearHistory()` | `void` | Removes every recorded entry. |
| `log.enableHistory()` | `void` | Clears the history and starts recording again. |
| `log.disableHistory()` | `void` | Clears the history and stops recording. |

```osl
for entry in log.history() (
  if entry.level == "ERROR" ( log entry.message )
)
log.exportHistory("session.log")
```

## Changes from earlier versions

`log.getLevel()` is now `log.level()`, `log.progressBar(current, total, width, label)` is
`log.progress(current, total, {width, label})`, and `log.getHistory()` is `log.history()`, whose
entries carry a unix-millisecond `time` instead of an `HH:MM:SS` `timestamp` string. `log.log` and
`log.withTimestamp` throw `ValueError` for an unknown level instead of logging at `INFO`.

## Behavior and limits

The older `import "osl/log"` spelling still works, with a migration warning.

Logging and the history are safe to use from several threads.
