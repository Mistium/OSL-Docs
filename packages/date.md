# date

> Temporal-like date/time system for OSL

```javascript
import "osl/date"
```

## Methods

- `date.now()` → `OSLdateDateTime`
- `date.fromUnix(s)` → `OSLdateDateTime`
- `date.fromUnixMs(ms)` → `OSLdateDateTime`
- `date.duration(value)` → `OSLdateDuration`
- `date.isLeap(year)` → `boolean`
- `date.daysInMonth(year, month)` → `number`

## Returned object: `dateDateTime`

Returned by `date` methods; call these on the value you get back.

- `dateDateTime.unix()` → `number`
- `dateDateTime.unixMs()` → `number`
- `dateDateTime.iso()` → `string`
- `dateDateTime.format(layout)` → `string`
- `dateDateTime.add(unit, value)` → `OSLdateDateTime`
- `dateDateTime.subtract(unit, value)` → `OSLdateDateTime`
- `dateDateTime.addDuration(v)` → `OSLdateDateTime`
- `dateDateTime.since(other)` → `OSLdateDuration`
- `dateDateTime.until(other)` → `OSLdateDuration`
- `dateDateTime.with(field, value)` → `OSLdateDateTime`
- `dateDateTime.round(unit)` → `OSLdateDateTime`
- `dateDateTime.inTimezone(tz)` → `OSLdateZonedDateTime`
- `dateDateTime.compare(other)` → `number`
- `dateDateTime.equals(other)` → `boolean`
- `dateDateTime.before(other)` → `boolean`
- `dateDateTime.after(other)` → `boolean`

## Returned object: `dateDuration`

Returned by `date` methods; call these on the value you get back.

- `dateDuration.totalMilliseconds()` → `number`
- `dateDuration.seconds()` → `number`
- `dateDuration.minutes()` → `number`
- `dateDuration.hours()` → `number`
- `dateDuration.days()` → `number`

## Returned object: `dateZonedDateTime`

Returned by `date` methods; call these on the value you get back.

- `dateZonedDateTime.iso()` → `string`
- `dateZonedDateTime.format(layout)` → `string`
