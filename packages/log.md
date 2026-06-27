# log

> Levelled, colourful logging

Use `log` for levelled terminal logging with configurable formatting, colors, file output, and timing helpers.

```javascript
import "osl/log"
```

## Example

```javascript
import "osl/log"

log.info("server started")
log.warn("cache is empty")
```

## API reference

### `log`

| Method | Returns | Description |
| --- | --- | --- |
| `log.setLevel(level: any)` | `void` | Sets level. |
| `log.getLevel()` | `string` | Returns level. |
| `log.shouldLog(level: LogLevel)` | `boolean` | Runs the should log operation. |
| `log.info(message: any, ...args: any)` | `void` | Runs the info operation. |
| `log.warn(message: any, ...args: any)` | `void` | Runs the warn operation. |
| `log.error(message: any, ...args: any)` | `void` | Runs the error operation. |
| `log.debug(message: any, ...args: any)` | `void` | Runs the debug operation. |
| `log.success(message: any, ...args: any)` | `void` | Runs the success operation. |
| `log.log(level: any, message: any, ...args: any)` | `void` | Runs the log operation. |
| `log.plain(message: any, ...args: any)` | `void` | Runs the plain operation. |
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
| `log.progressBar(current: any, total: any, width: any, label: any)` | `void` | Runs the progress bar operation. |
| `log.spinner(message: any, done: boolean)` | `void` | Runs the spinner operation. |
| `log.assert(condition: any, message: any)` | `void` | Runs the assert operation. |
| `log.trace(message: any)` | `void` | Runs the trace operation. |
| `log.fatal(message: any)` | `void` | Runs the fatal operation. |
| `log.countdown(seconds: any, message: any)` | `void` | Runs the countdown operation. |

## Notes

- Standard-library imports accept both `import "osl/log"` and `import "log"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
