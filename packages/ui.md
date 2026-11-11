# ui

`ui` builds an interface out of tags written straight into OSL: components, state, clicks and
bindings, with no HTML or JavaScript to write. A UI is shown by whichever module owns the screen.
[`serve`](serve.md)'s `app.UI` draws it as a web page that updates live and still works with
JavaScript turned off, and `std:window`'s `win.show` draws the same component in a native window.

```osl
// counter.osl: run it, then open http://localhost:8080
import "std:ui"
import "std:serve"

class Counter (
  int count = 0

  def add() (
    self.count += 1
  )

  def view() ui.node (
    return <column pad=24 gap=12 align=center>
      <text size=28 weight=bold>${self.count}</text>
      <button on:click=self.add>Add one</button>
    </column>
  )
)

*serve.Router app = serve.new()
app.UI("/", def() -> Counter(), {title: "Counter"})
app.run(":8080")
```

## Components

A component is anything that makes a `ui.node`. There are two kinds.

A **class component** is a class with `def view() ui.node`. Its fields are its state, its methods are
its actions, and `self` is the instance. After an action runs, every screen showing that component
draws its view again with the new state.

A **function component** is a `def` returning `ui.node`. It has no state of its own: it takes plain
inputs and runs again on every update.

```osl
def Badge(string label) ui.node (
  return <text size=13 color="white" bg=theme.accent pad.x=8 pad.y=2 radius=999>${label}</text>
)
```

Lower case tags are the built-in ones, listed below. A tag that starts with a capital letter mounts a
component: `<Badge label="new"/>` calls the function above, and `<Counter/>` makes the class the first
time it appears in that place and keeps that instance, so its state survives every update.

## State, actions and bindings

- `on:click=self.add` runs a method when the element is clicked. An element that runs an action is
  rendered as a button a click can reach, keyboard included.
- `bind=self.draft` ties an input to a field of a class component. Typing writes to the field; the
  field's value is what the input shows.
- `checked=todo.done` shows a checkbox from a field, and `bind=` makes it a checkbox a click toggles.

Because the action runs on the server, a permission is a plain `if` around the element:

```osl
if self.isOwner (
  <button on:click=self.remove>Delete</button>
)
```

Nobody can run an action they weren't shown: the server only runs a handler from the render that
viewer got. A `<link>`, `<input>` or `<checkbox>` can't sit inside an element that runs a handler,
since a click on it would run that handler too; the compiler says so and asks you to move it beside.

## Layout

Every axis of every element follows three rules: **hug** (the default, as big as its content),
**fill** (the space left in the parent) and a **fixed** number of pixels. `width=fill` and
`height=hug` are written as props, and a number is pixels.

A container places its children with:

- `gap` between children, `pad` inside its own edge, and `pad.x`, `pad.y` or `pad.top` / `right` /
  `bottom` / `left` for one side.
- `align`, one of nine points: `top-left` … `bottom-right`, plus `center`. A single edge word sets that
  edge and leaves the other axis at its start; `center` centres both. `distribute=between`, `around`
  or `evenly` spreads them along the container's own axis instead.
- `place` on a child overrides the container's align for that one child.
- `minWidth`, `maxWidth`, `minHeight` and `maxHeight` limit a size.

Containers are `<column>`, `<row>`, `<scroll>` (a column that scrolls), `<box>`, `<stack>` (children
on top of each other) and `<grid>` with `columns=3` or `columns=auto` and `minColumn=200`. `<spacer/>`
takes up the space left between siblings, which is how you push something to one end. A row or column
turns with `direction=column` / `direction=row`.

## Styles

Props can be gathered into a named style and spread with `..name`, which keeps a view readable:

```osl
style card = (pad: 20, radius: 14, bg: theme.card, border: 1, borderColor: theme.line)

return <column ..card gap=12> <text>hello</text> </column>
```

A style spans as many lines as you like, and one written inside a `view()` works too, so it can sit
next to the tag it belongs to. Props on the tag itself win over the spread, and a spread has to be a
style's name: `..(pad: 12)` is a syntax error.

Every prop also takes a state prefix, for how the element looks under that state: `hover:bg="#f0f3f6"`,
`focus:borderColor=theme.accent`, `pressed:opacity=0.8`, `disabled:opacity=0.5`, and `narrow:` for a
page narrower than 600 pixels. States combine, and the more specific one wins: `narrow:hover:bg` beats
`hover:bg`. `transition="fast"`, `"smooth"` or `"spring"` animates the whole element between
states.

## Themes

A theme is an object read with ordinary paths, so a colour or a radius is named once:

```osl
*ui.Theme theme = ui.newTheme({accent: "#2f6feb", surface: "#f6f8fa", card: "white", line: "#e3e6ea", muted: "#6a737d", radius: 14})
```

