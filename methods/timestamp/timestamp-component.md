# .timestamp("component")

Extracts a specific time component from a timestamp.

## Syntax

```javascript
timestamp.timestamp("component")
```

## Parameters

- `component`: String specifying which time component to extract:
  - `"year"` - Year
  - `"month"` - Month (1-12)
  - `"day"` - Day of month
  - `"hour"` - Hour (0-23)
  - `"minute"` - Minute (0-59)
  - `"second"` - Second (0-59)

## Returns

Number representing the requested time component.

## Examples

```javascript
timestamp = 1683825624878

// Extract individual components
year = timestamp.timestamp("year")     // 2023
month = timestamp.timestamp("month")    // 5
day = timestamp.timestamp("day")        // 11
hour = timestamp.timestamp("hour")      // 18
minute = timestamp.timestamp("minute")  // 20
second = timestamp.timestamp("second")  // 24

// Use in calculations
if timestamp.timestamp("hour") >= 18 (
    log "It's evening!"
)
```

## Important Notes

- The timestamp should be a valid Unix timestamp in milliseconds
- Returns numeric values that can be used in calculations
- Month values are 1-based (1-12)
- Hours are in 24-hour format (0-23) 