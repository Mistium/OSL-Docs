# Display and UI Variables

These global variables provide information about the display, window, and UI state of the OSL environment.

> ⚠️ **Not implemented in the current OSL CLI.** The following display and UI variables are not available: `focused_application`, `focused_application_id`, `is_origin_focused`, `window_top_index`, `badges`.

## Examples

```javascript
// Check if application has focus
if is_origin_focused (
  log "Origin has focus"
)

// Display current application
log "Current application: " ++ focused_application + " (ID: " ++ focused_application_id ++ ")"
```
