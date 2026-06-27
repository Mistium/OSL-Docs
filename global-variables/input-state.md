# Input State Variables

These global variables provide information about the current state of input devices like mouse, keyboard, and gamepads.

## Mouse Variables

| Variable | Type | Description |
| --- | --- | --- |
| `mouse_down` | Boolean | Whether any mouse button is currently pressed |
| `mouse_ondown` | Boolean | Whether any mouse button was just pressed (true for only one frame) |

> ⚠️ **Not implemented in the current OSL CLI.** The following mouse variables are not available: `mouse_left`, `mouse_middle`, `mouse_right`, `mouse_moving`, `cursor`.

## Keyboard Variables

> ⚠️ **Not implemented in the current OSL CLI.** The following keyboard variables are not available: `all_pressed`, `all_hit`.

## Scroll Variables

> ⚠️ **Not implemented in the current OSL CLI.** The following scroll variables are not available: `scroll_velocity`, `scroll.x.velocity`, `scroll.y.velocity`, `scroll.multiplier`.

## Other Variables

> ⚠️ **Not implemented in the current OSL CLI.** The following variables are not available: `picker_color`.

| Variable | Type | Description |
| --- | --- | --- |
| `getGamepads` | Function | Function to get information about connected gamepads |

## Examples

```javascript
// Check for mouse input
if mouse_down (
  log "Mouse is being held down"
)

if mouse_left (
  log "Left mouse button is pressed"
)

// Check for keyboard input
if pressed == "Enter" (
  log "Enter key was just pressed"
)

// Check if a specific key is being held
if all_pressed.contains("shift") (
  log "Shift is being held down"
)

// Respond to scroll input
if scroll_velocity > 0 (
  log "User is scrolling down"
) else if scroll_velocity < 0 (
  log "User is scrolling up"
)

// Change cursor style
cursor = "pointer" // Changes mouse cursor to a pointer

// Get gamepad information
gamepads = getGamepads()
if gamepads.len > 0 (
  log "Gamepad connected: " + gamepads[0].id
)
```
