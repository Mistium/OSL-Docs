# log

> Logging utilities with levels and formatting

```javascript
import "osl/log"
```

## Methods

- `log.setLevel(level)`
- `log.getLevel()` → `string`
- `log.shouldLog(level)` → `boolean`
- `log.info(message, ...args)`
- `log.warn(message, ...args)`
- `log.error(message, ...args)`
- `log.debug(message, ...args)`
- `log.success(message, ...args)`
- `log.log(level, message, ...args)`
- `log.plain(message, ...args)`
- `log.json(data)`
- `log.table(headers, rows)`
- `log.separator()`
- `log.clear()`
- `log.time(message)`
- `log.timestamp(message)`
- `log.enableHistory()`
- `log.disableHistory()`
- `log.getHistory()` → `array`
- `log.clearHistory()`
- `log.countByLevel()` → `object`
- `log.exportHistory(path)` → `boolean`
- `log.withTimestamp(level, message, ...args)`
- `log.group(title)`
- `log.groupEnd()`
- `log.progressBar(current, total, width, label)`
- `log.spinner(message, done)`
- `log.assert(condition, message)`
- `log.trace(message)`
- `log.fatal(message)`
- `log.countdown(seconds, message)`
