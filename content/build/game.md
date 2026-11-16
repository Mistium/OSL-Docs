---
layout: project
description: Build Snake with `std:raylib`, keeping the rules in plain code you can run and test as text, and drawing the board in a window at the end.
uses: raylib, random
time: 25 minutes
---

# Build a game

You'll build Snake. The trick is to keep the rules apart from the drawing: the game is a class, and every step prints the board as text, so it all runs on this page. Only the last step opens a window.

Coordinates start at 1 and `y` grows downwards, like the screen.

## Draw the board

A point is a struct, the snake is an array of points, and the head is the first one. `cellAt` says what's on one square (`@` head, `o` body, `.` nothing) and `render` strings the squares into rows.

```osl
struct Point (
  int x
  int y
)

def cellAt(Point[] snake, Point p) string (
  if p == snake[1] return "@"
  if snake.contains(p) return "o"
  return "."
)

def render(Point[] snake, int width, int height) string (
  string board = ""
  for y in 1 to height (
    for x in 1 to width (
      board ++= cellAt(snake, Point(x, y))
    )
    board ++= "\n"
  )
  return board
)

// try it
Point[] snake = [Point(4, 3), Point(3, 3), Point(2, 3)]
log render(snake, 10, 5)
```

```output
..........
..........
.oo@......
..........
..........
```

Structs compare by value, so `p == snake[1]` is true when the coordinates match. **Try changing** the snake's points or the board size.

:::exercise title="Mark the tail"
Make `symbol` return `@` for the first segment, `x` for the last and `o` for the ones between.

```osl
def symbol(int index, int length) string (
  return "o"
)

log symbol(1, 3) symbol(2, 3) symbol(3, 3)
```

```output
@ o x
```

> [!hint]
> Two early `return`s, one for `index == 1` and one for `index == length`.

```osl solution
def symbol(int index, int length) string (
  if index == 1 return "@"
  if index == length return "x"
  return "o"
)

log symbol(1, 3) symbol(2, 3) symbol(3, 3)
```
:::

## Move

Moving is: put a new head in front and drop the last segment. `delta` turns a direction into a step, and `step` returns the moved snake. `snake.trim(1, snake.len - 1)` keeps everything except the tail.

```osl
struct Point (
  int x
  int y
)

def cellAt(Point[] snake, Point p) string (
  if p == snake[1] return "@"
  if snake.contains(p) return "o"
  return "."
)

def render(Point[] snake, int width, int height) string (
  string board = ""
  for y in 1 to height (
    for x in 1 to width (
      board ++= cellAt(snake, Point(x, y))
    )
    board ++= "\n"
  )
  return board
)

def delta(string dir) Point -> match dir (
  "up" -> Point(0, -1)
  "down" -> Point(0, 1)
  "left" -> Point(-1, 0)
  _ -> Point(1, 0)
)

def step(Point[] snake, string dir) Point[] (
  Point d = delta(dir)
  Point head = snake[1]
  return [Point(head.x + d.x, head.y + d.y)] ++ snake.trim(1, snake.len - 1)
)

// try it
Point[] snake = [Point(4, 3), Point(3, 3), Point(2, 3)]
snake = step(snake, "right")
snake = step(snake, "down")
log render(snake, 10, 5)
```

```output
..........
..........
...oo.....
....@.....
..........
```

**Try changing** the directions, or chain a few more `step` calls.

:::exercise title="Opposites"
Write `opposite` so it returns `right` for `left`, `down` for `up`, and so on. The next step uses it to stop the snake turning back on itself.

```osl
def opposite(string dir) string (
  return dir
)

log opposite("left") opposite("up") opposite("down") opposite("right")
```

```output
right down up left
```

> [!hint]
> It's a `match` on `dir`, like `delta` above.

```osl solution
def opposite(string dir) string -> match dir (
  "up" -> "down"
  "down" -> "up"
  "left" -> "right"
  _ -> "left"
)

log opposite("left") opposite("up") opposite("down") opposite("right")
```
:::

## Make it a game

State and rules now live in a `Game` class: the snake, the direction, and the methods `turn`, `update` and `render`. `turn` ignores a reversal, because turning into your own neck would be instant death. `update` is just `step` on the game's own snake.

