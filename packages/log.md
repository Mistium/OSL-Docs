# log

> Levelled, colourful logging

Use `log` for levelled terminal logging with configurable formatting, colors, file output, and timing helpers.

```javascript
import "std:log"
```

## Example

```javascript
import "std:log"

log.info("server started")
log.warn("cache is empty")
```

## API reference

### `log`

| Method | Returns | Description |
| --- | --- | --- |
| `log.setLevel(level: any)` | `void` | Sets a recognized level using the shared case-insensitive alias parser. |
| `log.getLevel()` | `string` | Returns level. |
| `log.shouldLog(level: LogLevel)` | `boolean` | Compares precomputed level ranks without allocating per message. |
| `log.info(message: any, ...args: any)` | `void` | Logs an info message, substituting stringified arguments into formatting verbs. |
| `log.warn(message: any, ...args: any)` | `void` | Logs a warning message, substituting stringified arguments into formatting verbs. |
| `log.error(message: any, ...args: any)` | `void` | Logs an error message, substituting stringified arguments into formatting verbs. |
| `log.debug(message: any, ...args: any)` | `void` | Logs a debug message, substituting stringified arguments into formatting verbs. |
| `log.success(message: any, ...args: any)` | `void` | Logs a success message, substituting stringified arguments into formatting verbs. |
| `log.log(level: any, message: any, ...args: any)` | `void` | Logs at the selected level, defaulting unknown levels to info. |
| `log.plain(message: any, ...args: any)` | `void` | Prints an unprefixed message with the same argument formatting. |
| `log.json(data: any)` | `void` | Runs the json operation. |
| `log.table(headers: array, rows: array)` | `void` | Runs the table operation. |
| `log.separator()` | `void` | Runs the separator operation. |
| `log.clear()` | `void` | Clears all stored values. |
| `log.time(message: any)` | `void` | Runs the time operation. |
| `log.timestamp(message: any)` | `void` | Runs the timestamp operation. |
| `log.enableHistory()` | `void` | Runs the enable history operation. |
| `log.disableHistory()` | `void` | Runs the disable history operation. |
| `log.getHistory()` | `array` | Returns history. |
| `log.clearHistory()` | `void` | Runs the clear history operation. |
| `log.countByLevel()` | `object` | Runs the count by level operation. |
| `log.exportHistory(path: any)` | `boolean` | Runs the export history operation. |
| `log.withTimestamp(level: any, message: any, ...args: any)` | `void` | Runs the with timestamp operation. |
| `log.group(title: any)` | `void` | Runs the group operation. |
| `log.groupEnd()` | `void` | Runs the group end operation. |
| `log.progressBar(current: any, total: any, width: any, label: any)` | `void` | Prints a progress bar with percentage and width clamped to safe bounds. |
| `log.spinner(message: any, done: boolean)` | `void` | Prints a spinner using a shared immutable symbol table. |
| `log.assert(condition: any, message: any)` | `void` | Runs the assert operation. |
| `log.trace(message: any)` | `void` | Runs the trace operation. |
| `log.fatal(message: any)` | `void` | Runs the fatal operation. |
| `log.countdown(seconds: any, message: any)` | `void` | Runs the countdown operation. |

## Notes

- Prefer `import "std:log"`; the older `import "osl/log"` spelling remains supported.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

## Edge-case behavior

History reads and mutations are synchronized through one reset path. Export
failures return false.
