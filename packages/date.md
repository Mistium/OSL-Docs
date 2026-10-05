# date

Use `date` for current time, Unix timestamps, durations, time-zone conversion, formatting, and date arithmetic.
All internal storage uses microsecond precision.

```osl
import "std:date"
```

## API reference

### `date`

| Method | Returns | Notes |
| --- | --- | --- |
| `date.now()` | `date.DateTime` | Returns current date/time. |
| `date.nowUs()` | `number` | Returns current Unix time in microseconds. |
| `date.fromUnix(s: number)` | `date.DateTime` | Creates from Unix seconds. |
| `date.fromUnixMs(ms: number)` | `date.DateTime` | Creates from Unix milliseconds. |
| `date.fromUnixUs(us: number)` | `date.DateTime` | Creates from Unix microseconds. |
| `date.duration(value: number)` | `date.Duration` | Creates a duration from microseconds. |
| `date.isLeap(year: number)` | `boolean` | Reports whether the year is a leap year. |
| `date.daysInMonth(year: number, month: number)` | `number` | Returns days in the given month (1-indexed). |

### `date.DateTime` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.unix()` | `number` | Returns Unix seconds (floor division). |
| `value.unixMs()` | `number` | Returns Unix milliseconds (floor division). |
| `value.unixUs()` | `number` | Returns Unix microseconds. |
| `value.iso()` | `string` | Returns an ISO 8601 string in UTC. |
| `value.format(layout: string)` | `string` | Formats a value for display. |
| `value.add(unit: string, value: number)` | `date.DateTime` | Adds a fixed or calendar duration. Panics on unknown unit. |
| `value.subtract(unit: string, value: number)` | `date.DateTime` | Subtracts a fixed or calendar duration. Panics on unknown unit. |
| `value.addDuration(v: date.Duration)` | `date.DateTime` | Adds a duration. |
| `value.since(other: date.DateTime)` | `date.Duration` | Returns the duration from `other` to this value. |
| `value.until(other: date.DateTime)` | `date.Duration` | Returns the duration from this value to `other`. |
| `value.with(field: string, value: number)` | `date.DateTime` | Replaces a date/time field. Panics on unknown field. |
| `value.round(unit: string)` | `date.DateTime` | Truncates to the requested unit. Panics on unknown unit. |
| `value.inTimezone(tz: string)` | `date.ZonedDateTime` | Converts to a timezone, falling back to UTC when invalid. |
| `value.compare(other: date.DateTime)` | `number` | Returns -1, 0, or 1. |
| `value.equals(other: date.DateTime)` | `boolean` | Reports whether two values are identical. |
| `value.before(other: date.DateTime)` | `boolean` | Reports whether this value is earlier. |
| `value.after(other: date.DateTime)` | `boolean` | Reports whether this value is later. |

### `date.Duration` values

All durations are stored as microseconds.

| Method | Returns | Notes |
| --- | --- | --- |
| `value.micros()` | `number` | Returns the duration in microseconds. |
| `value.millis()` | `number` | Returns the duration in milliseconds (floor division). |
| `value.seconds()` | `number` | Returns the duration in seconds. |
| `value.minutes()` | `number` | Returns the duration in minutes. |
| `value.hours()` | `number` | Returns the duration in hours. |
| `value.days()` | `number` | Returns the duration in days. |

### `date.ZonedDateTime` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.iso()` | `string` | Formats the value in its timezone, falling back to UTC when invalid. |
| `value.format(layout: string)` | `string` | Formats the value in its timezone, falling back to UTC. |

## Format tokens

| Token | Description |
| --- | --- |
| `YYYY` | 4-digit year |
| `YY` | 2-digit year |
| `MMMM` | Full month name |
| `MMM` | Abbreviated month name |
| `MM` | 2-digit month |
| `M` | Month (1-12) |
| `DD` | 2-digit day |
| `D` | Day (1-31) |
| `dddd` | Full weekday name |
| `ddd` | Abbreviated weekday name |
| `HH` | 2-digit hour (0-23) |
| `H` | Hour (0-23) |
| `hh` | 2-digit hour (1-12) |
| `h` | Hour (1-12) |
| `mm` | 2-digit minute |
| `m` | Minute |
| `ss` | 2-digit second |
| `s` | Second |
| `SSSSSS` | 6-digit microseconds |
| `SSS` | 3-digit milliseconds |
| `A` | AM/PM |
| `a` | am/pm |
| `Z` | Offset with colon (+00:00) |
| `ZZ` | Offset without colon (+0000) |
| `z` | Timezone name |
| `X` | Unix seconds |
| `x` | Unix microseconds |

## Notes

- Prefer `import "std:date"`; the older `import "osl/date"` spelling remains supported.

## Behavior and limits

Negative Unix microseconds round down. Calendar arithmetic handles month ends, leap days, and
daylight-saving transitions. Invalid units, fields, and non-finite or overflowing values panic.
Format strings can escape text with brackets or backslashes, and meridiem tokens distinguish noon correctly.
