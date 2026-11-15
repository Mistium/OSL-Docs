---
layout: project
description: Build a pomodoro timer with `std:ui` and `std:window`: a class with state and actions, a view in tags, styles and a theme, then show it on the web and in a window.
uses: ui, window, serve
time: 25 minutes
---

# Build a desktop app

You'll build a pomodoro timer: 25 minutes of focus, a 5 minute break, a count of sessions. It's one class that holds the state and the actions, and a `view` that draws it. The same class ends up in a native window and on a web page.

A window can't open on this page, so every step tests the class by calling its methods and printing, or by rendering it with `ui.html`, which gives the page's HTML without opening anything.

## Count down

A timer is a class with a field and two methods. `tick()` takes a second off and `label()` shows `mm:ss`. The try-it tab ticks it 90 times: 25:00 becomes 23:30. Nothing here is about drawing yet, so it's an ordinary program.

```osl
class Timer (
  int remaining = 1500

  def tick() (
    if self.remaining > 0 (
      self.remaining -= 1
    )
  )

  def label() string (
    int minutes = floor(self.remaining / 60).as<int>
    int seconds = self.remaining % 60
    string mm = if minutes < 10 then "0" ++ minutes else "" ++ minutes
    string ss = if seconds < 10 then "0" ++ seconds else "" ++ seconds
    return mm ++ ":" ++ ss
  )
)

// try it
Timer timer = Timer()
log timer.label()
for _ in 1 to 90 (
  timer.tick()
)
log timer.label()
```

```output
25:00
23:30
```

**Try changing** the number of ticks in the try-it tab.

:::exercise title="Format seconds"
Make `clock` return `25:00`, `1:05` and `0:05`.

```osl
def clock(int seconds) string (
  return seconds ++ ":" ++ seconds
)

log clock(1500)
log clock(65)
log clock(5)
```

```output
25:00
1:05
0:05
```

> [!hint]
> Minutes are `floor(seconds / 60).as<int>` and the rest is `seconds % 60`. Pad the seconds to two digits.

```osl solution
def clock(int seconds) string (
  int minutes = floor(seconds / 60).as<int>
  int rest = seconds % 60
  string ss = if rest < 10 then "0" ++ rest else "" ++ rest
  return minutes ++ ":" ++ ss
)

log clock(1500)
log clock(65)
log clock(5)
```
:::


## Start and pause

State is just fields. `running` decides whether `tick` does anything, and `toggle()` flips it. The try-it tab shows five ticks doing nothing, five that count, and a pause.

```osl
class Timer (
  int remaining = 1500
  bool running = false

  def tick() (
    if !self.running return
    if self.remaining > 0 (
      self.remaining -= 1
    )
  )

  def toggle() (
    self.running = !self.running
  )

  def label() string (
    int minutes = floor(self.remaining / 60).as<int>
    int seconds = self.remaining % 60
    string mm = if minutes < 10 then "0" ++ minutes else "" ++ minutes
    string ss = if seconds < 10 then "0" ++ seconds else "" ++ seconds
    return mm ++ ":" ++ ss
  )
)

// try it
Timer timer = Timer()
for _ in 1 to 5 (
  timer.tick()
)
log "idle:" timer.label()
timer.toggle()
for _ in 1 to 5 (
  timer.tick()
)
log "running:" timer.label()
timer.toggle()
log "paused:" timer.label() timer.running
```

```output
idle: 25:00
running: 24:55
paused: 24:55 false
```

:::exercise title="Reset"
Add a `reset()` method that puts the time back to 1500 and stops the timer.

```osl
class Timer (
  int remaining = 1500
  bool running = false

  def reset() (
    // put the time back and stop
    self.running = self.running
  )

  def toggle() (
    self.running = !self.running
  )
)

Timer timer = Timer()
timer.remaining = 10
timer.toggle()
timer.reset()
log timer.remaining timer.running
```

```output
1500 false
```

> [!hint]
> It sets two fields.

