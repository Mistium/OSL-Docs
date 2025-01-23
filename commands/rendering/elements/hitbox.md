# Hitbox

## Description

The `hitbox` command creates an invisible collision detection area. It can be used to check if specific coordinates (like the mouse position) intersect with the defined area. Hitboxes are positioned relative to the current draw cursor position.

## Syntax

```javascript
hitbox width height checkx checky
hitbox "show"  // Makes all hitboxes visible
hitbox "hide"  // Makes all hitboxes invisible again
```

## Parameters

- `width`: Width of the hitbox in pixels
- `height`: Height of the hitbox in pixels
- `checkx`: X-coordinate to check for collision
- `checky`: Y-coordinate to check for collision

Or:
- `"show"`: Shows all hitboxes (for debugging)
- `"hide"`: Hides all hitboxes

## Usage Examples

```javascript
// Basic collision detection with mouse
goto 100 100
hitbox 50 50 mouse_x mouse_y
if collided (
    log "Mouse is over the 50x50 area at (100,100)"
)

// Multiple hitboxes for a complex shape
goto 200 200
hitbox 100 20 mouse_x mouse_y  // horizontal bar
goto 240 160
hitbox 20 100 mouse_x mouse_y  // vertical bar
if collided (
    log "Mouse is over the cross shape"
)

// Debug visualization
hitbox "show"  // Make hitboxes visible during development
// ... your collision code here ...
hitbox "hide"  // Hide hitboxes again
```

## Important Notes

- The `collided` variable is automatically set after each hitbox check
- Hitboxes are invisible by default
- Multiple hitboxes can be active at once
- The collision area is a rectangle
- Coordinates are checked against the entire hitbox area
- Hitbox position is relative to the current draw cursor
- The "show" and "hide" commands affect all hitboxes globally 