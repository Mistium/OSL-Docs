# URI Commands

OSL's URI commands are a series of commands intended for applying filters, tranformations, and other changes to images. These commands are a lot slower than the Canvas commands, however provide more utility in image-wide modifications.

## Handling Images

URI commands can only load and edit one image at a time. To initialize an image to edit, we can use the `"start_editing"` command in tandem with an image URI. If an image was already being edited, then that image will be overwritten. To remove a URI from memory, the `"stop_editing"` command can be called.

```javascript
// Load an image to edit.
uri "start_editing" "[data:uri or link to image]"

// Remove that image from memory (optional, but good practice).
uri "stop_editing"
```

## Getting Image Data

### Image Output

By using the `"get_output"` command, the image's current state will be logged to the "data" variable as a dataURI. This in turn can be plugged into an Image command to view the resulting image.

```javascript
uri "get_output"
outputImage = data

// Take the resulting data and plug it into an image element.
image "load" outputImage "test_image"
image "test_image"
```

### Image Width/Height

Running the `"get_width_height"` argument sets the "data" variable to an array with 2 values. The former value is the image's width, while the latter is it's height.

```javascript
uri "get_width_height"

// Logs the image width
log data[1]
// Logs the image height
log data[2]
```

### Image Total Pixels

The `"get_total_pixels"` command sets the "data" variable to the total amount of pixels in the image (width \* height).

## Image Modification

### Pixel Editing

Although pixel-by-pixel modification can and should be done via the Canvas commands, URI commands also contains functions to read and write colors to specific pixels. `"get_pixel"` and `"set_pixel"` can be used in tandem with a x-y coordinate pair and (if applicable) a hex code in order to achieve this.

```javascript
// Get the hex of the pixel at (10, 20).
uri "get_pixel" 10 20

// Change the pixel at (15, 5) to a cute color.
uri "set_pixel" 15 5 #ef92e2
```

### Resizing

By using the `"stretch"` command, an image can be resized to fill a specific width and height.

```javascript
// Resize the image to be 128 x 64 pixels.
uri "stretch" 128 64
```

### Miscellaneous Commands

| Syntax | Description |
| --- | --- |
| `uri "replace_colour" [hex a] [hex b] [0-100]` | Replaces all instances of "hex a" and similar colors with "hex b." The last argument is a percentage which dictates how close a color must be to "hex a" in order to be replaced. |
| `uri "remove_colour" [hex code] [0-100]` | Functionally similar to the above command, however removes all instances of the specified hex. |
| `uri "remove_transparent" [mode] [0-100]` | Removes pixels in the image based on their alpha value. Mode dictates the conditions a pixel must meet in order to be removed ("over" / "under" / "equal_to"). The last argument is a percentage which specifies an alpha value for the previous argument. |
| `uri "add_hue" [hex code]` | Tints the image with the specified color. |
| `uri "upscale" [percent]` | Attempts to increase the quality of the image by a given percent. Useful for resized images. |
| `uri "blur" [pixels]` | Blurs the image by the specific amount of pixels. A lot faster than the variant in the `"effect"` command. |

### Image Effects

The `effect` command is a powerful tool for applying filters and effects to the image. The command takes 2 arguments; the first one specifies what effect to apply, while the second is a percentage of which to apply it.

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
