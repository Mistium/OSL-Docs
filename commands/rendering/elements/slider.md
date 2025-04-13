# Slider

## Description

The `slider` command creates an interactive slider control that allows users to select a value by dragging a handle along a track. The slider is positioned relative to the current draw cursor position and automatically maintains its own state.

## Syntax

```javascript
slider width height id
```

## Parameters

- `width`: Width of the slider track in pixels
- `height`: Height of the slider track in pixels
- `id`: Unique identifier for the slider, used to access its value

## Usage Examples

```javascript
// Basic volume slider
goto 100 100
slider 200 20 volumeSlider
// Using ++ to concatenate strings without spaces
log "Volume is set to: " ++ volumeSlider

// Multiple sliders for RGB color mixing
goto 50 50
slider 300 15 redSlider
goto 50 80
slider 300 15 greenSlider
goto 50 110
slider 300 15 blueSlider

c rgb(redSlider * 255, greenSlider * 255, blueSlider * 255)
rectangle 50 150 100 100

// Slider with value display
goto 100 200
slider 250 25 zoomSlider
// Using ++ for direct concatenation without spaces
text "Zoom: " ++ (zoomSlider * 100).round() ++ "%"
```

## Important Notes

- The slider value is automatically stored in a variable matching the provided `id`
- Slider values range from 0 to 1 (0% to 100%)
- The slider handle position reflects the current value
- Sliders are interactive and respond to both mouse and touch input
- Multiple sliders can be used simultaneously with different IDs
- The slider position is relative to the current draw cursor
- Slider state persists between frames unless explicitly changed
- The ID must be unique to avoid conflicts with other UI elements
