# layout

`layout` computes rectangles for user interfaces using flexbox-style rows and columns. It draws
nothing: pass the rectangles it returns to [`raylib`](raylib.md) drawing calls or
[`raygui`](raygui.md) controls. Recompute every frame from the window size so the layout follows
resizes.

```osl
import "std:raylib"
import "std:raygui"
import "std:layout"

raylib.setConfigFlags("resizable")
raylib.initWindow(640, 400, "Settings")
number volume = 0.4

while !raylib.windowShouldClose() (
  auto size = raylib.screenSize()
  auto screen = raylib.rect(0, 0, size.width, size.height)
  auto parts = layout.column(screen, [36, {grow: 1}, 24], {padding: 12, gap: 8})
  auto body = layout.row(parts[2], [{size: 180}, {grow: 1}], {gap: 12})
  auto controls = layout.column(body[2], [28, 28], {gap: 10, padding: 10})

  raylib.beginDrawing()
  raylib.clear("raywhite")
  raygui.label(parts[1], "Settings")
  raygui.panel(body[1], "Sections")
  volume = raygui.slider(controls[1], "Vol", "", volume, 0, 1)
  if raygui.button(controls[2], "Apply") ( log "applied" )
  raygui.statusBar(parts[3], "volume " ++ volume.toStr())
  raylib.endDrawing()
)
raylib.closeWindow()
```

Rectangles are `{x, y, width, height}` objects, the same shape as `raylib.rect(...)`. Results are
arrays in child order.

## API reference

| Method | Returns | Notes |
| --- | --- | --- |
| `layout.row(bounds, children, options?)` | `array` | Lays children out left to right. |
| `layout.column(bounds, children, options?)` | `array` | Lays children out top to bottom. |
| `layout.flex(bounds, children, options?)` | `array` | Like `row` or `column`, chosen by `options.direction`. |
| `layout.grid(bounds, options)` | `array` | Cells in row-major order. |
| `layout.inset(bounds, padding)` | `object` | Shrinks a rectangle by padding; negative padding grows it. |
| `layout.place(bounds, width, height, options?)` | `object` | A `width` by `height` rectangle aligned inside `bounds`, centred by default. |

## Children

`children` is an array of child specs or a count of equal children. `layout.row(bounds, 3)` gives
three equal columns.

- A number is a fixed size that neither grows nor shrinks.
- An object may set:
  - `size`: the starting size along the main axis. Defaults to 0.
  - `grow`: the share of leftover space. Defaults to 0.
  - `shrink`: the share of overflow, weighted by `size`. Defaults to 1.
  - `min` and `max`: limits on the final size.
  - `cross`: the size across the main axis. Defaults to filling it.
  - `alignSelf`: overrides the container's `align` for this child.

Sizing follows CSS flexbox. When a child hits `min` or `max`, its size is fixed there and the
remaining space is shared among the other children.

## Options

- `direction` is `"row"` (default) or `"column"`, and only applies to `flex`.
- `gap` is the space between children.
- `padding` is a number, or an object with `top`, `right`, `bottom`, `left`, `x` and `y`.
- `justify` places leftover main-axis space. It is `"start"` (default), `"center"`, `"end"`,
  `"space-between"`, `"space-around"` or `"space-evenly"`.
- `align` places children across the main axis. It is `"stretch"` (default), `"start"`,
  `"center"` or `"end"`.

`grid` takes `columns` and `rows` (each a count or an array of child specs), `gap`, `columnGap`,
`rowGap` and `padding`. `place` takes `x` and `y`, each `"start"`, `"center"` (default) or
`"end"`.

Unknown option values and bounds that are not rectangles raise a `TypeError`.
