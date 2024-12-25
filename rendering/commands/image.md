# Image

## Image

The `image` command renders an image from a raw URL with optional width and height specifications.

### Load an image indirectly (more performant for bigger image urls or "data:" urls)

```javascript
image "load" "data" "name"
```

### Example:

```javascript
image "load" "data:url stuff goes here" "test_image"
// put before mainloop to ensure its only loaded once

mainloop:
image "test_image" 200
// render the loaded image at very low performance cost
```

### Syntax:

```javascript
image "url" width_in_pixels height_in_pixels
```

### Parameters:

* `"url"`: The raw URL of the image to be rendered.
* `width_in_pixels` (optional): The width of the rendered image in pixels. If null, the image will resize to fit its width correctly, and its height will adjust accordingly to maintain the original aspect ratio.
* `height_in_pixels` (optional): The height of the rendered image in pixels. If null, the image will stretch or shrink to match the specified width, preserving its aspect ratio.

### Example:

```javascript
image "https://example.com/image.jpg" 120 80
```

In this example, an image from the specified URL is rendered with a width of 120 pixels and a height of 80 pixels.

### Additional Notes:

* The image command supports raw image URLs and can render images from web sources.
* There is no maximum limit on the size of the image that can be rendered.
* If the image fails to load or if the URL is inaccessible, a "not loaded" placeholder image will be displayed.
* Images can be positioned on the screen using the draw cursor and rotated using direction commands.
* While data URLs can be used with the `image` command, it's not recommended due to potentially large file sizes.
* Images with alpha channels (transparency) are supported and rendered appropriately.
* Images can be dynamically changed during runtime, similar to other UI elements.
