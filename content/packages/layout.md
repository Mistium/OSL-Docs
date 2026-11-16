---
description: Work out where std:ui tags land on screen without opening a window, build nodes from code, and search and edit a node tree.
package: layout
---

# layout

`std:layout` is the layout engine behind [ui](ui.md) and [window](window.md), with no screen attached. Give it a tree of tags and a size, and it tells you the rectangle of every element. It follows the same rules as a web page: hug, fill and fixed sizes, `gap`, `pad` and nine-point `align`.

Use it to test that a view lays out the way you meant, to measure text before you draw it, to find what sits under a click, and to build or change trees in code. Text is measured with the UI's own built-in font, so every machine gets the same numbers.

## Laying out a tree

`layout.boxes(node, {width, height})` lays a tree out in a screen of that size (800 by 600 if you leave it out) and returns one record per element, parents before their children. Each has `tag`, `x`, `y`, `width`, `height`, `text` and `key`. Positions count from 1 at the top-left corner, like everything else in OSL.

```osl
import "std:ui"
import "std:layout"

def Panel() ui.node (
  return <column width=fill height=fill pad=20 gap=10>
    <row width=fill>
      <text>Title</text>
      <spacer/>
      <text>2 left</text>
    </row>
    <row gap=10 width=fill>
      <input width=fill placeholder="Name"/>
      <button>Add</button>
    </row>
  </column>
)

for box in layout.boxes(Panel(), {width: 400, height: 200}) (
  log box.tag box.x box.y box.width box.height
)
```

```output
column 1 1 400 200
row 21 21 360 23
text 21 21 31.45 23
spacer 52.45 21 293.02 23
text 345.47 21 35.53 23
row 21 54 360 41
input 21 54 290.88 41
button 321.88 54 59.13 39
```

The outer column fills the 400 by 200 screen. Inside its 20 pixel padding the rows are 360 wide. In the first row the spacer takes all the room the two texts leave. In the second, the input fills what the button leaves.

## Hug, fill and fixed

Every size on every axis follows one of three rules. A tag's size is **hug** unless you say otherwise: as big as its content. `width=fill` takes the space left in the parent. A number is pixels.

```osl
import "std:ui"
import "std:layout"

def Rows() ui.node (
  return <column width=300>
    <row width=fill height=20>
      <box width=50 height=20/>
      <box width=fill height=20/>
      <box width=fill height=20/>
    </row>
  </column>
)

for box in layout.boxes(Rows()) (
  log box.tag box.x box.width
)
```

```output
column 1 300
row 1 300
box 1 50
box 51 125
box 176 125
```

The fixed box takes 50, and the two fill boxes split the remaining 250. Add `maxWidth` or `minWidth` to limit a size, and a fill that hits its limit hands its leftover space to its siblings.

## Gap, pad and align

`gap` goes between children, `pad` goes inside the edge, and `align` places children inside a container that is larger than they are. It names one of nine points (`top-left`, `top-center`, `top-right`, `center-left`, `center`, `center-right`, `bottom-left`, `bottom-center`, `bottom-right`). A single word such as `top` or `left` sets that edge; `center` centres both ways.

```osl
import "std:ui"
import "std:layout"

def Card() ui.node (
  return <column width=200 height=100 pad=10 gap=4 align=bottom-right>
    <box width=60 height=20/>
    <box width=40 height=20/>
  </column>
)

for box in layout.boxes(Card()) (
  log box.tag box.x box.y box.width box.height
)
```

```output
column 1 1 200 100
box 131 47 60 20
box 151 71 40 20
```

The two boxes are stacked with a 4 pixel gap, and the stack sits in the bottom right corner, inside the padding.

## Measuring

`layout.measure(node)` is how big a node is when it hugs its content. Text wraps when you give it `maxWidth`:

```osl
import "std:ui"
import "std:layout"

ui.node note = <text>one two three four five six</text>

auto wide = layout.measure(note)
auto narrow = layout.measure(note, {maxWidth: 100})
log wide
log narrow
log narrow.height > wide.height
```

```output
{"height":23,"width":183.42}
{"height":46,"width":97.2}
true
```

## Finding what is at a point

`layout.at(node, x, y)` returns the innermost element under a point, in the same coordinates as `boxes`, or `null` when nothing is there. Give a `key` prop to the elements you want to recognise:

```osl
import "std:ui"
import "std:layout"

def Toolbar() ui.node (
  return <row gap=8 pad=8>
    <button key="save">Save</button>
    <button key="open">Open</button>
  </row>
)

auto size = {width: 300, height: 100}

auto save = layout.at(Toolbar(), 15, 15, size)
log save.tag save.key

auto open = layout.at(Toolbar(), 90, 15, size)
log open.tag open.key

auto gap = layout.at(Toolbar(), 250, 80, size)
log gap.tag

log layout.at(Toolbar(), 500, 500, size) == null
```

