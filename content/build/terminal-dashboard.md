---
layout: project
description: Build a live terminal dashboard with `std:tui`: progress bars, tables, boxes and charts as text, a model you can test, and a redraw loop that reads keys.
uses: tui, thread
time: 20 minutes
---

# Build a terminal dashboard

You'll build a dashboard that shows how a few services are doing, lets you pick one with the arrow keys and refreshes itself. Most of `std:tui` is functions that return strings, so they print the same text every time and run on this page. Only the live loop needs a real terminal. Colours are ANSI codes in a terminal; this page strips them.

## Draw a bar

`tui.progress(current, total, width)` returns a bar. It clamps to the total, so a value over 100 stays full.

```osl
import "std:tui"

log "api   " ++ tui.progress(42, 100, 20)
log "db    " ++ tui.progress(87, 100, 20)
log "cache " ++ tui.progress(8, 100, 20)
```

```output
api   [████████░░░░░░░░░░░░] 42%
db    [█████████████████░░░] 87%
cache [█░░░░░░░░░░░░░░░░░░░] 8%
```

**Try changing** the numbers, or the width.

:::exercise title="Label the load"
Make `level` return `HIGH` from 90, `busy` from 50, else `ok`.

```osl
def level(int cpu) string (
  return "ok"
)

log level(10) level(60) level(95)
```

```output
ok busy HIGH
```

> [!hint]
> Early `return`s from the highest limit down.

```osl solution
def level(int cpu) string (
  if cpu >= 90 return "HIGH"
  if cpu >= 50 return "busy"
  return "ok"
)

log level(10) level(60) level(95)
```
:::


## Show a table

A service is a struct. `tui.table(headers, rows)` takes an array of rows, each an array of text, and sizes the columns for you. `cellColor` is called for every body cell and returns a colour name, so a down service shows red.

```osl
import "std:tui"

struct Service (
  string name
  int cpu
  int memory
  bool up
)

Service[] services = [
  Service("api", 42, 61, true),
  Service("db", 87, 74, true),
  Service("cache", 8, 30, false),
]

string[][] rows = []
for s in services (
  string status = if s.up then "up" else "DOWN"
  rows.append([s.name, s.cpu ++ "%", s.memory ++ "%", status])
)

log tui.table(["service", "cpu", "mem", "status"], rows, {
  cellColor: def(any cell) string -> if cell == "DOWN" then "red" else "white"
})
```

```output
+---------+-----+-----+--------+
| service | cpu | mem | status |
+---------+-----+-----+--------+
| api     | 42% | 61% | up     |
| db      | 87% | 74% | up     |
| cache   | 8%  | 30% | DOWN   |
+---------+-----+-----+--------+
```

## Add a box and a chart

`tui.box(title, text)` draws a frame around any text, even several lines. `tui.barChart(data, width, colored)` takes `[label, value]` pairs: a scale line, then a bar per item scaled to the largest. Strings join with `++`, so a table, a box and a chart stack into one screen.

```osl
import "std:tui"

struct Service (
  string name
  int cpu
  int memory
  bool up
)

Service[] services = [
  Service("api", 42, 61, true),
  Service("db", 87, 74, true),
  Service("cache", 8, 30, false),
]

string[][] rows = []
string[][] bars = []
for s in services (
  string status = if s.up then "up" else "DOWN"
  rows.append([s.name, s.cpu ++ "%", s.memory ++ "%", status])
  bars.append([s.name, s.cpu])
)

log tui.table(["service", "cpu", "mem", "status"], rows, {
  cellColor: def(any cell) string -> if cell == "DOWN" then "red" else "white"
})
log tui.box("db", "cpu " ++ tui.progress(87, 100, 20) ++ "\nmem " ++ tui.progress(74, 100, 20))
log tui.barChart(bars, 20, true)
```

```output
+---------+-----+-----+--------+
| service | cpu | mem | status |
+---------+-----+-----+--------+
| api     | 42% | 61% | up     |
| db      | 87% | 74% | up     |
| cache   | 8%  | 30% | DOWN   |
+---------+-----+-----+--------+
┌─ db ───────────────────────────┐
│ cpu [█████████████████░░░] 87% │
│ mem [██████████████░░░░░░] 74% │
└────────────────────────────────┘
████████████████████
api             █████████ 42.00
db              ████████████████████ 87.00
cache           █ 8.00
```

:::exercise title="A third bar"
Add `["cache", 8]` to the chart data.

```osl
import "std:tui"

string[][] bars = [["api", 42], ["db", 87]]
log tui.barChart(bars, 10, false)
```

```output
██████████
api             ████ 42.00
db              ██████████ 87.00
cache            8.00
```

> [!hint]
> It's one more array in the list.

```osl solution
import "std:tui"

string[][] bars = [["api", 42], ["db", 87], ["cache", 8]]
log tui.barChart(bars, 10, false)
```
:::

