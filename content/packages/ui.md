---
description: Build interfaces from tags written in OSL, with components, state, styles and themes, shown as live web pages or native windows.
package: ui
---

# ui

`std:ui` builds interfaces out of tags written straight into OSL: `<column>`, `<text>`, `<button>` and the rest. A component is a class that holds the state and a `view()` that returns the tags. There is no HTML, CSS or JavaScript to write. The same component can be a live web page with [serve](serve.md), a native desktop window with [window](window.md), or a plain string with `ui.html`.

You can't see a window in this page, but you can run everything else: call a component's methods, print its fields, and measure where its tags land with [layout](layout.md).

## Your first component

A class with a `view()` is a component. Its fields are its state, its methods are its actions:

```osl
import "std:ui"

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

Counter counter = Counter()
counter.add()
counter.add()
log counter.count
```

```output
2
```

`on:click=self.add` runs the method when the button is clicked, and the view draws again with the new state. Here there is no screen, so we call `add()` ourselves. Call it five times and run it again.

## Seeing it

`ui.html(component)` renders a component as a whole HTML page, with fresh state. It's a string, so print a check instead of the page:

```osl
import "std:ui"

class Hello (
  string name = "world"
  def view() ui.node -> <text>Hello, ${self.name}</text>
)

string page = ui.html(Hello(), {title: "Greeting"})
log page.contains("<title>Greeting</title>")
log page.contains("Hello, world")
```

```output
true
true
```

Use it for tests and static files. The page has no live script, so it doesn't update itself.

## Showing it in a window or on the web

On the web, `app.UI` serves a component at a path. In a window, `show` gives it to a window. They take the same thing. You will need a machine to run these on:

```osl norun
import "std:ui"
import "std:serve"

class Counter (
  int count = 0
  def add() ( self.count += 1 )
  def view() ui.node (
    return <column pad=24 gap=12>
      <text size=28>${self.count}</text>
      <button on:click=self.add>Add one</button>
    </column>
  )
)

*serve.Router app = serve.new()
app.UI("/", def() -> Counter(), {title: "Counter"})
app.run(":8080").unwrap()
```

Open it in two browser tabs. `def() -> Counter()` is a factory, so every visitor gets their own counter. Give `app.UI` the object itself (`Counter counter = Counter()`) and everyone shares one. A page updates live over a websocket, and still works with JavaScript off: it is a form that posts, and the server answers with a redirect. For a window, see [window](window.md).

:::quiz
`app.UI("/", def() -> Counter(), ...)` and two people open the page. Whose clicks does each see?

- [ ] Both see the clicks of both.
- [x] Each sees only their own, because the function makes a new `Counter` per visitor.
- [ ] Nobody sees any, because a function can't hold state.

A factory is called once per visitor. Pass an object to share it.
:::

## Tags

Lower-case tags are built in. `<column>` stacks, `<row>` lines up, `<text>` shows text, `<button>` runs an action. `${...}` puts a value in the text. A tag that starts with a capital letter calls a component:

```osl
import "std:ui"

def Badge(string label) ui.node (
  return <text size=13 pad.x=8 radius=999>${label}</text>
)

def Header() ui.node (
  return <row gap=8>
    <text size=20 weight=bold>Inbox</text>
    <Badge label="3 new"/>
  </row>
)

log ui.html(Header).contains("3 new")
```

```output
true
```

`Badge` is a function component: a `def` that returns tags. It has no state, and runs again on every update. `<Counter/>` with a class makes the instance once at that place and keeps it, so its state survives updates.

## Layout: hug, fill and fixed

Every size follows one of three rules. A tag **hugs** its content by default. `width=fill` takes the space left in its parent. A number is pixels. You can measure the result with [layout](layout.md):

```osl
import "std:ui"
import "std:layout"

def Bar() ui.node (
  return <row width=300 gap=10 pad=10>
    <box width=60 height=20/>
    <box width=fill height=20/>
    <box width=fill height=20/>
  </row>
)

for box in layout.boxes(Bar(), {width: 400, height: 100}) (
  log box.tag box.x box.width
)
```

```output
row 1 300
box 11 60
box 81 100
box 191 100
```

