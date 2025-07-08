# Display and UI Variables

These global variables provide information about the display, window, and UI state of the OSL environment.

## Window and Focus Variables

| Variable | Type | Description |
| --- | --- | --- |
| `focused_application` | String | Name of the currently focused application |
| `focused_application_id` | Number | ID of the currently focused application |
| `is_origin_focused` | Boolean | Whether the Origin environment has focus |
| `window_top_index` | Number | Z-index of the topmost window |

## Display Size

| Variable | Type | Description |
| --- | --- | --- |
| `background_width` | Number | Width of the application background in pixels |
| `background_height` | Number | Height of the application background in pixels |

## Badges

| Variable | Type | Description |
| --- | --- | --- |
| `badges` | Object | A list of all currently accessible badges, along with their icn code |

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
log "Current application: " ++ focused_application + " (ID: " ++ focused_application_id ++ ")"
```