# .timestamp("to-date/to-time/to-full/to-relative")

Converts a timestamp to various date and time formats.

## Syntax

```javascript
timestamp.timestamp("to-date")     // Convert to date format
timestamp.timestamp("to-time")     // Convert to time format
timestamp.timestamp("to-full")     // Convert to full date and time
timestamp.timestamp("to-relative") // Convert to relative time
```

## Parameters

The format parameter can be one of:
- `"to-date"`: Returns date in "YYYY-MM-DD" format
- `"to-time"`: Returns time in "HH:MM:SS" format
- `"to-full"`: Returns full datetime in "YYYY-MM-DD HH:MM:SS" format
- `"to-relative"`: Returns relative time (e.g., "8 seconds ago")

## Returns

A string containing the formatted date/time.

## Example

```javascript
current_time = 1706069489000  // January 23, 2025 04:51:29

// Convert to different formats
date = current_time.timestamp("to-date")     // "2025-01-23"
time = current_time.timestamp("to-time")     // "04:51:29"
full = current_time.timestamp("to-full")     // "2025-01-23 04:51:44"
relative = current_time.timestamp("to-relative") // "8 seconds ago"

// Using in UI
text "Date: " + date 10
text "Time: " + time 10
text "Full: " + full 10
text "Posted: " + relative 10
```

## Important Notes

- All formats return strings
- Date format uses leading zeros for month and day
- Time format uses 24-hour clock with leading zeros
- Full format combines both date and time
- Relative format is automatically calculated based on current time
- Invalid timestamps return appropriate error messages 