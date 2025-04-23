# Bar

## Description

The `bar` command draws a progress bar with customizable dimensions, corner rounding, and fill percentage. The bar is positioned relative to the current draw cursor position and uses the current color for both the outline and fill.

## Syntax

```javascript
bar width height rounding percent
```

## Parameters

- `width`: Total width of the progress bar in pixels
- `height`: Height of the progress bar in pixels
- `rounding`: Radius of the rounded corners in pixels
- `percent`: Fill percentage as a decimal between 0 and 1 (e.g., 0.75 for 75% filled)

## Usage Examples

```javascript
// Basic progress bar at 75%
c #00ff00
goto 100 100
bar 300 10 5 0.75

// Thin progress bar with sharp corners
c #ff0000
goto 100 150
bar 200 5 0 0.5

// Wide progress bar with heavily rounded corners
c #0000ff
goto 100 200
bar 400 30 15 0.25
```

```javascript
// Loading animation
c #ffffff
goto 50 50
progress = 0

mainloop:
bar 200 20 10 progress
progress += 0.01
```

## Important Notes

- The bar is drawn using the current color (set with the `c` command)
- The fill percentage should be between 0 (empty) and 1 (full)
- The progress bar is drawn from left to right
- Corner rounding can be set to 0 for sharp corners
- The bar position is relative to the current draw cursor
- Both the outline and fill use the same color
- The progress bar maintains its appearance regardless of window scaling 
