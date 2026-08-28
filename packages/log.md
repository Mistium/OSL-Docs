# log

Use `log` for levelled terminal logging with configurable formatting, colors, file output, and timing helpers.

```osl
import "std:log"
```

## Example

```osl
import "std:log"

log.info("server started")
log.warn("cache is empty")
```

## API reference

### `log`

| Method | Returns | Notes |
| --- | --- | --- |
| `log.setLevel(level: any)` | `void` | Sets the minimum level. Names and aliases are case-insensitive. |
| `log.getLevel()` | `string` | Returns level. |
| `log.shouldLog(level: LogLevel)` | `boolean` | Compares precomputed level ranks without allocating per message. |
| `log.info(message: any, ...args: any)` | `void` | Logs an info message, substituting stringified arguments into formatting verbs. |
| `log.warn(message: any, ...args: any)` | `void` | Logs a warning message, substituting stringified arguments into formatting verbs. |
| `log.error(message: any, ...args: any)` | `void` | Logs an error message, substituting stringified arguments into formatting verbs. |
| `log.debug(message: any, ...args: any)` | `void` | Logs a debug message, substituting stringified arguments into formatting verbs. |
| `log.success(message: any, ...args: any)` | `void` | Logs a success message, substituting stringified arguments into formatting verbs. |
| `log.log(level: any, message: any, ...args: any)` | `void` | Logs at the selected level, defaulting unknown levels to info. |
| `log.plain(message: any, ...args: any)` | `void` | Prints an unprefixed message with the same argument formatting. |
| `log.json(data: any)` | `void` |  |
| `log.table(headers: array, rows: array)` | `void` |  |
| `log.separator()` | `void` |  |
| `log.clear()` | `void` | Clears all stored values. |
| `log.time(message: any)` | `void` |  |
| `log.timestamp(message: any)` | `void` |  |
| `log.enableHistory()` | `void` |  |
| `log.disableHistory()` | `void` |  |
| `log.getHistory()` | `array` | Returns history. |
| `log.clearHistory()` | `void` |  |
| `log.countByLevel()` | `object` |  |
| `log.exportHistory(path: any)` | `boolean` |  |
| `log.withTimestamp(level: any, message: any, ...args: any)` | `void` |  |
| `log.group(title: any)` | `void` |  |
| `log.groupEnd()` | `void` |  |
| `log.progressBar(current: any, total: any, width: any, label: any)` | `void` | Prints a progress bar with percentage and width clamped to safe bounds. |
| `log.spinner(message: any, done: boolean)` | `void` | Prints a spinner frame or its completed state. |
| `log.assert(condition: any, message: any)` | `void` |  |
| `log.trace(message: any)` | `void` |  |
| `log.fatal(message: any)` | `void` |  |
| `log.countdown(seconds: any, message: any)` | `void` |  |

## Notes

- Prefer `import "std:log"`; the older `import "osl/log"` spelling remains supported.

## Behavior and limits

History access is safe across threads. Export methods return `false` when they cannot write the
file.
