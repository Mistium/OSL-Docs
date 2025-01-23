# Input Simulation

OSL provides commands to simulate keyboard and mouse inputs at a system level.

## Required Permission

Before using any simulation commands, you must request and receive the "simulate inputs" permission:

```javascript
permission "request" "simulate inputs"
// User will be prompted to approve or deny
```

## Keyboard Simulation

You can simulate keyboard input using the `simulate "keypress"` command:

```javascript
// Simulate letter keys
simulate "keypress" "A"
simulate "keypress" "B"

// Simulate special keys
simulate "keypress" "Space"
simulate "keypress" "Enter"
simulate "keypress" "Tab"
```

## Mouse Simulation

OSL provides commands to simulate various mouse clicks at specific screen coordinates:

```javascript
// Left click simulation
simulate "leftclick" 100 200   // Clicks at (100, 200)

// Middle click simulation
simulate "middleclick" 100 200

// Right click simulation
simulate "rightclick" 100 200
```

## Important Notes

- All coordinates are global screen coordinates, not window-relative
- Mouse simulations work outside your application window
- The permission must be granted before any simulation will work
- Simulations happen at the system level
- Use these commands responsibly to avoid unintended behavior

## Best Practices

1. Always check if permission is granted before attempting simulations
2. Verify coordinates before simulating mouse clicks
3. Consider adding delays between simulations if needed
4. Handle cases where permission might be denied
5. Use simulations sparingly and only when necessary

## Example Usage

```javascript
// Request permission first
permission "request" "simulate inputs"

// Simulate typing "Hello"
simulate "keypress" "H"
simulate "keypress" "e"
simulate "keypress" "l"
simulate "keypress" "l"
simulate "keypress" "o"
simulate "keypress" "Space"

// Simulate mouse interaction
simulate "leftclick" mouse_x mouse_y  // Click at current mouse position
```

## Security Considerations

- These commands can control the user's system
- Always inform users about how simulations will be used
- Request permission at an appropriate time
- Handle permission denial gracefully
- Consider providing alternative methods when permission is denied 