```osl solution
class Timer (
  int remaining = 1500
  bool running = false

  def reset() (
    self.remaining = 1500
    self.running = false
  )

  def toggle() (
    self.running = !self.running
  )
)

Timer timer = Timer()
timer.remaining = 10
timer.toggle()
timer.reset()
log timer.remaining timer.running
```
:::


## Draw it

A component is a class with a `view()` method that returns tags. `<column>` stacks, `<text>` shows text and `${...}` inserts a value. `<button on:click=self.toggle>` calls the method when clicked, and the view runs again afterwards, so it always matches the state. `ui.html(timer)` renders the page for a test.

```osl
import "std:ui"

class Timer (
  int remaining = 1500
  bool running = false

  def tick() (
    if !self.running return
    if self.remaining > 0 (
      self.remaining -= 1
    )
  )

  def toggle() (
    self.running = !self.running
  )

  def label() string (
    int minutes = floor(self.remaining / 60).as<int>
    int seconds = self.remaining % 60
    string mm = if minutes < 10 then "0" ++ minutes else "" ++ minutes
    string ss = if seconds < 10 then "0" ++ seconds else "" ++ seconds
    return mm ++ ":" ++ ss
  )

  def view() ui.node (
    return <column gap=12 pad=24 align=center>
      <text size=48 weight=bold>${self.label()}</text>
      <button on:click=self.toggle>${if self.running then "Pause" else "Start"}</button>
    </column>
  )
)

// try it
Timer timer = Timer()
string page = ui.html(timer)
log page.contains("25:00")
log page.contains("Start")

timer.toggle()
for _ in 1 to 3 (
  timer.tick()
)
page = ui.html(timer)
log page.contains("24:57")
log page.contains("Pause")
```

```output
true
true
true
true
```

:::quiz
What happens after the button calls `toggle`?

- [ ] Nothing until you redraw by hand.
- [x] The view runs again, so the page matches the new state.
- [ ] The class is copied.

After any action every screen showing the component updates. Never keep state in the view: put it in fields.
:::

:::exercise title="Show the state"
Make the view say `Paused` when `running` is false and `Running` when it's true.

```osl
import "std:ui"

class Badge (
  bool running = false

  def view() ui.node (
    return <text>Running</text>
  )
)

Badge badge = Badge()
log ui.html(badge).contains("Paused")
```

```output
true
```

> [!hint]
> Put an `if ... then ... else` inside `${{}}`.

```osl solution
import "std:ui"

class Badge (
  bool running = false

  def view() ui.node (
    return <text>${if self.running then "Running" else "Paused"}</text>
  )
)

Badge badge = Badge()
log ui.html(badge).contains("Paused")
```
:::


## Style and theme

Layout uses three sizing rules: elements hug their content by default, `width=fill` takes the space left, and a number is pixels. `gap`, `pad` and `align` place children. A `style` is a named set of attributes, spread into a tag with `...card`. A theme holds shared values: on the web they become CSS variables, so changing `theme.accent` recolours every view.

```osl
import "std:ui"

*ui.Theme theme = ui.newTheme({accent: "#d9480f", surface: "#fff4e6", muted: "#868e96"})

style card = (pad: 32, gap: 16, radius: 16, bg: white)

class Timer (
  int remaining = 1500
  bool running = false

  def tick() (
    if !self.running return
    if self.remaining > 0 (
      self.remaining -= 1
    )
  )

  def toggle() (
    self.running = !self.running
  )

  def label() string (
    int minutes = floor(self.remaining / 60).as<int>
    int seconds = self.remaining % 60
    string mm = if minutes < 10 then "0" ++ minutes else "" ++ minutes
    string ss = if seconds < 10 then "0" ++ seconds else "" ++ seconds
    return mm ++ ":" ++ ss
  )

  def view() ui.node (
    return <column width=fill height=fill align=center bg=theme.surface>
      <column ...card align=center>
        <text size=64 weight=bold color=theme.accent>${self.label()}</text>
        <row gap=8>
          <button on:click=self.toggle bg=theme.accent>${if self.running then "Pause" else "Start"}</button>
        </row>
      </column>
    </column>
  )
)

// try it
Timer timer = Timer()
string before = ui.html(timer)
log before.contains("#d9480f")
log before.contains("#fff4e6")
theme.accent = "#1c7ed6"
string after = ui.html(timer)
log after.contains("#1c7ed6")
```

