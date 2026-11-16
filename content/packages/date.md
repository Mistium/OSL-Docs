---
description: Build, parse, format and compare dates and times, do arithmetic on them, and show them in any time zone.
package: date
---

# date

`std:date` is for anything with a calendar or a clock: parsing a timestamp, adding 30 days to a deadline, working out how long ago something happened, or showing the same moment in London and Tokyo. Three types do the work:

- `date.DateTime` is one instant in time, held in UTC. Every date you parse or build is one.
- `date.Duration` is a length of time, such as the gap between two instants.
- `date.ZonedDateTime` is a view of an instant in a time zone, for showing local times.

A `DateTime` never changes. Every method that "changes" it returns a new one.

## Parsing a date

`date.parse(text)` reads ISO 8601 dates and times and returns a [result](result.md), because the text may not be a date:

```osl
import "std:date"

auto d = date.parse("2024-03-15T14:30:00Z").unwrap()
log d.iso()
log d.unix()
```

```output
2024-03-15T14:30:00Z
1710513000
```

`iso()` writes the instant back as text in UTC. `unix()` is whole seconds since 1 January 1970 (the Unix epoch), the form most APIs and files use.

Without a format, `parse` accepts these shapes:

```osl
import "std:date"

string[] inputs = [
  "2024-03-01",
  "2024-03-01T12:30",
  "2024-03-01 12:30:05",
  "2024-03-01T12:30:05.250Z",
  "2024-03-01T12:30:05+02:00"
]
for text in inputs (
  log date.parse(text).unwrap().iso()
)
```

```output
2024-03-01T00:00:00Z
2024-03-01T12:30:00Z
2024-03-01T12:30:05Z
2024-03-01T12:30:05Z
2024-03-01T10:30:05Z
```

Missing parts default to the start of the period (a date with no time is midnight). An offset such as `+02:00` is applied, so the last line is two hours earlier in UTC.

## When parsing fails

Dates from users and files are often wrong. A bad one fails with a `ParseError`, and the calendar is checked, so 30 February is rejected:

```osl
import "std:date"

string[] inputs = ["2024-03-15", "yesterday", "2024-02-30"]
for text in inputs (
  date.DateTime d = date.parse(text) catch (e) (
    log text ++ " -> " ++ e.kind
    continue
  )
  log text ++ " -> ok " ++ d.format("MMM D")
)
```

```output
2024-03-15 -> ok Mar 15
yesterday -> ParseError
2024-02-30 -> ParseError
```

## Parsing other formats

Pass `format` with the same tokens that `format()` uses (listed below) to read a layout that isn't ISO:

```osl
import "std:date"

auto uk = date.parse("15/03/2024", {format: "DD/MM/YYYY"}).unwrap()
auto us = date.parse("March 5, 2024", {format: "MMMM D, YYYY"}).unwrap()
log uk.iso()
log us.iso()
```

```output
2024-03-15T00:00:00Z
2024-03-05T00:00:00Z
```

Text with no offset is read as UTC. If it was written in another zone, say which with the `timezone` option and it is converted:

```osl
import "std:date"

auto tokyo = date.parse("2024-06-01 09:00", {timezone: "Asia/Tokyo"}).unwrap()
log tokyo.iso()
```

```output
2024-06-01T00:00:00Z
```

Nine in the morning in Tokyo (UTC+9) is midnight UTC, nine hours earlier on the same clock. Keep this habit: parse at the edge of your program into an instant, work with instants, and convert to a zone only to display.

## Formatting

`format(layout)` writes the date using tokens:

```osl
import "std:date"

auto d = date.parse("2024-03-15T14:30:05Z").unwrap()
log d.format("YYYY-MM-DD")
log d.format("D MMM YYYY")
log d.format("dddd, MMMM D, YYYY")
log d.format("HH:mm:ss")
log d.format("h:mm A")
log d.format("[Week] ddd")
log d.format("X")
```

```output
2024-03-15
15 Mar 2024
Friday, March 15, 2024
14:30:05
2:30 PM
Week Fri
1710513005
```

