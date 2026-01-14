# Color Picker

OSL provides a built-in color picker interface that utilizes the HTML system color picker for selecting colors in your applications.

![Color Picker](https://github.com/Mistium/Origin-OS/assets/92952823/4f6dca27-bfd0-430c-b51d-221158d0ec17)

## Available Commands

### Show Color Picker

Displays the color picker interface:

```javascript
colourpicker "show"
```

### Set Position

Positions the color picker at specific screen coordinates:

```javascript
colourpicker "setpos" x y
```

### Set Color

Sets the current color of the picker:

```javascript
colourpicker "setcol" #hexcode
```

### Get Color

Retrieves the currently selected color:

```javascript
colourpicker "getcol"  // Result stored in picker_colour variable
```

## Example Usage

```javascript
// Show the color picker
colourpicker "show"

// Position it on screen
colourpicker "setpos" 100 100

// Set initial color to red
colourpicker "setcol" #FF0000

// Get the selected color
colourpicker "getcol"
log picker_colour  // Outputs the selected color

// Use the selected color
c picker_colour
rectangle 0 0 100 100  // Draws rectangle with selected color
```

## Interactive Example

```javascript
// Create a color selection interface
colourpicker "show"
colourpicker "setpos" 20 20

mainloop:
    // Get current color
    colourpicker "getcol"
    
    // Use color for drawing
    c picker_colour
    rectangle 200 50 100 100
    
    // Display current color value
    text "Selected color: " + picker_colour
```

## Important Notes

- The color picker uses the native HTML color picker interface
- Selected colors are stored in the `picker_colour` variable
- Colors are in hexadecimal format (#RRGGBB)
- Position coordinates are relative to the window
- The color picker remains visible until hidden
- Changes to the color are immediate 