The fixed box takes 60. The two fill boxes share what's left of 300 after the padding and gaps. Change `gap=10` to `gap=0` and the fill boxes grow.

## Gap, pad and align

`gap` goes between children and `pad` inside the edge (`pad.x`, `pad.y`, `pad.top` and so on for one side). `align` places children in nine points (`top-left`, `center`, `bottom-right`...). A single word such as `top` or `left` sets that edge, and `center` centres both:

```osl
import "std:ui"
import "std:layout"

def Card() ui.node (
  return <column width=200 height=100 align=bottom-right>
    <box width=60 height=20/>
  </column>
)

log layout.boxes(Card())[2]
```

```output
{"height":20,"key":"","tag":"box","text":"","width":60,"x":141,"y":81}
```

Try `align=top-left`, then `center`. `distribute=between` spreads children along the container's own axis instead, and `<spacer/>` takes all the room between two siblings, which pushes one to the far end.

## Containers

`<column>`, `<row>`, `<box>` (a plain column that groups), `<scroll>` (a column that scrolls), `<stack>` (children on top of each other), `<grid columns=3>` (or `columns=auto minColumn=200`) and `<absolute>` (outside the flow, placed by its `pad` from the parent's edges). A row or column turns with `direction=`.

```osl
import "std:ui"
import "std:layout"

def Cells() ui.node (
  return <grid columns=3 gap=4>
    <box width=30 height=30/>
    <box width=30 height=30/>
    <box width=30 height=30/>
    <box width=30 height=30/>
  </grid>
)

for box in layout.boxes(Cells()) (
  log box.tag box.x box.y
)
```

```output
grid 1 1
box 1 1
box 269 1
box 537 1
box 1 35
```

The grid spreads three equal columns across the 800 pixel screen, so the fourth cell wraps to the next row.

:::exercise title="Two buttons side by side"
Make a `<row>` with `gap=10` holding two `<button>`s with the text `Yes` and `No`. Print the tag and x position of every box (the row comes first).

```osl
import "std:ui"
import "std:layout"

def Choice() ui.node (
  return <column>
    <button>Yes</button>
    <button>No</button>
  </column>
)

for box in layout.boxes(Choice()) (
  log box.tag box.x
)
```

```output
row 1
button 1
button 67.48
```

> [!hint]
> Change `<column>` to `<row gap=10>` in the view.

> [!hint]
> Positions count from 1, so the first button starts at x of 1.

```osl solution
import "std:ui"
import "std:layout"

def Choice() ui.node (
  return <row gap=10>
    <button>Yes</button>
    <button>No</button>
  </row>
)

for box in layout.boxes(Choice()) (
  log box.tag box.x
)
```
:::

## State, input and lists

`bind=self.draft` ties an input to a field: typing writes to it, and the field's value is what the input shows. An `if` and a `for` work inside tags. `key=` names a child so its state stays with the right item when a list changes, and `on:click=self.remove(i)` passes an argument:

```osl
import "std:ui"
import "std:layout"

class Todo (
  string draft = "write docs"
  string[] items = ["a", "b"]

  def add() (
    self.items.append(self.draft)
    self.draft = ""
  )

  def remove(int i) (
    self.items.delete(i)
  )

  def view() ui.node (
    return <column gap=8>
      <input bind=self.draft placeholder="New item"/>
      <button on:click=self.add>Add</button>
      if self.items.len == 0 (
        <text>Nothing yet</text>
      )
      for i, item in self.items (
        <row key=item gap=8>
          <text>${item}</text>
          <button on:click=self.remove(i)>x</button>
        </row>
      )
    </column>
  )
)

Todo todo = Todo()
log layout.findAll(todo.view(), n -> n.tag == "row").len
todo.add()
log todo.items
log layout.findAll(todo.view(), n -> n.tag == "row").len
todo.remove(1)
log todo.items
```

```output
2
["a","b","write docs"]
3
["b","write docs"]
```

A permission is a plain `if` around a button. The server only runs actions that it rendered for that viewer, so nobody can run one they weren't shown.

> [!note]
> A `<link>`, `<input>` or `<checkbox>` can't sit inside an element with a click handler, since a click on it would run that handler too. The compiler says so and asks you to move it beside.

## Styles

A **style** gathers props under a name. Spread it with `...name`. Props written on the tag win over the spread:

```osl
import "std:ui"

style card = (pad: 20, radius: 14, border: 1, borderColor: "#e3e6ea")

def Panel() ui.node (
  return <column ...card gap=12 pad=8>
    <text>hello</text>
  </column>
)

log ui.html(Panel).contains("hello")
```

```output
true
```

Every prop also takes a state prefix: `hover:bg="#f0f3f6"`, `focus:borderColor="#2f6feb"`, `pressed:opacity=0.8`, `disabled:opacity=0.5`, and `narrow:` for a page narrower than 600 pixels. `transition="smooth"` animates between states. Add `hover:bg="#eee"` to the `<column>` above and look at it in a browser.

## Themes

A theme names a colour or a radius once. `ui.newTheme` makes one. `theme.accent` reads a field wherever a prop takes a value. On the web the fields are CSS variables, so changing one updates every view that reads it without a redraw:

```osl
import "std:ui"

*ui.Theme theme = ui.newTheme({accent: "#7c3aed", radius: 8})
log theme.accent theme.radius

theme.accent = "#0969da"
log theme.accent
```

```output
#7c3aed 8
#0969da
```

In a tag, write `bg=theme.accent` and `radius=theme.radius`. A theme field can hold a font made with `ui.font("fonts/Inter.ttf")`.

:::quiz
A theme field changes while the program runs: `theme.accent = "#0969da"`. What has to happen for web pages that use it?

- [ ] You must call `ui.refresh()`.
- [x] Nothing. The field is a CSS variable, so every view updates.
- [ ] The page must be reloaded.

Setting a theme field updates every view that reads it.
:::

## Props at a glance

The props you reach for first: `width` and `height` (`fill`, `hug` or pixels), `minWidth` and `maxWidth`, `bg`, `color`, `opacity`, `radius`, `border`, `shadow`, `size`, `weight` (`normal`, `medium`, `semibold`, `bold`), `italic`, `underline`, `font`, `hidden`, `wrap`, `key` and `transition`. Other tags: `<input type="text">` (also `password`, `email`, `number`, `search`), `<checkbox checked=...>`, `<image src="...">` (a path, a URL, or a `*img.Image` from [img](img.md) or [qr](qr.md)) and `<link href="...">`.

## When the screen can't see a change

A screen draws again after a handler runs and after a function sets a global. A thread that fetches something shows it as soon as it assigns it. A change the compiler can't see, like an item pushed onto a list a global holds, needs `ui.refresh()`. Don't call it from inside a view, which would draw forever.

```osl norun
import "std:ui"
import "std:thread"

string[] messages = []

thread.new(def() (
  thread.sleep(1000)
  messages.append("hello")
  ui.refresh()
))
```

## Building nodes in code

When a tree comes from data, `ui.el(tag, props, content)` builds a node without a tag, and `node.with(props)` copies a node with props changed. Nodes never change after they're built:

```osl
import "std:ui"

auto label = ui.el("text", {size: 20}, "hi")
log label.tag label.props.size label.text

auto bigger = label.with({size: 30})
log bigger.props.size label.props.size
```

```output
text 20 hi
30 20
```

:::exercise title="A greeting component"
Give `Greeter` a method `rename(newName)` that sets its `name`, then call it with `"Ada"` and print `name`.

```osl
import "std:ui"

class Greeter (
  string name = "world"

  def view() ui.node -> <text>Hello, ${self.name}</text>
)

Greeter greeter = Greeter()
log greeter.name
```

```output
Ada
```

> [!hint]
> Add `def rename(string newName) ( self.name = newName )` inside the class.

```osl solution
import "std:ui"

class Greeter (
  string name = "world"

  def rename(string newName) (
    self.name = newName
  )

  def view() ui.node -> <text>Hello, ${self.name}</text>
)

Greeter greeter = Greeter()
greeter.rename("Ada")
log greeter.name
```
:::

## API reference

::api
