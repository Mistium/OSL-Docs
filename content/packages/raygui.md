---
description: Add buttons, sliders, text fields, lists and dialogs to a raylib window with immediate-mode controls.
package: raygui
---

# raygui

`std:raygui` draws controls inside a [raylib](raylib.md) window: buttons, checkboxes, sliders, text fields, lists, dropdowns, dialogs and more. It is immediate mode. There are no widget objects. Every frame you call `raygui.button(bounds, "Click")`, which draws the button and tells you whether it was clicked right now.

Reach for it for tools, editors and debug panels in a game or visualisation. For a full application interface, use [ui](ui.md) with [window](window.md).

Controls need an open raylib window, so these examples compile but don't run here, except for the small ones near the end.

## A button

A control takes its bounds, a rectangle `{x, y, width, height}`, and returns its answer. A button returns `true` on the frame it is clicked:

```osl norun
import "std:raylib"
import "std:raygui"

int clicks = 0

raylib.runWindow(def(ms) (
  if raygui.button({x: 20, y: 20, width: 140, height: 36}, "Click me") (
    clicks += 1
  )
  raygui.label({x: 20, y: 70, width: 200, height: 24}, "clicks: " ++ clicks)
), {width: 320, height: 160, title: "Button", background: "#f5f5f5"})
```

Move the button, change its label, and click it ten times.

## You keep the state

The control doesn't remember anything. A checkbox gets its current value and returns the new one after this frame's input, and you store it:

```osl norun
import "std:raylib"
import "std:raygui"

boolean sound = true
number volume = 0.5

raylib.runWindow(def(ms) (
  sound = raygui.checkBox({x: 20, y: 20, width: 24, height: 24}, "Sound", sound)
  volume = raygui.valueSlider({x: 20, y: 60, width: 200, height: 24}, volume, {min: 0, max: 1, textLeft: "Vol"})
  raygui.progress({x: 20, y: 100, width: 200, height: 16}, volume)
), {width: 300, height: 160, title: "State", background: "#f5f5f5"})
```

The pattern is always `value = control(bounds, ..., value)`. Forget the assignment and the control snaps back every frame.

:::quiz
`raygui.checkBox(bounds, "Sound", sound)` is called without storing the result. What happens when you click it?

- [ ] It toggles and stays toggled.
- [x] It draws the new state for a moment and then snaps back, because `sound` never changed.
- [ ] The program stops with an error.

The control only returns the new value. Keeping it is your job.
:::

## Text and numbers

`textField` takes and returns `{text, editing}`. Clicking it starts editing, and Enter or clicking elsewhere stops. `spinBox` and `valueField` do the same for whole numbers:

```osl norun
import "std:raylib"
import "std:raygui"

auto name = {text: "Ada", editing: false}
auto age = {value: 36, editing: false}

raylib.runWindow(def(ms) (
  name = raygui.textField({x: 20, y: 20, width: 200, height: 28}, name)
  age = raygui.spinBox({x: 20, y: 60, width: 200, height: 28}, age, {min: 0, max: 120})
  raygui.label({x: 20, y: 100, width: 300, height: 24}, name.text ++ " is " ++ age.value)
), {width: 300, height: 160, title: "Fields", background: "#f5f5f5"})
```

## Lists and choices

`list` takes `{selected, scroll}`, and `dropdown` takes `{selected, open}`. `buttonGroup`, `cycleButton`, `toggleSwitch` and `tabs` take and return a 1-based selected item. A dropdown covers what is below it, so draw it last:

```osl norun
import "std:raylib"
import "std:raygui"

string[] fruit = ["Apple", "Banana", "Cherry", "Date"]
auto chosen = {selected: 1, scroll: 1}
auto menu = {selected: 1, open: false}

raylib.runWindow(def(ms) (
  chosen = raygui.list({x: 20, y: 20, width: 140, height: 100}, fruit, chosen)
  raygui.label({x: 180, y: 20, width: 140, height: 24}, "list: " ++ fruit[chosen.selected])
  menu = raygui.dropdown({x: 180, y: 60, width: 140, height: 28}, fruit, menu)
), {width: 340, height: 180, title: "Choices", background: "#f5f5f5"})
```

## Dialogs

`messageDialog` returns the 1-based button clicked this frame (0 for its close button, `null` for nothing yet). `inputDialog` returns `{text, button}` and wants its own state passed back:

```osl norun
import "std:raylib"
import "std:raygui"

boolean asking = true
string answer = ""

raylib.runWindow(def(ms) (
  raygui.label({x: 20, y: 20, width: 300, height: 24}, "answer: " ++ answer)
  if asking (
    auto reply = raygui.messageDialog({x: 40, y: 50, width: 240, height: 100}, "Delete everything?", {title: "Careful", buttons: ["Yes", "No"]})
    if reply != null (
      answer = if reply == 1 then "yes" else "no"
      asking = false
    )
  )
), {width: 320, height: 200, title: "Dialog", background: "#f5f5f5"})
```

## Laying controls out

Controls are positioned by hand, so put the sums in a helper. A function that returns the next row keeps a form tidy:

```osl norun
import "std:raylib"
import "std:raygui"

def row(int n) object -> {x: 20, y: 20 + (n * 40), width: 200, height: 30}

raylib.runWindow(def(ms) (
  raygui.button(row(0), "One")
  raygui.button(row(1), "Two")
  raygui.button(row(2), "Three")
), {width: 260, height: 160, title: "Rows", background: "#f5f5f5"})
```

## Styles, locking and icons

`raygui.setStyle("default", "text_size", 20)` changes a property of every control, and `"button"` or `"textbox"` of only that kind. Colours take any colour value (`raygui.setStyle("button", "base_color_normal", "#89b4fa")`). `loadStyle(path)` loads a `.rgs` style file. `lock()` and `disable()` make the controls drawn after them ignore input, until `unlock()` and `enable()`.

A few helpers don't need a window, so you can try them here. `raygui.iconText(icon, text)` puts one of raygui's numbered icons in front of a label:

```osl
import "std:raygui"

log raygui.iconText(1, "Open")
log raygui.state()

raygui.lock()
log raygui.isLocked()
raygui.unlock()
log raygui.isLocked()
```

```output
#001#Open
normal
true
false
```

Try other icon numbers. The text it returns is what you pass as a control's label.

:::exercise title="An icon label"
Build the label for a save button. Icon 2 followed by the text `Save`, using `iconText`, and print it.

```osl
import "std:raygui"

string label = "Save"
log label
```

```output
#002#Save
```

> [!hint]
> `raygui.iconText(2, "Save")` returns the string.

```osl solution
import "std:raygui"

string label = raygui.iconText(2, "Save")
log label
```
:::

## API reference

::api
