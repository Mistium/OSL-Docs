# URI commands

URI commands apply filters and other whole-image changes. They are slower than Canvas commands.

## Loading an image

URI commands edit one image at a time. `"start_editing"` loads an image URI and replaces any image already loaded. `"stop_editing"` removes it from memory.

```javascript
// Load an image to edit.
uri "start_editing" "[data:uri or link to image]"

// Remove that image from memory (optional, but good practice).
uri "stop_editing"
```

## Reading image data

### Image output

`"get_output"` writes the current image to the `data` variable as a data URI. Pass that value to an Image command to display it.

```javascript
uri "get_output"
outputImage = data

// Take the resulting data and plug it into an image element.
image "load" outputImage "test_image"
image "test_image"
```

### Image dimensions

`"get_width_height"` sets `data` to `[width, height]`.

```javascript
uri "get_width_height"

// Logs the image width
log data[1]
// Logs the image height
log data[2]
```

### Pixel count

`"get_total_pixels"` sets `data` to the image's pixel count, `width * height`.

## Image modification

### Pixel editing

Prefer Canvas commands for pixel editing. URI commands also provide `"get_pixel"` and `"set_pixel"`, which accept x and y coordinates. `"set_pixel"` also accepts a hex color.

```javascript
// Get the hex of the pixel at (10, 20).
uri "get_pixel" 10 20

// Change the pixel at (15, 5) to a cute color.
uri "set_pixel" 15 5 #ef92e2
```

### Resizing

`"stretch"` resizes the image to the given width and height.

```javascript
// Resize the image to be 128 x 64 pixels.
uri "stretch" 128 64
```

### Other commands

| Syntax | Description |
| --- | --- |
| `uri "replace_colour" [hex a] [hex b] [0-100]` | Replaces `hex a` and colors within the given similarity percentage with `hex b`. |
| `uri "remove_colour" [hex code] [0-100]` | Functionally similar to the above command, however removes all instances of the specified hex. |
| `uri "remove_transparent" [mode] [0-100]` | Removes pixels whose alpha is `over`, `under`, or `equal_to` the given percentage. |
| `uri "add_hue" [hex code]` | Tints the image with the specified color. |
| `uri "upscale" [percent]` | Attempts to increase the quality of the image by a given percent. Useful for resized images. |
| `uri "blur" [pixels]` | Blurs the image by the specific amount of pixels. A lot faster than the variant in the `"effect"` command. |

### Image effects

The `effect` command takes an effect name and a percentage.

```javascript
uri "effect" "[one of the ops below]" [percentage]
```

| Name | Description |
| --- | --- |
| `"saturation"` | Saturates the image. 100% is default, and 0% is grayscale. |
| `"contrast"` | Modifies the image's contrast value. 0% is default. |
| `"opaque"` | Modifies the alpha value of the image. 0% is default; increasing this causes transparent areas to become more visible and decreasing this causes the images to become transparent. |
| `"glitch"` | Applies a static effect to the image. The pattern is randomized each time the effect is applied. 0% is default. |
| `"chunk glitch"` | Randomly stretch parts of the image, distorting it. 0% is default. |
| `"clip glitch"` | Creates large squares randomly on the image. 0% is default. |
| `"vignette"` | Surrounds the image in a circular gradient. 0% is default; positive values provide a white border, while negative values use black. |
| `"ripple"` | Shifts values along the x axis, distorting the image. 0% is default. |
| `"displacement"` | Shifts each pixel to a random nearby location. 0% is default. |
| `"posterize"` | Reduces the colors in an image. Higher percentages are closer to the original image; percentages too low may cause the entire image to turn black. |
| `"blur"` | Blurs the image. A lot slower than the built-in blur command above. |
| `"sepia"` | Applies the filter from Breaking Bad to the image. 0% is default. |
| `"scanlines"` | Randomly modifies rows of pixels, distorting the original image. 0% is default. |
| `"grain"` | Randomly modifies individual pixels, distorting the original image. 0% is default. |
| `"cubism"` | Pixelates the image. 0% is default, with higher percentages decreasing the amount of pixels. |
