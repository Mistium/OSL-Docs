# Display and UI Variables

These global variables provide information about the display, window, and UI state of the OSL environment.

## Window and Focus Variables

| Variable | Type | Description |
|----------|------|-------------|
| `focused_application` | String | Name of the currently focused application |
| `focused_application_id` | Number | ID of the currently focused application |
| `is_origin_focused` | Boolean | Whether the Origin environment has focus |
| `window_top_index` | Number | Z-index of the topmost window |

## Display Variables

| Variable | Type | Description |
|----------|------|-------------|
| `background_width` | Number | Width of the application background in pixels |
| `background_height` | Number | Height of the application background in pixels |
| `picker_colour` | String | Currently selected color in the color picker (hex format) |
| `on_mobile` | Boolean | Whether the app is running on a mobile device |

## Battery Information

| Variable | Type | Description |
|----------|------|-------------|
| `battery_charging` | Boolean | Whether the device is currently charging |
| `battery_percent` | Number | Current battery percentage (0-100) |
| `battery_time_until_full` | Number | Estimated time in seconds until battery is fully charged (null if not charging) |
| `battery_time_until_empty` | Number | Estimated time in seconds until battery is depleted |

## Examples

```javascript
// Center an element on the screen
position_x = background_width / 2 - element_width / 2
position_y = background_height / 2 - element_height / 2

// Check if application has focus
if is_origin_focused (
  log "Origin has focus"
)

// Display current application
log "Current application: " + focused_application + " (ID: " + focused_application_id + ")"

// Display battery information
if battery_charging (
  log "Battery: " + battery_percent + "% (Charging, " + formatTime(battery_time_until_full) + " until full)"
) else (
  log "Battery: " + battery_percent + "% (" + formatTime(battery_time_until_empty) + " remaining)"
)

// Helper function to format time in seconds to a readable format
def formatTime(seconds) (
  if seconds == null (
    return "Unknown"
  )
  
  hours = Math.floor(seconds / 3600)
  minutes = Math.floor((seconds % 3600) / 60)
  
  if hours > 0 (
    return hours + "h " + minutes + "m"
  ) else (
    return minutes + "m"
  )
)

// Responsive layout based on device type
if on_mobile (
  // Use mobile-friendly layout
  element_width = background_width * 0.9
) else (
  // Use desktop layout
  element_width = background_width * 0.6
)
```
