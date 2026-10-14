# layout

Use `layout` to build immediate-mode user interfaces on [raylib](raylib.md) and
[raygui](raygui.md) with rows and columns, flexbox-style sizing, and named styles. Containers take a
function that adds their children, and widgets return their values, so the whole UI is rebuilt every
frame from your own variables.

```osl
import "std:layout"
```

## Example

```osl
import "std:layout"

layout.style("card", {padding: 16, gap: 8, background: "#ffffff", radius: 8, width: "grow"})

boolean dark = false
number volume = 0.4
string name = "Ada"

layout.run({title: "Settings", width: 480, height: 320}, () -> (
  layout.column({padding: 20, gap: 12, width: "grow"}, () -> (
    layout.text("Settings", {size: 24, bold: true})
    layout.column({style: "card"}, () -> (
      dark = layout.checkbox("Dark mode", dark)
      volume = layout.slider(volume, 0, 1, {width: "grow"})
      name = layout.input(name, {width: "grow", maxLength: 40})
    ))
    layout.row({gap: 8, width: "grow"}, () -> (
      layout.spacer()
      if layout.button("Save", {id: "save"}) ( log "saved " ++ name )
    ))
  ))
))
```

`layout.run` opens the window and draws the body every frame until it is closed. To lay out inside
your own raylib loop, call `layout.frame(body)` inside `raylib.draw`.

## API reference

### Frames

| Function | Returns | Notes |
| --- | --- | --- |
| `layout.run(options?, body)` | `result<unit, error>` | Opens a window and draws `body` as a `layout.frame` every frame until the window is closed, then closes it. Uses a window that is already open. |
| `layout.frame(options?, body)` | `void` | Lays out and draws one frame. Positions are worked out after `body` returns and used when the next frame draws. Options are the root column's style keys. |
| `layout.rect(id: string)` | `{x, y, width, height}?` | The rectangle the widget with this `id` got in the last frame, or `null`. |
| `layout.style(name: string, style: object)` | `void` | Defines a named style. |

`layout.run` options: `title` (default `"OSL"`), `width` (800), `height` (600), `fps` (60),
`background` (default `"#f5f5f5"`), `resizable` (default `true`), `frames` (stop after this many;
0 runs until closed), and `style` (an object of style keys for the root column). It fails with `RuntimeError` when a
window can't be opened.

A frame laid out once without a window is enough for `layout.rect`, which makes layouts testable:

```osl
import "std:layout"

layout.frame({padding: 10}, () -> (
  layout.row({gap: 10, width: "grow", height: 50}, () -> (
    layout.area({id: "left", width: 100, height: "grow"})
    layout.spacer()
    layout.area({id: "right", width: "25%", height: "grow"})
  ))
))
log layout.rect("right") ?? {x: 0, y: 0, width: 0, height: 0}
```

### Containers and widgets

Every container and widget takes an optional options object of style keys. To apply a named style,
give its name in the `style` key: `layout.column({style: "card"}, body)`. Widgets must be called
inside `layout.frame` or `layout.run`.

| Function | Returns | Notes |
| --- | --- | --- |
| `layout.column(options?, body)` | `void` | Lays out what `body` adds top to bottom. |
| `layout.row(options?, body)` | `void` | Lays out what `body` adds left to right. |
| `layout.text(text: string, options?)` | `void` | A line of text. `size` defaults to 20, `color` to `"#222222"`. |
| `layout.button(text: string, options?)` | `boolean` | Clicked this frame. |
| `layout.checkbox(text: string, checked: boolean, options?)` | `boolean` | Whether it is checked after this frame's input. |
| `layout.toggle(text: string, active: boolean, options?)` | `boolean` | Whether it is on after this frame's input. |
| `layout.slider(value: number, min: number, max: number, options?)` | `number` | The value after this frame's input. |
| `layout.progress(value: number, options?)` | `void` | A progress bar filled to `value`, 0 to 1. |
| `layout.input(text: string, options?)` | `string` | A single-line text field. Clicking starts editing; Enter or clicking elsewhere stops. `maxLength` defaults to 256. |
| `layout.area(options?, draw?)` | `void` | Reserves space and calls `draw(rect)` with its rectangle, to draw custom content with raylib. |
| `layout.spacer(options?)` | `void` | Empty space that grows to fill its container unless a size is given. |

Pass each widget's result back in next frame (`dark = layout.checkbox("Dark", dark)`), and test
`layout.button`'s result to act on a click.

### Style keys

| Key | Values |
| --- | --- |
| `width`, `height` | A number of pixels, `"grow"` to share the leftover space, or a percentage such as `"50%"`. |
| `padding` | A number, or `{top, right, bottom, left, x, y}`. |
| `gap` | Space between children. |
| `justify` | Leftover space along the main axis: `"start"`, `"center"`, `"end"`, `"space-between"`, `"space-around"`, `"space-evenly"`. |
| `align` | Placement across the main axis: `"start"`, `"center"`, `"end"`. |
| `background`, `color` | Any CSS color that [`colors.parse`](colors.md) reads, or `{r, g, b, a}`. Names are CSS colors, so `"red"` is `#ff0000`, unlike raylib's palette. |
| `radius` | Rounded corners. |
| `size` | Font size. |
| `bold` | Bold text. |
| `id` | A name for `layout.rect`. |
| `maxLength` | For `input`. |
| `style` | Names of styles defined with `layout.style` to merge in, such as `"card wide"`. |

Several style names separated by spaces (`"card wide"`) merge left to right, later ones winning, and
the other keys of the options object are merged last.

## Errors

| Situation | Kind |
| --- | --- |
| An unknown style key, an undefined style name, or a bad value (`width: "wide"`, `justify: "middle"`, an invalid color), or `min` more than `max` in `slider` | `ValueError` (thrown) |
| A wrong kind of argument (`gap: "1"`, a string or number where options or a function belong, two functions) | `TypeError` (thrown) |
| A widget called outside `layout.frame`/`layout.run`, or `layout.frame` nested inside another | `StateError` (thrown) |
| `layout.run` can't open a window | `RuntimeError` (result) |

## Changes from earlier versions

Style names are no longer passed as bare strings: write `layout.column({style: "card"}, body)`
instead of `layout.column("card", body)`, and `layout.run({title: "Title"}, body)` instead of
`layout.run("Title", body)`. `layout.button` no longer takes a click callback; test its result.
