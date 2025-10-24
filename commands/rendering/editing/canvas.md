
# Canvas
The OSL canvas commands are a set of commands that internally store images that can be easily written to and read from. The canvas element is primarily used in situations where the user will directly be interacting with an image, such as drawing programs or image editors.

A canvas can be initialized using one of two commands, with the latter setting the canvas's content to the image in a DataURI.

```js
// "id" - the key associated with this canvas
// x - the width of the canvas, in pixels
// y - the height of the canvas, in pixels
// fill - the background color of the canvas (ex. #fff)
canv "create" "id" x y fill

// dataURI - the content of this canvas
// will be stretched to fit the width and height
canv "load" "id" dataURI x y
```

Notice how both commands have an associated "id" argument. This is a string used as a key to access this canvas later through other commands. **All canvas methods and commands require a canvas ID.**

## Writing to the Canvas
OSL provides many commands for writing to the canvas. The most primitive of these commands write to a single pixel.

```js
// x and y are coordinates in pixels.
// (0, 0) of every canvas is in the center.
canv "set_pixel_xy" "id" x y color

// index writes to a pixel by the position it's stored internally.
// index flows from left to right, top to bottom.
canv "set_pixel" "id" index color
```

### Shapes
The canvas provides commands to draw lines, squares, and triangles. When drawing shapes, the cursor's color is used as the fill color (this can be set with the color/colour/c command). They use the same coordinate system as `"set_pixel_xy"`, where (0, 0) is in the center of the canvas. **It's worth noting that these commands are not pixel perfect, at smaller canvas sizes they may appear blurry.**

```js
// width - the stroke width of the line in pixels.
// cap ("butt"/"round"/"square") - determines how the end of the line is handled.
canv "line" "id" x1 y1 x2 y2 width cap

// rounding - how smooth the corners appear, in pixels.
canv "rect" "id" width height x y rounding

// each coordinate pair is one corner of the triangle
canv "tri" "id" x1 y1 x2 y2 x3 y3
```

### Stamping
Canvases can also apply other images onto themselves using DataURIs. The image is stretched to fit the provided dimensions.

```js
canv "image" "id" dataURI x y width height
```

## Reading the Canvas
Of course, a canvas is only useful if you can read the data you write to it. OSL provides several methods for reading canvas data. For each of these methods, they should be used on a string containing the canvas's specified ID.

To get the entire canvas's image as a DataURI, the `canvData()` method must be used.

```js
"id".canvData()
```

Methods can also be used to find the dimensions of the canvas.

```js
// width and height are both in pixels
"id".canvWidth()
"id".canvHeight()

// the total pixel count of the canvas, i.e. width x height
"id".canvPixels()
```

Finally, methods can be used to find the color of specific pixels in a canvas. These serve as the inverses of the `"set_pixel"` and `"set_pixel_xy"` commands, taking similar arguments but returning a value instead of setting one.

```js
"id".canvPixelXY(x, y)
"id".canvIndex(index)
```

## Managing Canvases
Most canvas management is handled internally; all stored canvases are deleted when the window is closed, and canvases are stored in such a way that prevents interference from other scripts. However, sometimes the need arises to handle these interactions manually. OSL exposes several commands for deleting and resizing canvases.

### Deleting/Clearing Canvases
The `"remove"` and `"clear"` commands function very similarly, with the key difference being that `"remove"` entirely removes the canvas from memory, while `"clear"` simply erases its content, while still allowing it to be written to.
```js
canv "remove" "id"
canv "clear" "id"
```

### Resizing Canvases
Despite their names, `"expand"` and `"stretch"` are used both to grow *and* shrink the canvas. However, the latter command will stretch the current content (hence the name) to fit the new canvas size, while the `"expand"` command will simply crop the image, or fill the image's new space with a specified color

```js
// will crop the content
// fill - the default pixel color for any new areas on the canvas
canv "expand" "id" width height fill

// will stretch the content to fit the new size
canv "stretch" "id" width height
```

## Example: Drawing a Checker Pattern
```js
id @= "my_canvas"

canv "create" id 7 7 #fff
for i 49 (
	// check for every other pixel
	if i % 2 == 1 (
	  canv "set_pixel" id i #000
	)
)

mainloop:

// "id".canvData can be plugged directly into the image command
image id.canvData() 256 256

import "win-buttons"
```
