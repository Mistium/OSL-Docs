# Clipping and Scrolling with Frames

OSL provides a powerful frame system for clipping content and creating scrollable areas in your applications.

## Basic Clipping

The `frame` command lets you define a rectangular area that clips (masks) any content drawn inside it. Content outside the frame's boundaries will not be visible.

### Syntax

```javascript
frame left top right bottom (
    // Content to be clipped goes here
)
```

The frame boundaries are defined by four coordinates:
- `left`: Left edge position (x-coordinate)
- `top`: Top edge position (y-coordinate)
- `right`: Right edge position (x-coordinate)
- `bottom`: Bottom edge position (y-coordinate)

### Example: Basic Clipping

```javascript
// Define frame boundaries
left = -100
right = 100    // Creates a 200px wide frame
top = 100
bottom = -100  // Creates a 200px tall frame

mainloop:
    frame left top right bottom (
        // Draw a large square that will be clipped
        square 10000 10000 20
        // Only the portion within the 200x200 frame will be visible
    )
```

## Scrollable Frames

You can create scrollable areas by adding content dimensions and a frame ID to the frame command.

### Syntax

```javascript
frame left top right bottom [content_width, content_height] "frame_id" (
    // Scrollable content goes here
)
```

Additional parameters:
- `[content_width, content_height]`: Dimensions of the scrollable content area
- `"frame_id"`: Unique identifier for the scrollable frame

### Example: Scrollable Content

```javascript
// Style settings
text_size = 10
image_width = 150

mainloop:
    // Create a 200x200 frame with 1000x200 scrollable content
    frame -100 100 100 -100 [1000, 200] "my_scroll_frame" (
        // Position content using scroll coordinates
        goto scroll_x scroll_y
        
        // Add text
        text "Header Text" text_size
        
        // Move down for next element
        change_y -20
        
        // Add an image
        image my_image image_width
        
        // Move down again
        change_y -20
        
        // Add more content...
        text "More content below..." text_size
    )
```

## Important Notes

1. **Frame Coordinates**
   - Coordinates are relative to the center of the screen
   - Positive Y goes up, negative Y goes down
   - Frame size = (right - left) × (top - bottom)

2. **Scrolling Behavior**
   - Scrollbars appear automatically when content exceeds frame size
   - Scroll position is tracked via `scroll_x` and `scroll_y` variables
   - Content coordinates are relative to scroll position

3. **Best Practices**
   - Use meaningful frame IDs for easier management
   - Consider padding inside frames for better appearance
   - Update content layout based on scroll position
   - Clean up or reset scroll position when needed

4. **Common Use Cases**
   - Long text documents
   - Image galleries
   - Lists and menus
   - Content that exceeds screen size
