# .timestamp("component")

Returns a specific component of a timestamp.

## Syntax

```javascript
timestamp.timestamp("get-year")   // Get year
timestamp.timestamp("get-month")  // Get month
timestamp.timestamp("get-day")    // Get day
timestamp.timestamp("get-hour")   // Get hour
timestamp.timestamp("get-minute") // Get minute
timestamp.timestamp("get-second") // Get second
```

## Parameters

The component parameter can be one of:
- `"get-year"`: Returns the year (e.g., "2025")
- `"get-month"`: Returns the month with leading zero (e.g., "01")
- `"get-day"`: Returns the day with leading zero (e.g., "23")
- `"get-hour"`: Returns the hour in 24-hour format (e.g., "4")
- `"get-minute"`: Returns the minute with leading zero (e.g., "51")
- `"get-second"`: Returns the second with leading zero (e.g., "29")

## Returns

A string containing the requested timestamp component.

## Example

```javascript
current_time = 1706069489000  // January 23, 2025 04:51:29

// Get individual components
year = current_time.timestamp("get-year")    // "2025"
month = current_time.timestamp("get-month")   // "01"
day = current_time.timestamp("get-day")      // "23"
hour = current_time.timestamp("get-hour")    // "4"
minute = current_time.timestamp("get-minute") // "51"
second = current_time.timestamp("get-second") // "29"

// Using components in a custom format
log month ++ "/" ++ day ++ "/" ++ year  // "01/23/2025"
log hour ++ ":" ++ minute             // "4:51"
```

## Important Notes

- All components are returned as strings
- Months and days always include leading zeros
- Hours are in 24-hour format without leading zeros
- Minutes and seconds always include leading zeros
- Year is always in full 4-digit format 