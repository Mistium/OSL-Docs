# Canvas
Canvas commands store an image in memory and let a script read or change it. They suit drawing programs and image editors where users interact with the image directly.

Create a blank canvas or load one from a data URI:

```js
// width - the width of the canvas, in pixels
// height - the height of the canvas, in pixels
// background - the background color of the canvas (ex. #fff)
canvas myCanvas @= canvas(width, height, background)

// url - a DataURI to load as the canvas content, stretched to fit
canvas myCanvas @= canvas.fromURL(url, width, height)
```

## Canvas type

`typeof` returns `"canvas"` for a canvas value.

```js
canvas myCanvas @= canvas(100, 100, "#fff")

// will log true
log typeof(myCanvas) == "canvas"
```

## Writing to the canvas

These methods write a single pixel:

```js
// index starts at 1 in the top left, flowing left to right, top to bottom
myCanvas.setPixel(index, colour)

// (0, 0) is in the center of the canvas
myCanvas.setPixelAt(x, y, colour)
```

### Shapes
The canvas can draw lines, rectangles, and triangles. Shapes use the cursor color as their fill color; set it with `color`, `colour`, or `c`. Coordinates match `setPixelAt`, with `(0, 0)` at the canvas center. Shapes may look blurry on small canvases because these methods are not pixel-perfect.

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

## Reading the canvas

To get the entire canvas as a DataURI, use `toURL()`.

```js
myCanvas.toURL()

// returns the canvas as an array of integers
// equivalent to calling ctx.getImageData().data
myCanvas.toArr()
```

Methods can also be used to find the dimensions of the canvas.

```js
myCanvas.width()
myCanvas.height()

// total pixel count, i.e. width * height
myCanvas.pixels()
```

Use these methods to read the color of a pixel:

```js
myCanvas.getPixel(index)
myCanvas.getPixelAt(x, y)
```

## Managing canvases

OSL keeps each script's canvases separate and deletes them when the window closes. A script can also delete, clear, fill, or resize a canvas itself.

### Deleting and clearing canvases

`delete` removes the canvas from memory. `clear` erases its contents but keeps the canvas available. `fill` clears it with a chosen color.

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
