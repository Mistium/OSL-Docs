# Input State Variables

These global variables provide information about the current state of input devices like mouse, keyboard, and gamepads.

## Mouse Variables

| Variable | Type | Description |
|----------|------|-------------|
| `mouse_down` | Boolean | Whether any mouse button is currently pressed |
| `mouse_ondown` | Boolean | Whether any mouse button was just pressed (true for only one frame) |
| `mouse_left` | Boolean | Whether the left mouse button is currently pressed |
| `mouse_middle` | Boolean | Whether the middle mouse button is currently pressed |
| `mouse_right` | Boolean | Whether the right mouse button is currently pressed |
| `cursor` | String | The current mouse cursor style (e.g., "default", "pointer") |

## Keyboard Variables

| Variable | Type | Description |
|----------|------|-------------|
| `pressed` | String | The key that was most recently pressed |
| `all_pressed` | Array | Array of all keys currently being pressed |
| `all_hit` | Array | Array of keys just pressed in the current frame |

## Scroll Variables

| Variable | Type | Description |
|----------|------|-------------|
| `scroll_velocity` | Number | The current vertical scroll velocity |
| `scroll.x.velocity` | Number | The current horizontal scroll velocity |
| `scroll.y.velocity` | Number | The current vertical scroll velocity (same as scroll_velocity) |
| `scroll.multiplier` | Number | The user's scroll speed multiplier preference |

## Gamepad Support

| Variable | Type | Description |
|----------|------|-------------|
| `getGamepads` | Function | Function to get information about connected gamepads |

## Examples

```javascript
// Check for mouse input
if (mouse_down) {
  log "Mouse is being held down"
}

if (mouse_left) {
  log "Left mouse button is pressed"
}

// Check for keyboard input
if (pressed == "Enter") {
  log "Enter key was just pressed"
}

// Check if a specific key is being held
if (all_pressed.contains("Shift")) {
  log "Shift is being held down"
}

// Respond to scroll input
if (scroll_velocity > 0) {
  log "User is scrolling down"
} else if (scroll_velocity < 0) {
  log "User is scrolling up"
}

// Change cursor style
cursor = "pointer" // Changes mouse cursor to a pointer

// Get gamepad information
gamepads = getGamepads()
if (gamepads.length > 0) {
  log "Gamepad connected: " + gamepads[0].id
}
```