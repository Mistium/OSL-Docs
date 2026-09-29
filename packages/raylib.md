# raylib

`osl/raylib` wraps raylib-go with OSL values and a compact frame-loop API. It is for native desktop
builds. Use `osl compile` or `osl run`.

```osl
import "std:raylib"

player = {x: 20}
raylib.run({width: 800, height: 450, title: "OSL raylib", fps: 60}, def(dt) -> (
  if raylib.keyDown("right") player.x += 200 * dt
), def() -> (
  raylib.clear("#181825")
  raylib.drawRectangle(player.x, 200, 40, 40, "#89b4fa")
  raylib.drawText("Move with the arrow keys", 20, 20, 24, "white")
))
```

## Values and window lifecycle

- `raylib.color(value)` accepts named colours, `#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`, arrays, `{r, g, b, a}` objects,
  or an `int` packed as `0xRRGGBBAA`. Packed integers avoid parsing on every draw call.
- `raylib.vec(x, y)`, `raylib.vec3(x, y, z)`, and `raylib.rect(x, y, width, height)` create geometry objects.
- `initWindow(width, height, title)`, `closeWindow()`, `windowReady()`, and `windowShouldClose()` expose manual lifecycle control.
- `run(options, update, draw)` manages the window and frame loop.
- `setTargetFPS(fps)`, `fps()`, `frameTime()`, `time()`, `screenSize()`, `setWindowTitle(title)`, and `setWindowSize(width, height)` manage timing and the window.
- `onResize(fn)` calls `fn` while the window edge is being dragged. macOS pauses your loop until the drag ends, so redraw there (fit the content, then draw a frame) to keep resizing live.
- `disableCursor()`, `enableCursor()`, and `cursorHidden()` manage captured mouse input.
- `setConfigFlags(flags)` configures window initialization flags before `initWindow` (e.g. `"highdpi"`, `"resizable"`, `"undecorated"`, `"vsync"`, `"transparent"`, `"msaa"`).
- `setGPUPreference(pref)` sets GPU power mode (`"integrated"` or `"discrete"`). Defaults to `"integrated"`.
  On macOS the integrated preference requests an OpenGL pixel format that allows offline renderers
  and automatic graphics switching, so opening a window does not power up the discrete GPU.
- `initWindow` and `run` keep the process working directory unchanged, so relative asset paths keep
  working after the window opens.
- `gpuPreference()` returns the current GPU preference.

## Drawing

Use `clear`, `drawPixel`, `drawLine`, `drawRectangle`, `drawRectangleLines`, `drawCircle`,
`drawCircleLines`, `drawTriangle`, `drawText`, and `measureText`. For manual loops,
`beginDrawing()`, `endDrawing()`, and `draw(fn)` are available.

## Smooth lines and blending

`beginSmoothLines()` starts a batch of antialiased, round-capped lines; `drawSmoothLine(x1, y1, x2, y2,
thickness, color)` adds one (a zero-length line is a round dot) and `endSmoothLines()` finishes the batch.
Lines in one batch share a single draw call and are written with premultiplied alpha.

`beginBlend(mode)` / `endBlend()` switch the blend mode: `"alpha"`, `"additive"`, `"multiply"`,
`"premultiplied"`, or `"layer"`, which alpha-blends into a transparent render texture while keeping it
premultiplied so it can later be composited with `"premultiplied"`.

`fillTriangle(x1, y1, x2, y2, x3, y3, color)` fills a triangle given in either winding order.

`setLogLevel(level)` chooses which of raylib's own messages print: `"all"`, `"trace"`, `"debug"`, `"info"` (the default), `"warning"`, `"error"`, `"fatal"` or `"none"`.

`useFont(path, baseSize)` makes `drawText` and `measureText` use a TTF or OTF font, rendered at `baseSize` pixels and smoothly scaled. Their sizes are then em sizes, as in CSS. Call it after `initWindow`. `textHeight(size)` gives the line height `drawText` uses for a size (ascent plus descent), for centring text vertically.

`setSVGFont(family, path)` registers the font used for SVG `<text>` in that font family (the family `"sans-serif"` is the fallback). Without one, SVG text is not drawn.

`dpiScale()` returns the window's pixel density (2 on a retina display with the `"highdpi"` flag).

## 2D camera

`beginMode2D(offsetX, offsetY, targetX, targetY, rotation, zoom)` transforms subsequent 2D drawing so
the world point `(targetX, targetY)` appears at screen point `(offsetX, offsetY)`, rotated in degrees
and scaled by `zoom`. `endMode2D()` restores screen coordinates.

`takeScreenshot(path)` saves the current frame, including draw calls not yet flushed, as an image.
Call it before `endDrawing()`.

## 3D cameras and drawing

Create a perspective camera with `raylib.camera(options)`. Options may include `position`, `target`,
`up`, `fovy`, and `projection`. The returned camera provides `update(mode)`, `position()`,
`target()`, `setPosition(value)`, and `setTarget(value)`. Camera modes are `custom`, `free`,
`orbital`, `first_person`, and `third_person`.