```osl
struct Point (
  int x
  int y
)

def delta(string dir) Point -> match dir (
  "up" -> Point(0, -1)
  "down" -> Point(0, 1)
  "left" -> Point(-1, 0)
  _ -> Point(1, 0)
)

def opposite(string dir) string -> match dir (
  "up" -> "down"
  "down" -> "up"
  "left" -> "right"
  _ -> "left"
)

def step(Point[] snake, string dir) Point[] (
  Point d = delta(dir)
  Point head = snake[1]
  return [Point(head.x + d.x, head.y + d.y)] ++ snake.trim(1, snake.len - 1)
)

class Game (
  int width = 10
  int height = 5
  Point[] snake = [Point(4, 3), Point(3, 3), Point(2, 3)]
  string dir = "right"

  def turn(string next) (
    if next != opposite(self.dir) (
      self.dir = next
    )
  )

  def update() (
    self.snake = step(self.snake, self.dir)
  )

  def cellAt(Point p) string (
    if p == self.snake[1] return "@"
    if self.snake.contains(p) return "o"
    return "."
  )

  def render() string (
    string board = ""
    for y in 1 to self.height (
      for x in 1 to self.width (
        board ++= self.cellAt(Point(x, y))
      )
      board ++= "\n"
    )
    return board
  )
)

// try it
Game g = Game()
g.update()
g.turn("left")
g.update()
g.turn("down")
g.update()
g.update()
log g.render()
```

```output
..........
..........
.....o....
.....o....
.....@....
```

The `turn("left")` did nothing: the snake was heading right. Delete it and `turn("down")` still works.

:::quiz
`Point` is a struct and `Game` is a class. Why?

- [ ] Classes are faster.
- [x] A point is a small value that's fine to copy. The game is one thing whose state changes.
- [ ] Structs can't hold numbers.

Structs copy on assignment and classes are shared. `g.update()` has to change the one game everyone holds.
:::

## Food and score

The food is a point. When the head lands on it, the tail stays, so the snake grows, the score goes up and the food moves somewhere the snake isn't. `std:random` picks the spot. The try-it tab seeds it, so the food lands on the same square every time you run it.

```osl
import "std:random"

struct Point (
  int x
  int y
)

def delta(string dir) Point -> match dir (
  "up" -> Point(0, -1)
  "down" -> Point(0, 1)
  "left" -> Point(-1, 0)
  _ -> Point(1, 0)
)

def opposite(string dir) string -> match dir (
  "up" -> "down"
  "down" -> "up"
  "left" -> "right"
  _ -> "left"
)

def step(Point[] snake, string dir) Point[] (
  Point d = delta(dir)
  Point head = snake[1]
  return [Point(head.x + d.x, head.y + d.y)] ++ snake.trim(1, snake.len - 1)
)

class Game (
  int width = 10
  int height = 5
  Point[] snake = [Point(4, 3), Point(3, 3), Point(2, 3)]
  string dir = "right"
  Point food = Point(7, 3)
  int score = 0

  def turn(string next) (
    if next != opposite(self.dir) (
      self.dir = next
    )
  )

  def placeFood() (
    Point spot = Point(random.int(1, self.width), random.int(1, self.height))
    while self.snake.contains(spot) (
      spot = Point(random.int(1, self.width), random.int(1, self.height))
    )
    self.food = spot
  )

  def update() (
    Point tail = self.snake[self.snake.len]
    self.snake = step(self.snake, self.dir)
    if self.snake[1] == self.food (
      self.snake.append(tail)
      self.score += 1
      self.placeFood()
    )
  )

  def cellAt(Point p) string (
    if p == self.snake[1] return "@"
    if self.snake.contains(p) return "o"
    if p == self.food return "*"
    return "."
  )

  def render() string (
    string board = ""
    for y in 1 to self.height (
      for x in 1 to self.width (
        board ++= self.cellAt(Point(x, y))
      )
      board ++= "\n"
    )
    return board ++ "score " ++ self.score
  )
)

// try it
random.seed(5)
Game g = Game()
for _ in 1 to 3 (
  g.update()
)
log g.render()
log g.snake.len
```

```output
..........
..........
...ooo@...
..........
........*.
score 1
4
```

**Try changing** the seed and watch the food land somewhere else.

:::exercise title="Stay on the board"
Write `inBounds`: true when the point is inside the board. The next step needs it.

