# date

> Dates, durations and time zones

Use `date` for current time, Unix timestamps, durations, time-zone conversion, formatting, and date arithmetic.

```javascript
import "osl/date"
```

## API reference

### `date`

| Method | Returns | Description |
| --- | --- | --- |
| `date.now()` | `dateDateTime` | Returns current date/time. |
| `date.fromUnix(s: number)` | `dateDateTime` | Creates from unix. |
| `date.fromUnixMs(ms: number)` | `dateDateTime` | Creates from unix ms. |
| `date.duration(value: number)` | `dateDuration` | Runs the duration operation. |
| `date.isLeap(year: number)` | `boolean` | Reports whether leap. |
| `date.daysInMonth(year: number, month: number)` | `number` | Runs the days in month operation. |

### `dateDateTime` values

Methods available on `dateDateTime` values returned by this package or constructed by the language.

| Method | Returns | Description |
| --- | --- | --- |
| `value.unix()` | `number` | Runs the unix operation. |
| `value.unixMs()` | `number` | Runs the unix ms operation. |
| `value.iso()` | `string` | Runs the iso operation. |
| `value.format(layout: string)` | `string` | Formats a value for display. |
| `value.add(unit: string, value: number)` | `dateDateTime` | Runs the add operation. |
| `value.subtract(unit: string, value: number)` | `dateDateTime` | Runs the subtract operation. |
| `value.addDuration(v: dateDuration)` | `dateDateTime` | Adds duration. |
| `value.since(other: dateDateTime)` | `dateDuration` | Runs the since operation. |
| `value.until(other: dateDateTime)` | `dateDuration` | Runs the until operation. |
| `value.with(field: string, value: number)` | `dateDateTime` | Runs the with operation. |
| `value.round(unit: string)` | `dateDateTime` | Runs the round operation. |
| `value.inTimezone(tz: string)` | `dateZonedDateTime` | Runs the in timezone operation. |
| `value.compare(other: dateDateTime)` | `number` | Runs the compare operation. |
| `value.equals(other: dateDateTime)` | `boolean` | Runs the equals operation. |
| `value.before(other: dateDateTime)` | `boolean` | Runs the before operation. |
| `value.after(other: dateDateTime)` | `boolean` | Runs the after operation. |

### `dateDuration` values

Methods available on `dateDuration` values returned by this package or constructed by the language.

| Method | Returns | Description |
| --- | --- | --- |
| `value.totalMilliseconds()` | `number` | Runs the total milliseconds operation. |
| `value.seconds()` | `number` | Runs the seconds operation. |
| `value.minutes()` | `number` | Runs the minutes operation. |
| `value.hours()` | `number` | Runs the hours operation. |
| `value.days()` | `number` | Runs the days operation. |

### `dateZonedDateTime` values

Methods available on `dateZonedDateTime` values returned by this package or constructed by the language.

| Method | Returns | Description |
| --- | --- | --- |
| `value.iso()` | `string` | Runs the iso operation. |
| `value.format(layout: string)` | `string` | Formats a value for display. |

## Notes

- Standard-library imports accept both `import "osl/date"` and `import "date"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
