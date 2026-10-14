# raygui

Use `raygui` to draw raylib's immediate-mode GUI controls inside a [raylib](raylib.md) window. Call
controls every frame inside `raylib.draw` (or the `raylib.runWindow` frame function). Each control
draws itself and returns its new value or state, which you keep in your own variables and pass back
in next frame.

```osl
import "std:raygui"
```

## Example

```osl
import "std:raylib"
import "std:raygui"

boolean enabled = true
number volume = 0.5
object name = {text: "Ada", editing: false}
object theme = {selected: 1, open: false}

raylib.runWindow(def(number ms) -> (
  if raygui.button({x: 20, y: 20, width: 120, height: 30}, "Save") ( log "saved " ++ name.text )
  enabled = raygui.checkBox({x: 20, y: 60, width: 20, height: 20}, "Enabled", enabled)
  volume = raygui.slider({x: 80, y: 90, width: 200, height: 20}, volume, {textLeft: "Volume"})
  name = raygui.textField({x: 20, y: 120, width: 200, height: 30}, name, {maxLength: 64})
  theme = raygui.dropdown({x: 260, y: 20, width: 140, height: 30}, ["Light", "Dark", "System"], theme)
), {width: 480, height: 240, title: "Settings", background: "raywhite"})
```

`bounds` is a rectangle `{x, y, width, height}`; use [layout](layout.md) to compute them from the
window size. `items` is an array of strings. Selections and other positions count from **1**.

## API reference

### Basic controls

| Function | Returns | Notes |
| --- | --- | --- |
| `raygui.label(bounds, text: string)` | `void` | |
| `raygui.button(bounds, text: string)` | `boolean` | Clicked this frame. |
| `raygui.labelButton(bounds, text: string)` | `boolean` | Text that acts as a button. |
| `raygui.toggle(bounds, text: string, active: boolean)` | `boolean` | Whether it is on after this frame's input. |
| `raygui.checkBox(bounds, text: string, checked: boolean)` | `boolean` | Whether it is checked after this frame's input. |
| `raygui.buttonGroup(bounds, items, selected: int)` | `int` | A row of toggle buttons. The selected item after this frame's input. |
| `raygui.toggleSwitch(bounds, items, selected: int)` | `int` | A sliding switch between items. |
| `raygui.cycleButton(bounds, items, selected: int)` | `int` | A button that steps through items when clicked. |
| `raygui.dropdown(bounds, items, state: object)` | `{selected, open}` | `state` is `{selected, open}` (defaults 1 and `false`). Draw open dropdowns last so their list covers other controls. |
| `raygui.list(bounds, items, state: object)` | `{selected, scroll}` | A scrollable list. `selected` is `int?` (`null` for none); `scroll` is the first visible item (default 1). |
| `raygui.tabs(bounds, items, selected: int)` | `{selected, closed}` | A tab bar. `closed` is the tab whose close button was clicked this frame, or `null`. |

### Values and text

| Function | Returns | Notes |
| --- | --- | --- |
| `raygui.textField(bounds, state: object, options?)` | `{text, editing}` | A single-line text field. Clicking starts editing; Enter or clicking elsewhere stops. Option: `maxLength` (default 256). |
| `raygui.spinBox(bounds, state: object, options?)` | `{value, editing}` | A whole-number field with - and + buttons. Options: `min` (0), `max` (100), `text` (a label beside it). |
| `raygui.valueField(bounds, state: object, options?)` | `{value, editing}` | A whole-number field to type into. Options as for `spinBox`. |
| `raygui.slider(bounds, value: number, options?)` | `number` | A slider with a handle. Options: `min` (0), `max` (1), `textLeft`, `textRight`. |
| `raygui.sliderBar(bounds, value: number, options?)` | `number` | A slider that fills up to its value. Options as for `slider`. |
| `raygui.progress(bounds, value: number, options?)` | `void` | A progress bar. Options as for `slider`. |
| `raygui.scrollBar(bounds, value: int, options?)` | `int` | A scroll bar. Options: `min` (0), `max` (100). |
| `raygui.colorPicker(bounds, text: string, color)` | `{r, g, b, a}` | |
| `raygui.colorPanel(bounds, text: string, color)` | `{r, g, b, a}` | A saturation/value square. |
| `raygui.colorBarAlpha(bounds, text: string, alpha: number)` | `number` | 0 to 1. |
| `raygui.colorBarHue(bounds, text: string, hue: number)` | `number` | 0 to 360. |

### Containers and dialogs