```output
button save
button open
row
true
```

The first two points land on the buttons. The third is empty space in the row, so you get the outermost element, which always fills the screen. A point outside the screen finds nothing, and you get `null`.

## Building nodes in code

Every tag has a function with the same name: `layout.column(props, children)`, `layout.row`, `layout.text(props, text)`, `layout.button`, `layout.input`, `layout.checkbox`, `layout.spacer`, `layout.stack`, `layout.grid`, `layout.scroll`, `layout.image`, `layout.link`, `layout.box` and `layout.absolute`. They build the same nodes, which is useful when a tree comes from data. Prop names are strings or plain keys, and `"fill"` is the text of `width=fill`:

```osl
import "std:ui"
import "std:layout"

string[] names = ["Ada", "Grace", "Edsger"]
ui.node[] rows = []
for name in names (
  rows.append(layout.text({}, name))
)

ui.node list = layout.column({gap: 6, pad: 10}, rows)
for box in layout.boxes(list) (
  log box.tag box.y box.text
)
```

```output
column 1 
text 11 Ada
text 40 Grace
text 69 Edsger
```

## Searching and editing a tree

A node never changes after it is built. Its `tag`, `props`, `children`, `key` and `text` can be read, and you make a changed copy with `node.with(props)`. `layout.find(node, test)` returns the first node (depth first) that the test accepts, `layout.findAll` returns all of them, and `layout.replace(root, old, replacement)` returns a copy of the tree with one node swapped:

```osl
import "std:ui"
import "std:layout"

def Panel() ui.node (
  return <column pad=20>
    <text>Title</text>
    <button>Add</button>
    <button>Remove</button>
  </column>
)

ui.node panel = Panel()
log panel.tag panel.props.pad panel.children.len

auto buttons = layout.findAll(panel, n -> n.tag == "button")
log buttons.len

ui.node? first = layout.find(panel, n -> n.tag == "button")
if first != null (
  ui.node original = first
  ui.node red = original.with({bg: "red"})
  log red.props.bg original.props.bg == null

  ui.node changed = layout.replace(panel, original, layout.button({}, "Clear"))
  log layout.findAll(changed, n -> n.text == "Clear").len
  log layout.findAll(panel, n -> n.text == "Clear").len
)
```

```output
column 20 3
2
red true
1
0
```

`layout.replace` finds the old node by identity, not by looking equal, and leaves the original tree alone. Setting a member on a node directly, as in `n.tag = "row"`, is a compile error that points you to `with`.

## Testing a layout

Because `boxes` needs no window, a layout can be checked in a test. Pick the elements by `key` and check their rectangles:

```osl
import "std:ui"
import "std:layout"

def Footer() ui.node (
  return <row width=fill pad=10>
    <text>v1.2</text>
    <spacer/>
    <button key="ok">OK</button>
  </row>
)

auto boxes = layout.boxes(Footer(), {width: 400, height: 100})
auto ok = boxes.find(b -> b.key == "ok")
log ok.x + ok.width
log ok.y
```

```output
391
11
```

The OK button ends at the row's padded right edge. Positions count from 1, so on a screen 400 wide with 10 pixels of padding, that edge is 391.

:::quiz
`layout.boxes` reports a text node at `x: 11`. Where is it on screen?

- [ ] 11 pixels from the left, counting from 0.
- [x] The 11th pixel from the left, counting from 1.
- [ ] In the 11th column of a grid.

Positions count from 1, so x of 1 is the screen's left edge.
:::

:::exercise title="Two even columns"
Lay out a 400 pixel wide `<row>` holding two `<box height=10 width=fill/>`. Print the width of each box.

```osl
import "std:ui"
import "std:layout"

def Halves() ui.node (
  return <row width=400>
    <box height=10/>
    <box height=10/>
  </row>
)

for box in layout.boxes(Halves(), {width: 400, height: 100}) (
  log box.tag box.width
)
```

```output
row 400
box 200
box 200
```

> [!hint]
> A box hugs its content by default. Give each `width=fill` so they share the row.

```osl solution
import "std:ui"
import "std:layout"

def Halves() ui.node (
  return <row width=400>
    <box width=fill height=10/>
    <box width=fill height=10/>
  </row>
)

for box in layout.boxes(Halves(), {width: 400, height: 100}) (
  log box.tag box.width
)
```

```output
row 400
box 200
box 200
```
:::

## API reference

::api