```output
true
true
true
```

**Try changing** the accent colour in `newTheme`.

## Focus and break

When the time hits zero, `next()` flips between focus and break, resets the time, and counts a session when focus ends. The view shows which mode it's in. In the try-it tab, three ticks run a 3 second focus to the end and start a 5 minute break.

```osl
import "std:ui"

*ui.Theme theme = ui.newTheme({accent: "#d9480f", surface: "#fff4e6", muted: "#868e96"})

style card = (pad: 32, gap: 16, radius: 16, bg: white)

class Timer (
  int remaining = 1500
  bool running = false
  bool onBreak = false
  int sessions = 0

  def tick() (
    if !self.running return
    if self.remaining > 0 (
      self.remaining -= 1
    )
    if self.remaining == 0 (
      self.next()
    )
  )

  def next() (
    if !self.onBreak (
      self.sessions += 1
    )
    self.onBreak = !self.onBreak
    self.remaining = if self.onBreak then 300 else 1500
  )

  def toggle() (
    self.running = !self.running
  )

  def label() string (
    int minutes = floor(self.remaining / 60).as<int>
    int seconds = self.remaining % 60
    string mm = if minutes < 10 then "0" ++ minutes else "" ++ minutes
    string ss = if seconds < 10 then "0" ++ seconds else "" ++ seconds
    return mm ++ ":" ++ ss
  )

  def view() ui.node (
    return <column width=fill height=fill align=center bg=theme.surface>
      <column ...card align=center>
        <text color=theme.muted>${if self.onBreak then "Break" else "Focus"}</text>
        <text size=64 weight=bold color=theme.accent>${self.label()}</text>
        <button on:click=self.toggle bg=theme.accent>${if self.running then "Pause" else "Start"}</button>
        <text color=theme.muted>${self.sessions} sessions done</text>
      </column>
    </column>
  )
)

// try it
Timer timer = Timer()
timer.remaining = 3
timer.toggle()
for _ in 1 to 3 (
  timer.tick()
)
log timer.onBreak timer.label() timer.sessions
timer.remaining = 1
timer.tick()
log timer.onBreak timer.label() timer.sessions
log ui.html(timer).contains("1 sessions done")
```

```output
true 05:00 1
false 25:00 1
true
```

:::exercise title="Longer breaks"
Every 4th break should be 15 minutes. Write the rule: `lengthOf(mode, sessions)` returns 25 for focus, 15 for a break after a multiple of 4 sessions, else 5.

```osl
def lengthOf(string mode, int sessions) int (
  return 25
)

log lengthOf("focus", 1)
log lengthOf("break", 1)
log lengthOf("break", 4)
```

```output
25
5
15
```

> [!hint]
> `sessions % 4 == 0`.

```osl solution
def lengthOf(string mode, int sessions) int (
  if mode == "focus" return 25
  if sessions % 4 == 0 return 15
  return 5
)

log lengthOf("focus", 1)
log lengthOf("break", 1)
log lengthOf("break", 4)
```
:::


## Put it on the web

`std:serve` can show the same class. `app.UI(path, target, options)` makes a page that updates live over a WebSocket, and still works as a plain form without JavaScript. An object target, like `timer`, is one state shared by every visitor. A function that returns a new `Timer()` gives each visitor their own. The try-it tab fetches the page.