`theme.accent` reads a field wherever a prop takes a value. On the web a theme's fields become CSS
variables, so setting one, as in `theme.accent = "#0969da"`, updates every view that reads it without
a redraw. A field holding a `ui.font("Inter.ttf")` value becomes that font: on a page the file is served and
`font=theme.yourField` uses it, in a window it is drawn with.

## Reference

Tags:

| Tag | Notes |
| --- | --- |
| `<column>`, `<row>`, `<box>` | Lay children out; the direction names the axis. |
| `<scroll>` | A column that scrolls its content. |
| `<stack>` | Children drawn on top of each other. |
| `<grid columns=3 minColumn=200>` | Cells in rows; `columns=auto` fits as many as the minimum allows. |
| `<spacer/>` | Takes the space left over between siblings. |
| `<text>` | Text; `${value}` inside interpolates. |
| `<button>` | Runs its `on:click` handler. |
| `<link href="...">` | A link, or an action when it has a handler. |
| `<input type="text" placeholder="..."/>` | A text field; `bind=` or `value=`. `type` may be `text`, `password`, `email`, `number` or `search`. |
| `<checkbox checked=.../>` | A checkbox; with `bind=` it toggles a field. |
| `<image src="..." alt="..."/>` | An image. |
| `<Component .../>` | Mounts a component, passing each prop as an input of that name. |

Props:

| Prop | Notes |
| --- | --- |
| `width`, `height` | `fill`, `hug`, or a number of pixels. |
| `minWidth`, `maxWidth`, `minHeight`, `maxHeight` | Limits on the size. |
| `gap` | Space between children, in pixels. |
| `pad`, `pad.x`, `pad.y`, `pad.top`, `pad.right`, `pad.bottom`, `pad.left` | Space inside the edge. |
| `align`, `place`, `distribute` | Where children sit, with a container's nine points. |
| `direction`, `wrap` | Which way a row or column runs, and whether it wraps. |
| `columns`, `minColumn` | A grid's column count, or its minimum cell width for `auto`. |
| `bg`, `color`, `opacity` | Background, text colour, and how solid the element is. |
| `radius`, `border`, `borderColor`, `shadow` | Corners, outline, and shadow. |
| `size`, `weight`, `italic`, `underline`, `strike`, `textAlign`, `font` | Type: pixels, `normal` / `medium` / `semibold` / `bold`, and a font: `mono`, `sans`, `serif`, a CSS family, or `ui.font(path)`. |
| `hidden` | Hides the element; the space it took goes with it. |
| `transition` | `fast`, `smooth` or `spring`. |
| `key` | Names a child so a list keeps its state on the right item when it changes. |
| `hover:`, `focus:`, `pressed:`, `disabled:`, `narrow:` | Prefixes for the state a prop applies in. |

Functions:

| Function | Returns | Notes |
| --- | --- | --- |
| `ui.newTheme(values)` | `*ui.Theme` | A named set of values for props to read. |
| `ui.font(path)` | `ui.Font` | The font in a TrueType or OpenType file, for a `font=` prop or a theme field. A page serves the file; a window draws with it. |
| `ui.html(target, {title})` | `string` | The target as one whole HTML page, with fresh state, for a test or a static file. It carries no live script, so a page made this way doesn't update itself. |
| `ui.el(tag, props, ...content)` | `ui.node` | Builds a node in code instead of a tag: `ui.el("text", {size: 20}, "hi")`. |
| `ui.part(name, factory, props)` | `ui.node` | Mounts a component where a container's child comes from code. |
| `ui.handler(fn, ...args)` | `ui.handler` | An action with its arguments fixed now, for a handler that needs one. |
| `ui.bind(target, field)` | `ui.binding` | The binding an input takes, outside a tag. |

## Showing a UI

`app.UI("/", target, {title: "…"})` serves `target` at a path. A new visitor to a factory gets their
own instance, so a name in a field stays theirs:

```osl
app.UI("/", def() -> TodoList(), {title: "Todo"})
app.UI("/about", def() ui.node ( return <text>hello</text> ))
```

The options are `title`, `maxConnections` (1000), `maxConnectionsPerAddress` (100) and
`messagesPerSecond` (20). Past a limit, a page still works by posting its form rather than over a
socket.

A page that works by posting does one action per render: the form carries the render it was made
from, and the server answers with a redirect that draws a new one. Two tabs on the same path share
that render, so the older tab's button does nothing until it is reloaded. Turning JavaScript on, the
socket keeps each tab's own render and this doesn't come up.

`app.UI` accepts GET, HEAD and POST at its path; the rest of the routing, middleware and static files
are [`serve`](serve.md)'s.