:::quiz
Why do the tui functions return strings and not print?

- [ ] Printing is slow.
- [x] A string can be combined, tested and printed in one go, so a screen doesn't flicker.
- [ ] They can't print.

Returning text lets you build a whole screen first, check it in a test, and write it once.
:::

## Keep the data in a model

A `Dashboard` class holds the services and the selection, and `render(d)` returns the whole screen as a string. `sample()` nudges every reading and sometimes takes a service down. The try-it tab seeds `std:random`, so this page always shows the same numbers. For real ones, replace `sample()` with readings from `std:sys` or `std:requests`.

```osl
import "std:tui"
import "std:random"

struct Service (
  string name
  int cpu
  int memory
  bool up
)

def clampInt(int v, int low, int high) int (
  return max(low, min(v, high))
)

class Dashboard (
  Service[] services = []
  int selected = 1

  def add(string name, int cpu, int memory) (
    self.services.append(Service(name, cpu, memory, true))
  )

  def sample() (
    Service[] next = []
    for s in self.services (
      int cpu = clampInt(s.cpu + random.int(-15, 15), 1, 99)
      int memory = clampInt(s.memory + random.int(-5, 5), 5, 95)
      bool up = random.int(1, 20) != 1
      next.append(Service(s.name, cpu, memory, up))
    )
    self.services = next
  )
)

def render(Dashboard d) string (
  string[][] rows = []
  string[][] bars = []
  for i, s in d.services (
    string marker = if i == d.selected then ">" else " "
    string status = if s.up then "up" else "DOWN"
    rows.append([marker ++ " " ++ s.name, s.cpu ++ "%", s.memory ++ "%", status])
    bars.append([s.name, s.cpu])
  )
  Service chosen = d.services[d.selected]
  string table = tui.table(["service", "cpu", "mem", "status"], rows, {
    cellColor: def(any cell) string -> if cell == "DOWN" then "red" else "white"
  })
  string load = "cpu " ++ tui.progress(chosen.cpu, 100, 20)
  string mem = "mem " ++ tui.progress(chosen.memory, 100, 20)
  string detail = tui.box(chosen.name, load ++ "\n" ++ mem)
  return table ++ "\n" ++ detail ++ "\n" ++ tui.barChart(bars, 20, true)
)

// try it
random.seed(9)
Dashboard d = Dashboard()
d.add("api", 42, 61)
d.add("db", 87, 74)
d.add("cache", 8, 30)
for _ in 1 to 5 (
  d.sample()
)
log render(d)
```

```output
+---------+-----+-----+--------+
| service | cpu | mem | status |
+---------+-----+-----+--------+
| > api   | 46% | 72% | up     |
|   db    | 62% | 71% | up     |
|   cache | 8%  | 28% | up     |
+---------+-----+-----+--------+
┌─ api ──────────────────────────┐
│ cpu [█████████░░░░░░░░░░░] 46% │
│ mem [██████████████░░░░░░] 72% │
└────────────────────────────────┘
████████████████████
api             ██████████████ 46.00
db              ████████████████████ 62.00
cache           ██ 8.00
```

**Try changing** the seed, or the number of samples.

:::exercise title="Busiest service"
Write `busiest`: the name of the service with the highest cpu.

```osl
struct Service (
  string name
  int cpu
  int memory
  bool up
)

Service[] services = [
  Service("api", 42, 61, true),
  Service("db", 87, 74, true),
  Service("cache", 8, 30, false),
]

def busiest(Service[] services) string (
  return ""
)

log busiest(services)
```

```output
db
```

> [!hint]
> Keep the best one so far in a variable and compare in a loop.

```osl solution
struct Service (
  string name
  int cpu
  int memory
  bool up
)

Service[] services = [
  Service("api", 42, 61, true),
  Service("db", 87, 74, true),
  Service("cache", 8, 30, false),
]

def busiest(Service[] services) string (
  Service top = services[1]
  for s in services (
    if s.cpu > top.cpu (
      top = s
    )
  )
  return top.name
)

log busiest(services)
```
:::


## Handle keys

`handleKey` takes a key name (`"up"`, `"down"`, `"q"`, `"enter"`, `"ctrl+c"`...) and returns false when it's time to quit. It's a plain method, so the try-it tab tests it with a list of keys, no keyboard needed. `selected` is clamped to the list, and unknown keys do nothing.