Use `begin3D(camera)` and `end3D()` around 3D drawing, or call `draw3D(camera, frame)`. The 3D
drawing helpers are `drawCube(center, size, color)`, `drawCubeWires(center, size, color)`,
`drawSphere(center, radius, color)`, `drawSphereWires(center, radius, rings, slices, color)`,
`drawCylinder(position, radiusTop, radiusBottom, height, slices, color)`,
`drawPlane(center, size, color)`, `drawLine3D(start, end, color)`,
`drawBillboard(camera, texture, position, size, tint)`, and `drawGrid(slices, spacing)`.

## Rays and box picking

- `raylib.ray(origin, direction)` creates a ray from two 3D vectors.
- `raylib.screenRay(point, camera)` creates a world ray through a screen position.
- `raylib.centerRay(camera)` creates a ray through the center of the window.
- `ray.box(center, size)` tests an axis-aligned box and returns `{hit, distance, point, normal}`.

## Input and collision

- Keyboard: `keyPressed`, `keyDown`, and `keyReleased`
- `pressedKey()` returns the next key pressed this frame as a lowercase name (`"a"`, `"space"`, `"left"`), or `""` when the queue is empty.
- `pressedChar()` returns the next typed character this frame, or `""`.
- Mouse: `mousePosition`, `mouseDelta()`, `setMousePosition(x, y)`, `mousePressed`, `mouseDown`, `mouseReleased`, and `mouseWheel`
- Collision: `rectanglesCollide`, `circlesCollide`, and `pointInRectangle`

Key names include letters, arrows, space, escape, enter, modifiers, and F1 through F12.

## Audio

raylib has no audio API of its own. Import [`std:sound`](sound.md) alongside it to play sounds in a
raylib window.

## Images

- `raylib.loadImage(path)` loads a PNG, JPEG, BMP, or other raylib-supported file into CPU memory.
- `raylib.loadSVG(path, scale)` rasterizes an SVG at `scale` times its viewBox size.
- `raylib.svgSize(path, scale)` returns `[width, height]` of that raster without drawing it.
- Image values provide `valid()`, `width()`, `height()`, `pixels()`, `texture()`, and `unload()`.
  `pixels()` returns row-major `int[]` values packed as `0xRRGGBBAA`, suitable for collision tests.
  `texture()` uploads the image to the GPU and requires an open window.

## Textures and Render Textures

- `raylib.loadTexture(path)` returns a texture with `valid()`, `width()`, `height()`,
  `draw(x, y, rotation, scale, tint)`, `drawPro(sx, sy, sw, sh, dx, dy, dw, dh, ox, oy, rotation, tint)`,
  `setFilter(mode)`, `setWrap(mode)`, and `unload()` methods.
- `drawPro` draws the source rectangle into the destination rectangle, rotating in degrees around
  the origin `(ox, oy)` measured in destination units. A negative source width or height mirrors the image.
- `setFilter` accepts `"point"`, `"bilinear"`, or `"trilinear"`.
- `setWrap` accepts `"repeat"` (the default), `"clamp"`, or `"mirror"`: how sampling past the edges behaves.
- `raylib.renderTexture(width, height)` returns an offscreen frame buffer with `valid()`, `begin()`, `end()`,
  `width()`, `height()`, `texture()`, `draw(x, y, rotation, scale, tint)`, and `unload()` methods.
- `raylib.drawToTexture(target, drawFunc)` executes a drawing callback into the render target.

## Shaders

- `raylib.loadShader(vs, fs)` and `raylib.loadFragmentShader(fs)` load GLSL or OSL-style shaders from code strings or file paths.
- `raylib.shader(code)` is a shorthand for loading a fragment shader.
- `raylib.beginShader(s)` and `raylib.endShader()` toggle active shader mode.
- `raylib.drawShader(s, x, y, width, height)` draws a rectangle using the active shader.

### Returned Shader object methods

- `valid()` returns boolean indicating if the shader compiled and loaded.
- `begin()` and `end()` activate and deactivate the shader.
- `setValue(name, value)` sets float, vector (`[x, y]`, `[x, y, z]`, `[x, y, z, w]`), or texture uniform values.
- `setUniform(name, value)` is an alias for `setValue`.
- `draw(x, y, width, height)` draws a rectangle filled by the shader.
- `drawFullscreen()` draws a fullscreen quad using the shader.
- `unload()` frees the shader from GPU memory.

## Dense pen drawing

Use `beginSmoothLines()`, `drawSmoothLine(x1, y1, x2, y2, thickness, color)` and
`endSmoothLines()` for dense pen drawing. Each line submits its quad through one
native call, with unchanged round caps, per-line colour and premultiplied alpha.
Raylib may flush a full vertex buffer within a batch; drawing order and colours
remain intact across those flushes. A zero-length line draws a round dot.

For repeated pen calls, `beginSmoothBatch()` starts a buffered version of
`beginSmoothLines()`. Submit lines with `drawSmoothLine()` and finish with
`endSmoothLines()`. Up to 1,024 lines share one native call, using a fixed 52 KiB
queue. Geometry, colours and submission order match the unbuffered API.
Call `endSmoothLines()` before clearing, drawing anything else, changing the
render target, reading pixels or closing the window. It submits any remaining
lines before ending the shader and blend modes. Use `beginSmoothLines()` when
other drawing operations must be interleaved within the batch.