```osl
import "std:ui"
import "std:serve"
import "std:requests"

*ui.Theme theme = ui.newTheme({accent: "#d9480f", surface: "#fff4e6", muted: "#868e96"})

style card = (pad: 32, gap: 16, radius: 16, bg: white)

class Timer (
  int remaining = 1500
  bool running = false
  bool onBreak = false
  int sessions = 0

  def tick() (
    if !self.running return
    if self.remaining > 0 (
      self.remaining -= 1
    )
    if self.remaining == 0 (
      self.next()
    )
  )

  def next() (
    if !self.onBreak (
      self.sessions += 1
    )
    self.onBreak = !self.onBreak
    self.remaining = if self.onBreak then 300 else 1500
  )

  def toggle() (
    self.running = !self.running
  )

  def label() string (
    int minutes = floor(self.remaining / 60).as<int>
    int seconds = self.remaining % 60
    string mm = if minutes < 10 then "0" ++ minutes else "" ++ minutes
    string ss = if seconds < 10 then "0" ++ seconds else "" ++ seconds
    return mm ++ ":" ++ ss
  )

  def view() ui.node (
    return <column width=fill height=fill align=center bg=theme.surface>
      <column ...card align=center>
        <text color=theme.muted>${if self.onBreak then "Break" else "Focus"}</text>
        <text size=64 weight=bold color=theme.accent>${self.label()}</text>
        <button on:click=self.toggle bg=theme.accent>${if self.running then "Pause" else "Start"}</button>
        <text color=theme.muted>${self.sessions} sessions done</text>
      </column>
    </column>
  )
)

Timer timer = Timer()

*serve.Router app = serve.new()
app.UI("/", timer, {title: "Pomodoro"})

// try it
app.start("127.0.0.1:8755").unwrap()
auto r = requests.get("http://127.0.0.1:8755/").unwrap()
string body = r.body
log r.status
log body.contains("<title>Pomodoro</title>")
log body.contains("25:00")
app.stop().unwrap()
```

```output
200
true
true
```

:::quiz
You pass `def() -> Timer()` to `app.UI` instead of `timer`. What changes?

- [ ] Nothing.
- [x] Each visitor gets their own timer.
- [ ] The page stops updating.

An object is shared by everyone it's given to. A factory is called once per visitor or window.
:::

## Open a window

`window.create` opens a window and `main.show(timer)` puts the component in it. The window and the web page share the one `timer`. Something has to tick it: an async function loops, sleeps a second, ticks and calls `ui.refresh()` to redraw the screens. Windows use SDL2, which needs its development files to build. Save it as `pomodoro.osl` and run it. Next: [ui](../packages/ui.md), [window](../packages/window.md), or a [game](game.md).

```osl norun
import "std:ui"
import "std:serve"
import "std:window"
import "std:thread"

*ui.Theme theme = ui.newTheme({accent: "#d9480f", surface: "#fff4e6", muted: "#868e96"})

style card = (pad: 32, gap: 16, radius: 16, bg: white)

class Timer (
  int remaining = 1500
  bool running = false
  bool onBreak = false
  int sessions = 0

  def tick() (
    if !self.running return
    if self.remaining > 0 (
      self.remaining -= 1
    )
    if self.remaining == 0 (
      self.next()
    )
  )

  def next() (
    if !self.onBreak (
      self.sessions += 1
    )
    self.onBreak = !self.onBreak
    self.remaining = if self.onBreak then 300 else 1500
  )

  def toggle() (
    self.running = !self.running
  )

  def label() string (
    int minutes = floor(self.remaining / 60).as<int>
    int seconds = self.remaining % 60
    string mm = if minutes < 10 then "0" ++ minutes else "" ++ minutes
    string ss = if seconds < 10 then "0" ++ seconds else "" ++ seconds
    return mm ++ ":" ++ ss
  )

  def view() ui.node (
    return <column width=fill height=fill align=center bg=theme.surface>
      <column ...card align=center>
        <text color=theme.muted>${if self.onBreak then "Break" else "Focus"}</text>
        <text size=64 weight=bold color=theme.accent>${self.label()}</text>
        <button on:click=self.toggle bg=theme.accent>${if self.running then "Pause" else "Start"}</button>
        <text color=theme.muted>${self.sessions} sessions done</text>
      </column>
    </column>
  )
)

Timer timer = Timer()

async clock(Timer t) (
  while true (
    thread.sleep(1000)
    t.tick()
    ui.refresh()
  )
)
clock(timer)

*serve.Router app = serve.new()
app.UI("/", timer, {title: "Pomodoro"})
app.start(":8095").unwrap()

*window.Window main = window.create({title: "Pomodoro", width: 360, height: 360}).unwrap()
main.show(timer)
window.run()
```