| Token | Meaning |
| --- | --- |
| `YYYY` `YY` | year |
| `MMMM` `MMM` `MM` `M` | month: name, short name, two digits, one or two digits |
| `DD` `D` | day of the month |
| `dddd` `ddd` | weekday name, short weekday name |
| `HH` `H` | hour, 24-hour clock |
| `hh` `h` and `A` `a` | hour, 12-hour clock, and AM/PM |
| `mm` `m`, `ss` `s` | minute, second |
| `SSS` `SSSSSS` | fraction of a second |
| `Z` `ZZ` `z` | offset (`+02:00`, `+0200`) and zone name |
| `X` | unix seconds |

Wrap literal text in square brackets, as `[Week]` is above, so its letters aren't read as tokens.

## Building dates from parts

There is no constructor taking year, month and day. Parse a string, or start from a unix time and move from there:

```osl
import "std:date"

log date.fromUnix(0).iso()
log date.fromUnixMillis(1700000000000).iso()

auto year = 2025
auto month = 9
auto d = date.parse(year ++ "-0" ++ month ++ "-01").unwrap()
log d.format("dddd")
```

```output
1970-01-01T00:00:00Z
2023-11-14T22:13:20Z
Monday
```

`date.daysInMonth(year, month)` and `date.isLeap(year)` answer calendar questions without a date at all:

```osl
import "std:date"

log date.daysInMonth(2024, 2) date.daysInMonth(2025, 2)
log date.isLeap(2024) date.isLeap(1900) date.isLeap(2000)
```

```output
29 28
true false true
```

## Arithmetic

`add(unit, amount)` and `subtract` move an instant. Units are `"y"`, `"mo"`, `"d"`, `"h"`, `"m"`, `"s"`, `"ms"` and `"us"`, or the long names such as `"days"`:

```osl
import "std:date"

auto d = date.parse("2024-03-15T14:30:00Z").unwrap()
log d.add("days", 20).iso()
log d.add("hours", 36).iso()
log d.subtract("m", 45).iso()
log d.add("y", 1).iso()
log d.iso()
```

```output
2024-04-04T14:30:00Z
2024-03-17T02:30:00Z
2024-03-15T13:45:00Z
2025-03-15T14:30:00Z
2024-03-15T14:30:00Z
```

The last line shows `d` itself is untouched.

Months and years follow the calendar, so they can land past the end of a short month. January 31 plus a month is "February 31", which rolls over to March:

```osl
import "std:date"

auto d = date.parse("2024-01-31T10:00:00Z").unwrap()
log d.add("mo", 1).iso()
```

```output
2024-03-02T10:00:00Z
```

If you need "the last day of next month", use `date.daysInMonth` and `with`. Days are always 24 hours, so adding a day never lands on a different time of day.

## Changing one field

`with(field, value)` replaces one field. `truncate(unit)` zeroes everything smaller than a unit:

```osl
import "std:date"

auto d = date.parse("2024-03-15T14:30:45Z").unwrap()
log d.with("year", 2000).iso()
log d.with("day", 1).iso()
log d.truncate("day").iso()
log d.truncate("hour").iso()
```

```output
2000-03-15T14:30:45Z
2024-03-01T14:30:45Z
2024-03-15T00:00:00Z
2024-03-15T14:00:00Z
```

`truncate("day")` is how you get the start of a day, to group events by date or compare dates ignoring the time.

## Comparing

Compare with `before`, `after`, `equals` or `compare`, which is -1, 0 or 1 and suits sorting:

```osl
import "std:date"

auto a = date.parse("2024-01-01").unwrap()
auto b = date.parse("2024-06-01").unwrap()
log a.before(b) a.after(b) a.equals(a)
log a.compare(b)

date.DateTime[] dates = [b, a, date.parse("2023-01-01").unwrap()]
log dates.toSortedBy(d -> d.unix()).map(d -> d.format("YYYY-MM-DD"))
```