```osl
struct Point (
  int x
  int y
)

def inBounds(Point p, int width, int height) boolean (
  return true
)

log inBounds(Point(1, 1), 10, 5)
log inBounds(Point(0, 3), 10, 5)
log inBounds(Point(10, 6), 10, 5)
```

```output
true
false
false
```

> [!hint]
> Four comparisons joined with `and`.

```osl solution
struct Point (
  int x
  int y
)

def inBounds(Point p, int width, int height) boolean (
  return p.x >= 1 and p.x <= width and p.y >= 1 and p.y <= height
)

log inBounds(Point(1, 1), 10, 5)
log inBounds(Point(0, 3), 10, 5)
log inBounds(Point(10, 6), 10, 5)
```
:::

## Game over

Hitting a wall or your own body sets `over`, and `update` stops doing anything. The try-it tab runs eight steps to the right, which is more than the board has, and then plays a scripted game: `play` feeds in one move per tick (`-` means keep going). That's how you'd test a rule: set up a game, play it, check the result.

```osl
import "std:random"

struct Point (
  int x
  int y
)

def delta(string dir) Point -> match dir (
  "up" -> Point(0, -1)
  "down" -> Point(0, 1)
  "left" -> Point(-1, 0)
  _ -> Point(1, 0)
)

def opposite(string dir) string -> match dir (
  "up" -> "down"
  "down" -> "up"
  "left" -> "right"
  _ -> "left"
)

def step(Point[] snake, string dir) Point[] (
  Point d = delta(dir)
  Point head = snake[1]
  return [Point(head.x + d.x, head.y + d.y)] ++ snake.trim(1, snake.len - 1)
)

class Game (
  int width = 10
  int height = 5
  Point[] snake = [Point(4, 3), Point(3, 3), Point(2, 3)]
  string dir = "right"
  Point food = Point(7, 3)
  int score = 0
  bool over = false

  def turn(string next) (
    if next != opposite(self.dir) (
      self.dir = next
    )
  )

  def placeFood() (
    Point spot = Point(random.int(1, self.width), random.int(1, self.height))
    while self.snake.contains(spot) (
      spot = Point(random.int(1, self.width), random.int(1, self.height))
    )
    self.food = spot
  )

  def update() (
    if self.over return
    Point tail = self.snake[self.snake.len]
    Point[] moved = step(self.snake, self.dir)
    Point head = moved[1]
    boolean wall = head.x < 1 or head.x > self.width or head.y < 1 or head.y > self.height
    if wall or self.snake.contains(head) (
      self.over = true
      return
    )
    self.snake = moved
    if head == self.food (
      self.snake.append(tail)
      self.score += 1
      self.placeFood()
    )
  )

  def cellAt(Point p) string (
    if p == self.snake[1] return "@"
    if self.snake.contains(p) return "o"
    if p == self.food return "*"
    return "."
  )

  def render() string (
    string board = ""
    for y in 1 to self.height (
      for x in 1 to self.width (
        board ++= self.cellAt(Point(x, y))
      )
      board ++= "\n"
    )
    return board ++ if self.over then "GAME OVER" else "score " ++ self.score
  )
)

// try it
def play(Game g, string[] moves) (
  for move in moves (
    if move != "-" (
      g.turn(move)
    )
    g.update()
  )
)

random.seed(5)
Game wall = Game()
play(wall, ["-", "-", "-", "-", "-", "-", "-", "-"])
log wall.render()

Game g = Game()
play(g, ["-", "-", "-", "down", "-", "left", "-", "-", "up"])
log g.render()
log g.snake.len g.score g.over
```

```output
..........
..........
......ooo@
..........
........*.
GAME OVER
...*......
..........
..........
...@......
...ooo....
score 1
4 1 false
```

**Try changing** the moves and steer the snake onto the next `*`. Make it run into itself.

:::exercise title="Faster as you go"
Make `delay` return 200 at score 0, 10 less per point, and never below 80.

```osl
def delay(int score) int (
  return 200
)

log delay(0) delay(5) delay(20)
```

```output
200 150 80
```

> [!hint]
> `max(80, 200 - (score * 10))`.

```osl solution
def delay(int score) int (
  return max(80, 200 - (score * 10))
)

log delay(0) delay(5) delay(20)
```
:::

:::quiz
Why is the game logic separate from the drawing code?

