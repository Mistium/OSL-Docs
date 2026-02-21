# Canvas
The OSL canvas commands are a set of commands that internally store images that can be easily written to and read from. The canvas element is primarily used in situations where the user will directly be interacting with an image, such as drawing programs or image editors.

A canvas can be initialized using one of two ways:

```js
// width - the width of the canvas, in pixels
// height - the height of the canvas, in pixels
// background - the background color of the canvas (ex. #fff)
canvas myCanvas @= canvas(width, height, background)

// url - a DataURI to load as the canvas content, stretched to fit
canvas myCanvas @= canvas.fromURL(url, width, height)
```

## Canvas Type

Canvases also have their own type, so using Typeof will give you "canvas"

```js
canvas myCanvas @= canvas(100, 100, "#fff")

// will log true
log typeof(myCanvas) == "canvas"
```

## Writing to the Canvas
OSL provides many methods for writing to the canvas. The most primitive of these write to a single pixel.

```js
// index starts at 1 in the top left, flowing left to right, top to bottom
myCanvas.setPixel(index, colour)

// (0, 0) is in the center of the canvas
myCanvas.setPixelAt(x, y, colour)
```

### Shapes
The canvas provides methods to draw lines, rectangles, and triangles. When drawing shapes, the cursor's color is used as the fill color (this can be set with the color/colour/c command). They use the same coordinate system as `setPixelAt`, where (0, 0) is in the center of the canvas. **It's worth noting that these methods are not pixel perfect; at smaller canvas sizes they may appear blurry.**

```js
// draws a dot at a position using the current draw cursor colour
myCanvas.dot(x, y, size)

// size - the stroke width of the line in pixels
// cap ("butt"/"round"/"square") - determines how the ends of the line are handled
myCanvas.line(x1, y1, x2, y2, {size: number, cap: "round" | "butt" | "square"})

// rounding - how smooth the corners appear, in pixels
// draws a filled rectangle
myCanvas.rect(x, y, width, height, rounding)

// draws an unfilled rectangle
myCanvas.square(x, y, width, height, rounding)

// each coordinate pair is one corner of the triangle
myCanvas.tri(x1, y1, x2, y2, x3, y3)
```

### Stamping

Canvases can also apply other images onto themselves using DataURIs. The image is stretched to fit the provided dimensions.

```js
myCanvas.image(dataURI, x, y, width, height)
```

## Reading the Canvas
OSL provides several methods for reading canvas data.

To get the entire canvas as a DataURI, use `toURL()`.

```js
myCanvas.toURL()

// returns the canvas as an array of integers
// equivalent to calling ctx.getImageData().data
myCanvas.toArray()
```

Methods can also be used to find the dimensions of the canvas.

```js
myCanvas.width()
myCanvas.height()

// total pixel count, i.e. width * height
myCanvas.pixels()
```

Finally, methods can be used to find the color of specific pixels. These serve as the inverses of `setPixel` and `setPixelAt`.

```js
myCanvas.getPixel(index)
myCanvas.getPixelAt(x, y)
```

## Managing Canvases

Most canvas management is handled internally; all stored canvases are deleted when the window is closed, and canvases are stored in such a way that prevents interference from other scripts. However, sometimes the need arises to handle these interactions manually. OSL exposes several commands for deleting and resizing canvases.

### Deleting/Clearing Canvases

The `delete` and `clear` methods function very similarly, with the key difference being that `delete` entirely removes the canvas from memory, while `clear` simply erases its content, while still allowing it to be written to.

The `fill` method allows you to clear a canvas with a specific colour

```js
// removes the canvas from memory, using the canvas variable after this may cause errors
myCanvas.delete()

// erases all content from the canvas
myCanvas.clear()

// erases all content and fills the canvas with a colour
myCanvas.fill(colour)
```

### Resizing Canvases

The stretch method will stretch the current content (hence the name) to fit the new canvas size specified in the stretch arguments.

```js
myCanvas.stretch(width, height)
```

## Example: Drawing a Checker Pattern
```js
canv @= Canvas(7, 7, #fff)

for i canv.pixels() (
	// check for every other pixel
    if i % 2 == 1 (
        canv.setPixel(i, #000)
    )
)

mainloop:
// canv.toURL() can be plugged directly into the image command
image canv.toURL() 256 256

import "win-buttons"
```
