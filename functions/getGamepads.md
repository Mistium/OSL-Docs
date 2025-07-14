# getGamepads()

The `getGamepads()` function provides access to connected game controllers in OSL applications. It returns an array of gamepad objects with normalized properties for easy access to controller inputs.

```javascript
// Get all connected gamepads
array gamepads = getGamepads()

// Check if any gamepad is connected
if gamepads.len > 0 (
  // Use the first gamepad
  gamepad @= gamepads[1]
  say "Gamepad mode enabled"
)
```

## Return Value

Returns an array of gamepad objects, with each object containing the following properties:

* `id`: String identifying the gamepad
* `index`: Numeric index of the gamepad
* `connected`: Boolean indicating if the gamepad is connected
* `timestamp`: The last time the gamepad state was updated
* `mapping`: String indicating the mapping type (e.g., "standard")
* `axes`: Array of objects representing analog sticks, each with:
  * `x`: X-axis value (range: -1.0 to 1.0)
  * `y`: Y-axis value (range: -1.0 to 1.0, inverted for natural directional control)
* `buttons`: Array of button objects, each with:
  * `pressed`: Boolean indicating if the button is pressed
  * `touched`: Boolean indicating if the button is touched
  * `value`: Numeric value of the button pressure (range: 0.0 to 1.0)
* `haptic`: Function to trigger vibration feedback on the controller (when supported)

## Common Button Indexes

Standard gamepad mappings can be found below:[Mappings](https://w3c.github.io/gamepad/#remapping)

## Example application

An app with support for gamepads is Arrow by Mist, source code found below:

[Arrow On Github](https://github.com/RoturTW/apps/blob/main/all/arrow/script.osl)

## Example: Checking a Specific Button Press

```javascript
if gamepads.len > 0 (
  // Check if the A button (index 1) is pressed
  if gamepads[1].buttons[1]["pressed"] (
    say "A button pressed!"
  )
)
```

## Example: Reading Analog Stick Values

```javascript
if gamepads.len > 0 (
  // Get left stick X and Y values
  leftX = gamepads[1].axes[1].x
  leftY = gamepads[1].axes[1].y
  
  // Move a character based on left stick position
  player.x += leftX * player.speed
  player.y += leftY * player.speed
)
```

## Example: Using Haptic Feedback

```javascript
if gamepads.len > 0 (
  // Trigger vibration on the controller
  void gamepads[1].haptic({
    duration: 100,       /* vibration duration in milliseconds */
    weakMagnitude: 0.5,  /* intensity of the weak motor (0.0 to 1.0) */
    strongMagnitude: 0.8  /* intensity of the strong motor (0.0 to 1.0) */
  })
)
```

## Notes

* If no gamepads are connected, the function returns an empty array.
* Gamepad support varies by browser and device.
* The haptic function may not work on all controllers or platforms.