```osl
import "std:tui"
import "std:random"

struct Service (
  string name
  int cpu
  int memory
  bool up
)

def clampInt(int v, int low, int high) int (
  return max(low, min(v, high))
)

class Dashboard (
  Service[] services = []
  int selected = 1

  def add(string name, int cpu, int memory) (
    self.services.append(Service(name, cpu, memory, true))
  )

  def sample() (
    Service[] next = []
    for s in self.services (
      int cpu = clampInt(s.cpu + random.int(-15, 15), 1, 99)
      int memory = clampInt(s.memory + random.int(-5, 5), 5, 95)
      bool up = random.int(1, 20) != 1
      next.append(Service(s.name, cpu, memory, up))
    )
    self.services = next
  )

  def handleKey(string key) boolean (
    switch key (
      case "up"
        self.selected = clampInt(self.selected - 1, 1, self.services.len)
      case "down"
        self.selected = clampInt(self.selected + 1, 1, self.services.len)
      case "q"
        return false
    )
    return true
  )
)

def render(Dashboard d) string (
  string[][] rows = []
  string[][] bars = []
  for i, s in d.services (
    string marker = if i == d.selected then ">" else " "
    string status = if s.up then "up" else "DOWN"
    rows.append([marker ++ " " ++ s.name, s.cpu ++ "%", s.memory ++ "%", status])
    bars.append([s.name, s.cpu])
  )
  Service chosen = d.services[d.selected]
  string table = tui.table(["service", "cpu", "mem", "status"], rows, {
    cellColor: def(any cell) string -> if cell == "DOWN" then "red" else "white"
  })
  string load = "cpu " ++ tui.progress(chosen.cpu, 100, 20)
  string mem = "mem " ++ tui.progress(chosen.memory, 100, 20)
  string detail = tui.box(chosen.name, load ++ "\n" ++ mem)
  return table ++ "\n" ++ detail ++ "\n" ++ tui.barChart(bars, 20, true)
)

// try it
random.seed(9)
Dashboard d = Dashboard()
d.add("api", 42, 61)
d.add("db", 87, 74)
d.add("cache", 8, 30)
d.sample()
for key in ["down", "down", "down", "up", "x", "q", "never reached"] (
  boolean keep = d.handleKey(key)
  log key d.selected keep
  if !keep break
)
d.handleKey("down")
log render(d)
```

```output
down 2 true
down 3 true
down 3 true
up 2 true
x 2 true
q 2 false
+---------+-----+-----+--------+
| service | cpu | mem | status |
+---------+-----+-----+--------+
|   api   | 34% | 61% | up     |
|   db    | 87% | 79% | DOWN   |
| > cache | 1%  | 33% | up     |
+---------+-----+-----+--------+
┌─ cache ────────────────────────┐
│ cpu [░░░░░░░░░░░░░░░░░░░░] 1%  │
│ mem [██████░░░░░░░░░░░░░░] 33% │
└────────────────────────────────┘
████████████████████
api             ███████ 34.00
db              ████████████████████ 87.00
cache            1.00
```

:::exercise title="More keys"
Make `up` move the selection up (not below 1) and `home` jump to 1.

```osl
def handleKey(string key, int selected, int count) int (
  switch key (
    case "down"
      return min(selected + 1, count)
  )
  return selected
)

log handleKey("down", 1, 3)
log handleKey("up", 2, 3)
log handleKey("home", 3, 3)
```

```output
2
1
1
```

> [!hint]
> Add two more `case`s.

```osl solution
def handleKey(string key, int selected, int count) int (
  switch key (
    case "down"
      return min(selected + 1, count)
    case "up"
      return max(selected - 1, 1)
    case "home"
      return 1
  )
  return selected
)

log handleKey("down", 1, 3)
log handleKey("up", 2, 3)
log handleKey("home", 3, 3)
```
:::

:::quiz
In the live loop, why check `tui.keyPressed()` before `tui.readKey()`?

- [ ] `readKey` doesn't work otherwise.
- [x] `readKey` waits for a key, which would freeze the refresh when nobody's typing.
- [ ] It makes the keys faster.

`keyPressed` says whether a key is waiting without blocking, so the loop can keep refreshing.
:::

## Go live

The loop moves the cursor to the top-left, draws the screen, then waits a second in ten 100 ms slices, checking the keyboard each time so keys feel instant. Then it samples again. Add `import "std:thread"` to the top of the program and put this at the bottom, in place of the try-it code:

```osl fragment
Dashboard d = Dashboard()
d.add("api", 42, 61)
d.add("db", 87, 74)
d.add("cache", 8, 30)
d.sample()

tui.hideCursor()
tui.clear()
bool running = true
while running (
  tui.moveTo(1, 1)
  log tui.style("bold", "Dashboard") ++ "  (up/down to select, q to quit)"
  log render(d)
  for _ in 1 to 10 (
    if tui.keyPressed() (
      string key = tui.readKey().unwrap()
      running = d.handleKey(key)
    )
    thread.sleep(100)
  )
  d.sample()
)
tui.showCursor()
tui.clear()
```

`tui.hideCursor()` and `tui.showCursor()` bracket the loop. The live loop needs a real terminal, so run this one yourself with `osl run dashboard.osl`. For full-screen layouts there's also `tui.newScreen`, a buffer of cells you `set` and `render`. Next: [tui](../packages/tui.md), [sys](../packages/sys.md), or a [chat bot](chat-bot.md).
