# Timestamp Methods

OSL provides powerful methods for working with timestamps and date/time conversions.

## Converting Timestamps

### To Date/Time Formats

```javascript
timestamp.timestamp("to-date")     // Returns "YYYY-MM-DD"
timestamp.timestamp("to-time")     // Returns "HH:MM:SS"
timestamp.timestamp("to-full")     // Returns "YYYY-MM-DD HH:MM:SS"
timestamp.timestamp("to-relative") // Returns relative time (e.g., "8 seconds ago")
```

### Getting Components

```javascript
timestamp.timestamp("get-year")   // Returns year (e.g., "2025")
timestamp.timestamp("get-month")  // Returns month with leading zero (e.g., "01")
timestamp.timestamp("get-day")    // Returns day with leading zero (e.g., "23")
timestamp.timestamp("get-hour")   // Returns hour (e.g., "4")
timestamp.timestamp("get-minute") // Returns minute with leading zero (e.g., "51")
timestamp.timestamp("get-second") // Returns second with leading zero (e.g., "29")
```

## Examples

```javascript
current_time = 1706069489000  // Example timestamp

// Converting to different formats
current_time.timestamp("to-date")     // "2025-01-23"
current_time.timestamp("to-time")     // "04:51:29"
current_time.timestamp("to-full")     // "2025-01-23 04:51:44"
current_time.timestamp("to-relative") // "8 seconds ago"

// Getting specific components
current_time.timestamp("get-year")    // "2025"
current_time.timestamp("get-month")   // "01"
current_time.timestamp("get-day")     // "23"
current_time.timestamp("get-hour")    // "4"
current_time.timestamp("get-minute")  // "51"
current_time.timestamp("get-second")  // "29"
```

## Important Notes

1. **Format Details**
   - Date format: "YYYY-MM-DD"
   - Time format: "HH:MM:SS"
   - Full format: "YYYY-MM-DD HH:MM:SS"
   - Relative format: Human-readable time difference

2. **Component Formatting**
   - Months and days include leading zeros
   - Hours are in 24-hour format without leading zeros
   - Minutes and seconds include leading zeros
   - Year is full 4-digit format

3. **Usage Tips**
   - All methods return strings
   - Relative time is automatically calculated
   - Invalid timestamps return appropriate error messages
   - Methods can be chained with other string operations

## Available Methods

- [.timestamp("component")](timestamp-component.md) - Extract specific time components
- [.timestamp("convert-date")](timestamp-convert-date.md) - Convert timestamp to readable date
- [.timestamp("convert-timestamp")](timestamp-convert-timestamp.md) - Convert date string to timestamp 