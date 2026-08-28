# date

Use `date` for current time, Unix timestamps, durations, time-zone conversion, formatting, and date arithmetic.

```osl
import "std:date"
```

## API reference

### `date`

| Method | Returns | Notes |
| --- | --- | --- |
| `date.now()` | `dateDateTime` | Returns current date/time. |
| `date.fromUnix(s: number)` | `dateDateTime` | Creates from unix. |
| `date.fromUnixMs(ms: number)` | `dateDateTime` | Creates from unix ms. |
| `date.duration(value: number)` | `dateDuration` |  |
| `date.isLeap(year: number)` | `boolean` |  |
| `date.daysInMonth(year: number, month: number)` | `number` |  |

### `dateDateTime` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.unix()` | `number` |  |
| `value.unixMs()` | `number` |  |
| `value.iso()` | `string` |  |
| `value.format(layout: string)` | `string` | Formats a value for display. |
| `value.add(unit: string, value: number)` | `dateDateTime` |  |
| `value.subtract(unit: string, value: number)` | `dateDateTime` |  |
| `value.addDuration(v: dateDuration)` | `dateDateTime` | Adds duration. |
| `value.since(other: dateDateTime)` | `dateDuration` |  |
| `value.until(other: dateDateTime)` | `dateDuration` |  |
| `value.with(field: string, value: number)` | `dateDateTime` |  |
| `value.round(unit: string)` | `dateDateTime` |  |
| `value.inTimezone(tz: string)` | `dateZonedDateTime` |  |
| `value.compare(other: dateDateTime)` | `number` |  |
| `value.equals(other: dateDateTime)` | `boolean` |  |
| `value.before(other: dateDateTime)` | `boolean` |  |
| `value.after(other: dateDateTime)` | `boolean` |  |

### `dateDuration` values

| Method | Returns |
| --- | --- |
| `value.totalMilliseconds()` | `number` |
| `value.seconds()` | `number` |
| `value.minutes()` | `number` |
| `value.hours()` | `number` |
| `value.days()` | `number` |

### `dateZonedDateTime` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.iso()` | `string` | Formats the value in its timezone, falling back to UTC when invalid. |
| `value.format(layout: string)` | `string` | Formats the value in its timezone, falling back to UTC. |

## Notes

- Prefer `import "std:date"`; the older `import "osl/date"` spelling remains supported.

## Behavior and limits

Negative Unix milliseconds round down. Calendar arithmetic handles month ends, leap days, and
daylight-saving transitions. Non-finite or overflowing durations are rejected. Format strings can
escape text with brackets or backslashes, and meridiem tokens distinguish noon correctly.
