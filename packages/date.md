# date

Use `date` for the current time, Unix timestamps, parsing and formatting, calendar arithmetic, durations, and time zones. A `date.DateTime` is an instant in UTC with microsecond precision.

```osl
import "std:date"
```

## Example

```osl
import "std:date"

date.DateTime start = date.parse("2024-01-31T09:30:00Z")
log start.add("mo", 1).iso()                       // 2024-03-02T09:30:00Z
log start.format("dddd D MMMM YYYY, h:mm A")       // Wednesday 31 January 2024, 9:30 AM

date.DateTime later = start.addDuration(date.millis(90 * 60 * 1000))
log later.since(start).minutes()                   // 90
log later.truncate("h").iso()                      // 2024-01-31T11:00:00Z

log start.inTimezone("America/New_York").format("HH:mm Z") // 04:30 -05:00
log date.now().unixMillis()
```

## API reference

### `date`

| Function | Returns | Notes |
| --- | --- | --- |
| `date.now()` | `date.DateTime` | The current instant. |
| `date.parse(text: string, options?: object)` | `result<date.DateTime, error>` | Reads a date or date-time. See [Parsing](#parsing). |
| `date.fromUnix(seconds: int)` | `date.DateTime` | The instant `seconds` after the Unix epoch (1970-01-01 UTC). Negative values are before it. |
| `date.fromUnixMillis(ms: int)` | `date.DateTime` | The instant `ms` milliseconds after the epoch. |
| `date.fromUnixMicros(us: int)` | `date.DateTime` | The instant `us` microseconds after the epoch. |
| `date.millis(ms: number)` | `date.Duration` | A duration of `ms` milliseconds. Fractions keep microsecond precision. Throws `ValueError` for `NaN` or an infinite or out-of-range value. |
| `date.isLeap(year: int)` | `boolean` | Whether the year has a 29 February. |
| `date.daysInMonth(year: int, month: int)` | `int` | Days in `month` (1 to 12). Throws `ValueError` for any other month. |

### `date.DateTime` methods

Methods that change the instant return a new value and leave the original alone.

| Method | Returns | Notes |
| --- | --- | --- |
| `dt.unix()` | `int` | Whole seconds since the epoch, rounded down. |
| `dt.unixMillis()` | `int` | Whole milliseconds since the epoch, rounded down. |
| `dt.unixMicros()` | `int` | Microseconds since the epoch. |
| `dt.iso()` | `string` | RFC 3339 text in UTC, such as `"2024-03-01T12:30:00Z"`. |
| `dt.format(layout: string)` | `string` | Formats in UTC. See [Format tokens](#format-tokens). |
| `dt.add(unit: string, value: number)` | `date.DateTime` | Moves forward by `value` units. See [Units](#units). |
| `dt.subtract(unit: string, value: number)` | `date.DateTime` | Moves back by `value` units. |
| `dt.addDuration(duration: date.Duration)` | `date.DateTime` | Moves by a duration. Throws `ValueError` when the result is out of range. |
| `dt.since(other: date.DateTime)` | `date.Duration` | The time from `other` to `dt`, negative when `other` is later. |
| `dt.until(other: date.DateTime)` | `date.Duration` | The time from `dt` to `other`, negative when `other` is earlier. |
| `dt.with(field: string, value: int)` | `date.DateTime` | Replaces one UTC calendar field: `"year"`, `"month"` (1 to 12), `"day"`, `"hour"`, `"minute"`, or `"second"` (or `"y"`, `"mo"`, `"d"`, `"h"`, `"m"`, `"s"`). Out-of-range values roll over, so 31 February becomes 2 or 3 March. |
| `dt.truncate(unit: string)` | `date.DateTime` | The start of the UTC day, hour, minute, second, or millisecond (`"d"`, `"h"`, `"m"`, `"s"`, `"ms"`, or their long names) that `dt` falls in. |
| `dt.inTimezone(tz: string)` | `result<date.ZonedDateTime, error>` | A view of the instant in an IANA zone such as `"Europe/London"`, for local times. Fails with `ValueError` for an unknown zone. |
| `dt.compare(other: date.DateTime)` | `int` | `-1`, `0`, or `1` as `dt` is before, equal to, or after `other`. |
| `dt.equals(other: date.DateTime)` | `boolean` | Whether both are the same instant. |
| `dt.before(other: date.DateTime)` | `boolean` | Whether `dt` is earlier. |
| `dt.after(other: date.DateTime)` | `boolean` | Whether `dt` is later. |

`add`, `subtract`, `with`, and `truncate` throw `ValueError` for an unknown unit or field, a fractional month or year, or a result out of range.

### `date.Duration` methods

| Method | Returns | Notes |
| --- | --- | --- |
| `d.micros()` | `int` | Whole microseconds. |
| `d.millis()` | `int` | Whole milliseconds, rounded toward zero. |
| `d.seconds()` | `number` | |
| `d.minutes()` | `number` | |
| `d.hours()` | `number` | |
| `d.days()` | `number` | 24-hour days. |

### `date.ZonedDateTime` methods

| Method | Returns | Notes |
| --- | --- | --- |
| `z.iso()` | `string` | RFC 3339 text in the zone with its offset, such as `"2024-03-01T07:30:00-05:00"`. |
| `z.format(layout: string)` | `string` | Formats in the zone, with the same tokens as `dt.format`. |
| `z.timezone()` | `string` | The zone's IANA name. |
| `z.toDateTime()` | `date.DateTime` | The instant without its zone. |

## Units

`add` and `subtract` take `"us"`, `"ms"`, `"s"`, `"m"`, `"h"`, `"d"`, `"mo"`, or `"y"`, or the long names (`"minutes"`, `"day"`, ...). Months and years move by calendar, so 31 January plus a month is 2 or 3 March, and they need whole numbers. Days are 24 hours in UTC.

## Format tokens

| Token | Meaning |
| --- | --- |
| `YYYY`, `YY` | Year |
| `MMMM`, `MMM`, `MM`, `M` | Month name, short name, two-digit, number |
| `DD`, `D` | Day of the month |
| `dddd`, `ddd` | Weekday name, short name |
| `HH`, `H` | Hour, 24-hour clock |
| `hh`, `h` | Hour, 12-hour clock |
| `A`, `a` | AM/PM, am/pm |
| `mm`, `m` | Minute |
| `ss`, `s` | Second |
| `SSS`, `SSSSSS` | Milliseconds, microseconds |
| `Z`, `ZZ` | UTC offset |
| `z` | Zone name |
| `X`, `x` | Unix seconds, Unix microseconds |

Text in `[brackets]` and a character after `\` are written literally.

## Parsing

Without a format, `date.parse` accepts ISO 8601 / RFC 3339 forms: `"2024-03-01"`, `"2024-03-01T12:30"`, `"2024-03-01 12:30:05"`, `"2024-03-01T12:30:05.250Z"`, and `"2024-03-01T12:30:05+02:00"`.

Options:

- `format`: a layout using the format tokens above, such as `"DD/MM/YYYY HH:mm"`.
- `timezone`: the IANA zone for text without an offset. Default `"UTC"`.

Missing fields default to the start of the period. `parse` fails with `ParseError` when the text doesn't match, and throws `ValueError` for an unknown time zone or a token that can't be parsed (`z`).

```osl
import "std:date"

date.DateTime meeting = date.parse("01/03/2024 12:30", {format: "DD/MM/YYYY HH:mm", timezone: "Europe/Paris"})
log meeting.iso() // 2024-03-01T11:30:00Z

auto parsed = date.parse("next tuesday")
if parsed.isErr() (
  log parsed.unwrapErr().kind // ParseError
)
```

## Changes from earlier versions

The abbreviated names are gone: `fromUnixMs`, `fromUnixUs`, `unixMs`, and `unixUs` are now `fromUnixMillis`, `fromUnixMicros`, `unixMillis`, and `unixMicros`, and `date.nowUs()` is `date.now().unixMicros()`. `date.duration(us)` gave way to `date.millis(ms)`, which takes milliseconds, and `dt.round(unit)` to `dt.truncate(unit)`.

## Behavior and limits

- Negative Unix timestamps round down.
- Calendar arithmetic handles month ends, leap days, and daylight-saving transitions.
- Meridiem tokens treat noon as PM.
- The older `import "osl/date"` spelling still works with a migration warning.