```output
true false true
-1
["2023-01-01","2024-01-01","2024-06-01"]
```

## Durations

`until(other)` and `since(other)` return a `date.Duration`, which you read in whatever unit you want. `until` is negative when the other date is earlier, and `since` is the opposite:

```osl
import "std:date"

auto start = date.parse("2024-07-01T12:00:00Z").unwrap()
auto end = date.parse("2024-12-25").unwrap()
auto gap = start.until(end)

log floor(gap.days())
log gap.hours()
log end.until(start).days() < 0
```

```output
176
4236
true
```

A duration offers `days()`, `hours()`, `minutes()`, `seconds()` (numbers, with fractions) and `millis()` and `micros()` (whole numbers). To get whole days, use `floor` as above.

`date.millis(ms)` makes a duration to add, and the constants `date.second`, `date.minute`, `date.hour`, `date.day` and `date.week` are those lengths in milliseconds:

```osl
import "std:date"

auto d = date.parse("2024-03-15T14:30:00Z").unwrap()
log d.addDuration(date.millis(date.hour * 2)).iso()
log date.week / date.day
```

```output
2024-03-15T16:30:00Z
7
```

## Time zones

`inTimezone(name)` returns a `ZonedDateTime` for an IANA name such as `Europe/London`. It is the same instant, shown on that zone's clock, daylight saving included:

```osl
import "std:date"

auto launch = date.parse("2024-07-01T12:00:00Z").unwrap()
for zone in ["Europe/London", "America/Los_Angeles", "Asia/Tokyo"] (
  auto z = launch.inTimezone(zone).unwrap()
  log zone z.format("HH:mm z")
)
log launch.inTimezone("America/Los_Angeles").unwrap().iso()
```

```output
Europe/London 13:00 BST
America/Los_Angeles 05:00 PDT
Asia/Tokyo 21:00 JST
2024-07-01T05:00:00-07:00
```

A zoned value can format and write `iso()` with its offset, tell you its `timezone()`, and give back the plain instant with `toDateTime()`. To do arithmetic, go back to a `DateTime`, do it, and convert again. An unknown zone name returns an error result, so a user-supplied zone should be checked:

```osl
import "std:date"

auto d = date.parse("2024-07-01T12:00:00Z").unwrap()
log d.inTimezone("Nowhere/Land").isErr()
```

```output
true
```

## The current time

`date.now()` is the current instant, and `now.unix()` is a timestamp in seconds. The value differs every run, so print facts about it, not the value:

```osl
import "std:date"

auto now = date.now()
auto earlier = now.subtract("d", 1)
log now.after(earlier)
log floor(earlier.until(now).hours())
log now.unix() > 1700000000
```

```output
true
24
true
```

To time how long something takes, subtract two instants: `date.now().since(start).millis()`.

:::quiz
What does this print?

```osl fragment
auto d = date.parse("2024-01-31T10:00:00Z").unwrap()
log d.add("mo", 1).iso()
```

- [ ] `2024-02-29T10:00:00Z`, the last day of February.
- [x] `2024-03-02T10:00:00Z`
- [ ] It throws, because February has no 31st.

Months follow the calendar and don't clamp, so "February 31" rolls over into March (2024 is a leap year, so two days past the 29th).
:::

:::exercise title="Days until the deadline"
A project is due on 2025-03-31. Given today's date, print how many whole days are left and the weekday the deadline falls on.

```osl
import "std:date"

auto today = date.parse("2025-02-14").unwrap()
auto due = date.parse("2025-03-31").unwrap()

log today.iso() due.iso()
```

```output
45
Monday
```

> [!hint]
> `today.until(due).days()` gives a number with a fraction. `floor` removes it.

> [!hint]
> `due.format("dddd")` is the weekday name.

```osl solution
import "std:date"

auto today = date.parse("2025-02-14").unwrap()
auto due = date.parse("2025-03-31").unwrap()

log floor(today.until(due).days())
log due.format("dddd")
```
:::

## API reference

::api