| Function | Returns | Notes |
| --- | --- | --- |
| `raygui.windowBox(bounds, title: string)` | `boolean` | A window panel. `true` when its close button was clicked. |
| `raygui.groupBox(bounds, text: string)` | `void` | A titled frame around a group of controls. |
| `raygui.line(bounds, text: string)` | `void` | A separator line with optional text. |
| `raygui.panel(bounds, text: string)` | `void` | A background panel with an optional title. |
| `raygui.statusBar(bounds, text: string)` | `void` | |
| `raygui.scrollView(bounds, content: object, options?)` | `{scroll, view}` | A scrollable panel over `content` `{x, y, width, height}`. Pass `scroll` back in next frame and draw the content shifted by it; `view` is the visible area. Options: `title`, `scroll` (default `{x: 0, y: 0}`). |
| `raygui.gridCell(bounds, spacing: number, options?)` | `{column, row}?` | Draws a grid and returns the cell under the mouse, or `null`. Options: `subdivisions` (default 2), `text`. |
| `raygui.messageDialog(bounds, message: string, options?)` | `int?` | The button clicked this frame, 0 for the close button, or `null`. Options: `title`, `buttons` (default `["OK"]`). |
| `raygui.inputDialog(bounds, state: object, options?)` | `{text, button}` | A dialog with a text field. `state` is `{text}` (the returned state works too). `button` is as for `messageDialog`. Options: `title`, `message`, `buttons`, `maxLength` (256), `secret` (hide the text). |

```osl
import "std:raylib"
import "std:raygui"

object answer = {text: ""}
boolean asking = true

raylib.runWindow(def(number ms) -> (
  if asking (
    answer = raygui.inputDialog({x: 90, y: 60, width: 300, height: 140}, answer, {title: "Name", message: "Who are you?", buttons: ["OK", "Cancel"]})
    if answer.button != null (
      asking = false
      if answer.button == 1 ( log "hello " ++ answer.text )
    )
  )
), {width: 480, height: 260, background: "raywhite"})
```

### State, styles, and icons

| Function | Returns | Notes |
| --- | --- | --- |
| `raygui.enable()` / `raygui.disable()` | `void` | `disable` greys out the controls drawn afterwards and makes them ignore input. |
| `raygui.lock()` / `raygui.unlock()` | `void` | `lock` makes controls ignore input but keeps their look. |
| `raygui.isLocked()` | `boolean` | |
| `raygui.setState(state: string)` / `raygui.state()` | `void` / `string` | `"normal"`, `"focused"`, `"pressed"`, or `"disabled"`, by name only. |
| `raygui.setAlpha(alpha: number)` | `void` | Opacity for following controls, 0 to 1. |
| `raygui.setStyle(control: string, property: string, value)` | `void` | A number, or a color for color properties. |
| `raygui.style(control: string, property: string)` | `int` | |
| `raygui.styleColor(control: string, property: string)` | `{r, g, b, a}` | |
| `raygui.loadStyle(path: string)` | `result<unit, error>` | Loads a `.rgs` style file. |
| `raygui.loadStyleDefault()` | `void` | Restores the default style. |
| `raygui.setTooltip(text: string)`, `enableTooltip()`, `disableTooltip()` | `void` | A tooltip for the controls drawn afterwards. |
| `raygui.iconText(icon: int, text: string)` | `string` | Prefixes a label with a raygui icon, such as `raygui.iconText(1, "Open")`. |
| `raygui.icon(id: int, position, options?)` | `void` | Draws an icon at `{x, y}`. Options: `scale` (default 1), `color` (default black). |
| `raygui.setIconScale(scale: int)` | `void` | Pixels per icon pixel in controls. |
| `raygui.textWidth(text: string)` | `int` | Width in the current style. |

Controls for styles are `"default"` (all controls), `"label"`, `"button"`, `"toggle"`, `"slider"`,
`"progressbar"`, `"checkbox"`, `"combobox"`, `"dropdownbox"`, `"textbox"`, `"valuebox"`,
`"listview"`, `"colorpicker"`, `"scrollbar"`, and `"statusbar"`. Properties are raygui's names in
lower case, such as `"base_color_normal"`, `"text_color_focused"`, `"border_width"`,
`"text_padding"`, `"text_alignment"`, `"text_size"`, `"text_spacing"`, `"background_color"`, and
`"slider_width"`. Colors take the same forms as [raylib](raylib.md).

## Errors

A `selected` or `scroll` outside the items, an unknown state, style control or property, or an
`alpha` outside 0-1 throws `ValueError`. `items` that isn't an array, or an item that isn't a string
or number, throws `TypeError`. Style
functions throw `StateError` when no window is open; `loadStyle` fails with `NotFoundError` or
`IOError` when the file can't be read.

## Changes from earlier versions

The raygui-style functions that counted from 0 (`tabBar`, `comboBox`, `dropdownBox`, `listView`,
`textBox`, `messageBox`, and the rest) have been removed in favour of the controls above. The value
controls now have their natural names: `valueSlider` is `raygui.slider`, `valueBar` is
`raygui.sliderBar`, and `scrollSlider` is `raygui.scrollBar`; the old `slider`, `sliderBar`, and
`scrollBar` signatures with positional `min` and `max` are gone. `items` must be an array, and
`setState` takes only a state name.
