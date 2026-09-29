# raygui

`raygui` draws raylib's immediate-mode GUI controls inside a [`raylib`](raylib.md) window. Call
controls every frame between `beginDrawing` and `endDrawing` (or inside the `run` draw callback).
Each control draws itself and returns its new value, so you keep the state in your own variables.

```osl
import "std:raylib"
import "std:raygui"

boolean enabled = true
number volume = 0.5
auto name = {text: "Ada", edit: false}

raylib.initWindow(480, 240, "Settings")
raylib.setTargetFPS(60)
while !raylib.windowShouldClose() (
  raylib.beginDrawing()
  raylib.clear("raywhite")
  if raygui.button(raylib.rect(20, 20, 120, 30), "Save") ( log "saved " ++ name.text )
  enabled = raygui.checkBox(raylib.rect(20, 60, 20, 20), "Enabled", enabled)
  volume = raygui.slider(raylib.rect(80, 90, 200, 20), "Volume", "", volume, 0, 1)
  name = raygui.textBox(raylib.rect(20, 120, 200, 30), name.text, 64, name.edit)
  raylib.endDrawing()
)
raylib.closeWindow()
```

`bounds` is a rectangle from `raylib.rect(x, y, width, height)` or any `{x, y, width, height}`
object. Lists of items are an array of strings or one string separated by `;`. Styles, text
measurement and every control need an open window; calling them earlier raises
`raygui needs an open window; call raylib.initWindow first`.

## Controls

| Method | Returns | Notes |
| --- | --- | --- |
| `button(bounds, text)` | `boolean` | `true` on the frame the button is clicked. |
| `labelButton(bounds, text)` | `boolean` | A button drawn as a label. |
| `label(bounds, text)` | `void` | |
| `checkBox(bounds, text, checked)` | `boolean` | The new checked state. |
| `toggle(bounds, text, active)` | `boolean` | The new toggle state. |
| `toggleGroup(bounds, items, active)` | `int` | Index of the active toggle. |
| `toggleSlider(bounds, items, active)` | `int` | Index of the active option. |
| `comboBox(bounds, items, active)` | `int` | Index of the selected item. |
| `dropdownBox(bounds, items, active, edit)` | `object` | `{active, edit}`. Pass `edit` back each frame; it flips when the box opens or closes. |
| `textBox(bounds, text, maxLength, edit)` | `object` | `{text, edit}`. Click to start editing, Enter or click outside to stop. |
| `spinner(bounds, text, value, min, max, edit)` | `object` | `{value, edit}` with an integer value. |
| `valueBox(bounds, text, value, min, max, edit)` | `object` | `{value, edit}` with an integer value. |
| `slider(bounds, textLeft, textRight, value, min, max)` | `number` | The new value. |
| `sliderBar(bounds, textLeft, textRight, value, min, max)` | `number` | The new value. |
| `progressBar(bounds, textLeft, textRight, value, min, max)` | `void` | |
| `listView(bounds, items, scroll, active)` | `object` | `{scroll, active}`; `active` is `-1` when nothing is selected. |
| `scrollBar(bounds, value, min, max)` | `int` | The new position. |
| `colorPicker(bounds, text, color)` | `object` | The new colour as `{r, g, b, a}`. |
| `colorPanel(bounds, text, color)` | `object` | The new colour as `{r, g, b, a}`. |
| `colorBarAlpha(bounds, text, alpha)` | `number` | Alpha from 0 to 1. |
| `colorBarHue(bounds, text, hue)` | `number` | Hue in degrees, 0 to 359. |
| `grid(bounds, text, spacing, subdivisions)` | `object` | The hovered cell as `{x, y}`, or `{x: -1, y: -1}`. |

## Containers and dialogs

| Method | Returns | Notes |
| --- | --- | --- |
| `windowBox(bounds, title)` | `boolean` | `true` when the close button is clicked. |
| `groupBox(bounds, text)`, `line(bounds, text)`, `panel(bounds, text)`, `statusBar(bounds, text)` | `void` | |
| `tabBar(bounds, tabs, active)` | `object` | `{active, closed}`; `closed` is the index of a tab whose close button was clicked, or `-1`. |
| `scrollPanel(bounds, text, content, scroll)` | `object` | `{scroll, view}`; draw the content inside `view` offset by `scroll`. |
| `messageBox(bounds, title, message, buttons)` | `int` | The clicked button (1-based), `0` for the close button, `-1` while open. |
| `textInputBox(bounds, title, message, buttons, text, maxLength)` | `object` | `{result, text}` where `result` follows `messageBox`. |

## State, styles and icons

| Method | Returns | Notes |
| --- | --- | --- |
| `enable()`, `disable()` | `void` | Disable draws every following control greyed out and ignores input. |
| `lock()`, `unlock()`, `locked()` | `void`, `boolean` | Lock ignores input but keeps the normal look. |
| `setState(state)`, `state()` | `void`, `string` | `"normal"`, `"focused"`, `"pressed"` or `"disabled"`. |
| `setAlpha(alpha)` | `void` | Transparency for following controls, 0 to 1. |
| `setStyle(control, property, value)` | `void` | A colour value (name, hex, array or object) sets a colour property; a number sets a size. |
| `getStyle(control, property)` | `int` | |
| `styleColor(control, property)` | `object` | A colour property as `{r, g, b, a}`. |
| `loadStyle(path)`, `loadStyleDefault()` | `void` | Load a `.rgs` style file or restore the default. |
| `setTooltip(text)`, `enableTooltip()`, `disableTooltip()` | `void` | Tooltip for the following controls. |
| `iconText(icon, text)` | `string` | Prefixes text with a raygui icon, for example `raygui.iconText(1, "Open")`. |
| `drawIcon(icon, x, y, scale, color)`, `setIconScale(scale)` | `void` | |
| `textWidth(text)` | `int` | Width of text in the current GUI font. |

Controls are `"default"`, `"label"`, `"button"`, `"toggle"`, `"slider"`, `"progressbar"`,
`"checkbox"`, `"combobox"`, `"dropdownbox"`, `"textbox"`, `"valuebox"`, `"listview"`,
`"colorpicker"`, `"scrollbar"` and `"statusbar"`. Properties are the raygui names in lowercase,
for example `"base_color_normal"`, `"text_color_focused"`, `"border_width"`, `"text_padding"`,
`"text_alignment"`, `"text_size"`, `"text_spacing"`, `"background_color"` and `"slider_width"`.
Setting a `"default"` property applies it to every control.
