# date

Use `date` for current time, Unix timestamps, durations, time-zone conversion, formatting, and date arithmetic.

```osl
import "std:date"
```

## API reference

### `date`

| Method | Returns | Notes |
| --- | --- | --- |
| `date.now()` | `date.DateTime` | Returns current date/time. |
| `date.fromUnix(s: number)` | `date.DateTime` | Creates from unix. |
| `date.fromUnixMs(ms: number)` | `date.DateTime` | Creates from unix ms. |
| `date.duration(value: number)` | `date.Duration` |  |
| `date.isLeap(year: number)` | `boolean` |  |
| `date.daysInMonth(year: number, month: number)` | `number` |  |

### `date.DateTime` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.unix()` | `number` |  |
| `value.unixMs()` | `number` |  |
| `value.iso()` | `string` |  |
| `value.format(layout: string)` | `string` | Formats a value for display. |
| `value.add(unit: string, value: number)` | `date.DateTime` |  |
| `value.subtract(unit: string, value: number)` | `date.DateTime` |  |
| `value.addDuration(v: date.Duration)` | `date.DateTime` | Adds duration. |
| `value.since(other: date.DateTime)` | `date.Duration` |  |
| `value.until(other: date.DateTime)` | `date.Duration` |  |
| `value.with(field: string, value: number)` | `date.DateTime` |  |
| `value.round(unit: string)` | `date.DateTime` |  |
| `value.inTimezone(tz: string)` | `date.ZonedDateTime` |  |
| `value.compare(other: date.DateTime)` | `number` |  |
| `value.equals(other: date.DateTime)` | `boolean` |  |
| `value.before(other: date.DateTime)` | `boolean` |  |
| `value.after(other: date.DateTime)` | `boolean` |  |

### `date.Duration` values

| Method | Returns |
| --- | --- |
| `value.totalMilliseconds()` | `number` |
| `value.seconds()` | `number` |
| `value.minutes()` | `number` |
| `value.hours()` | `number` |
| `value.days()` | `number` |

### `date.ZonedDateTime` values

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