- [ ] It looks tidier.
- [x] A game with no window can be run and tested anywhere, even in a page like this.
- [ ] Windows can't call methods.

If `update` never touches the window, a test can play a thousand moves in a millisecond. The window only reads the state.
:::

## Draw it with raylib

Now the window. `raylib.runWindow(frame, options)` opens one and calls `frame(ms)` each frame until it closes. The frame reads the arrow keys, calls `turn`, runs `update` every 150 ms, and draws the state: `raylib.clear`, then a `rectangle` per square and some `text`. The rules are the ones you've built; `cellAt` and `render` are gone, because raylib draws the squares. Raylib draws through SDL2, which needs its development files to build.

```osl norun
import "std:raylib"
import "std:random"

struct Point (
  int x
  int y
)

def delta(string dir) Point -> match dir (
  "up" -> Point(0, -1)
  "down" -> Point(0, 1)
  "left" -> Point(-1, 0)
  _ -> Point(1, 0)
)

def opposite(string dir) string -> match dir (
  "up" -> "down"
  "down" -> "up"
  "left" -> "right"
  _ -> "left"
)

def step(Point[] snake, string dir) Point[] (
  Point d = delta(dir)
  Point head = snake[1]
  return [Point(head.x + d.x, head.y + d.y)] ++ snake.trim(1, snake.len - 1)
)

class Game (
  int width = 16
  int height = 12
  Point[] snake = [Point(4, 3), Point(3, 3), Point(2, 3)]
  string dir = "right"
  Point food = Point(7, 3)
  int score = 0
  bool over = false

  def turn(string next) (
    if next != opposite(self.dir) (
      self.dir = next
    )
  )

  def placeFood() (
    Point spot = Point(random.int(1, self.width), random.int(1, self.height))
    while self.snake.contains(spot) (
      spot = Point(random.int(1, self.width), random.int(1, self.height))
    )
    self.food = spot
  )

  def update() (
    if self.over return
    Point tail = self.snake[self.snake.len]
    Point[] moved = step(self.snake, self.dir)
    Point head = moved[1]
    boolean wall = head.x < 1 or head.x > self.width or head.y < 1 or head.y > self.height
    if wall or self.snake.contains(head) (
      self.over = true
      return
    )
    self.snake = moved
    if head == self.food (
      self.snake.append(tail)
      self.score += 1
      self.placeFood()
    )
  )
)

int cell = 32
Game game = Game()
number elapsed = 0

def block(Point p, int inset, string color) (
  int size = cell - (inset * 2)
  raylib.rectangle({
    x: ((p.x - 1) * cell) + inset,
    y: ((p.y - 1) * cell) + inset,
    width: size,
    height: size
  }, color, {radius: 6})
)

raylib.runWindow(def(number ms) (
  for key in ["up", "down", "left", "right"] (
    if raylib.isKeyPressed(key) (
      game.turn(key)
    )
  )
  if game.over and raylib.isKeyPressed("r") (
    game = Game()
  )

  elapsed += ms
  if elapsed >= 150 (
    elapsed -= 150
    game.update()
  )

  raylib.clear("#1e1e2e")
  block(game.food, 4, "#f38ba8")
  for i, p in game.snake (
    block(p, 1, if i == 1 then "#a6e3a1" else "#74c7ec")
  )
  raylib.text("Score " ++ game.score, {x: 8, y: 6}, {size: 20, color: "#cdd6f4"})
  if game.over (
    raylib.text("Game over. Press R", {x: 150, y: 170}, {size: 28, color: "#cdd6f4"})
  )
), {width: 512, height: 384, title: "Snake", fps: 60}).unwrap()
```

Save it as `snake.osl` and run it with `osl run snake.osl`. The board is 16 by 12 squares of 32 pixels, which is the 512 by 384 window. Next: [raylib](../packages/raylib.md) for textures, sound and 3D, or a [terminal dashboard](terminal-dashboard.md).

:::quiz
The window's frame function uses `elapsed` to call `update` every 150 ms, rather than on every frame. Why?

- [ ] `update` is too slow to run 60 times a second.
- [x] Frames come as fast as the screen refreshes, so the snake would move at the frame rate. Counting milliseconds ties its speed to time instead.
- [ ] `raylib.runWindow` can't call `update` directly.

`ms` is how long the last frame took. Add it up, and each time it passes 150 take 150 off and make one move.
:::
