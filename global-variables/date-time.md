# Date and Time Variables

These global variables provide information about the current date and time.

## Basic Time Variables

| Variable | Type | Description |
|----------|------|-------------|
| `second` | String | The current second (00-59) |
| `minute` | String | The current minute (00-59) |
| `hour` | String | The current hour in 24-hour format (00-23) |

## Date Variables

| Variable | Type | Description |
|----------|------|-------------|
| `day` | String | The current day of the week (e.g., "Monday", "Tuesday") |
| `day_number` | Number | The current day of the month (1-31) |
| `month` | String | The current month name (e.g., "January", "February") |
| `month_number` | Number | The current month as a number (1-12) |
| `year` | Number | The current year (e.g., 2025) |

## Timezone Information

| Variable | Type | Description |
|----------|------|-------------|
| `timezone` | String | The current timezone (e.g., "UTC+1") |
| `time.offset` | Number | The current timezone offset in milliseconds |
| `time.daylight_savings` | Boolean | Whether daylight saving time is currently active |

## Constants for Day and Month Names

| Variable | Type | Description |
|----------|------|-------------|
| `days` | Array | Array of day names ["Monday", "Tuesday", ...] |
| `months` | Array | Array of month names ["January", "February", ...] |

## Examples

```javascript
// Display current time
log "Current time: " ++ hour ++ ":" ++ minute ++ ":" ++ second

// Display current date
log "Today is " ++ day ++ ", " ++ month ++ " " ++ day_number ++ ", " ++ year

// Format date with conditional suffix
suffix = "th"
if (day_number % 10 == 1 && day_number != 11) suffix = "st"
if (day_number % 10 == 2 && day_number != 12) suffix = "nd"
if (day_number % 10 == 3 && day_number != 13) suffix = "rd"
log "Today is the " ++ day_number ++ suffix ++ " of " ++ month

// Use the arrays to find the day of week by index
tomorrow_index = (days.index(day) + 1) % 7
log "Tomorrow is " ++ days[tomorrow_index]
```