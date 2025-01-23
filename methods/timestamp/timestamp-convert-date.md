# .timestamp("convert-date")

Converts a Unix timestamp into a human-readable date and time string.

## Syntax

```javascript
timestamp.timestamp("convert-date")
```

## Parameters

- `"convert-date"`: Literal string specifying the conversion to date format

## Returns

String in the format "YYYY-MM-DD HH:MM:SS"

## Examples

```javascript
timestamp = 1683825624878

// Convert timestamp to readable date
date = timestamp.timestamp("convert-date")
log date  // "2023-05-11 18:20:24"

// Use in string operations
if date.startsWith("2023") (
    log "This is from 2023"
)

// Combine with other operations
current = time.now()
formatted = current.timestamp("convert-date")
log "Current time is: " + formatted
```

## Important Notes

- The timestamp should be a valid Unix timestamp in milliseconds
- Returns date in 24-hour time format
- Date format is fixed as "YYYY-MM-DD HH:MM:SS"
- Time is formatted with leading zeros where needed
- Can be used with the current time using `time.now()` 