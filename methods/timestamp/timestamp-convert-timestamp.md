# .timestamp("convert-timestamp")

Converts a date string into a Unix timestamp.

## Syntax

```javascript
dateString.timestamp("convert-timestamp")
```

## Parameters

- `"convert-timestamp"`: Literal string specifying the conversion to timestamp

## Returns

Number representing the Unix timestamp in milliseconds.

## Examples

```javascript
// Convert date string to timestamp
date = "2023-05-11 18:20:24"
timestamp = date.timestamp("convert-timestamp")
log timestamp  // 1683825624878

// Use in comparisons
now = time.now()
then = "2023-01-01 00:00:00".timestamp("convert-timestamp")
if now > then (
    log "That date has passed"
)

// Calculate time differences
start = "2023-05-11 18:20:24".timestamp("convert-timestamp")
end = "2023-05-11 19:20:24".timestamp("convert-timestamp")
difference = end - start
log difference  // 3600000 (1 hour in milliseconds)
```

## Important Notes

- Input string must be in the format "YYYY-MM-DD HH:MM:SS"
- Returns timestamp in milliseconds
- Invalid date strings will return an error
- Useful for time comparisons and calculations
- Can be combined with other timestamp methods 