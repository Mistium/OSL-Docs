---
layout: project
description: Build Snake with `std:raylib`, keeping the rules in plain code you can run and test as text, and drawing the board in a window at the end.
uses: raylib
time: 25 minutes
---

# Build a game

You'll build Snake. The trick is to keep the rules apart from the drawing: the game is a class, and every step prints the board as text, so it all runs on this page. Only the last step opens a window.

Coordinates start at 1 and `y` grows downwards, like the screen.

## Draw the board

A point is a struct, the snake is an array of points, and the head is the first one. `render` builds the board row by row: `@` for the head, `o` for the body, `.` for nothing.

```osl
struct Point (
  int x
  int y
)

def render(Point[] snake, int width, int height) string (
  string board = ""
  for y in 1 to height (
    string row = ""
    for x in 1 to width (
      string cell = "."
      for i, p in snake (
        if p.x == x and p.y == y (
          cell = if i == 1 then "@" else "o"
        )
      )
      row ++= cell
    )
    board ++= row ++ "\n"
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

**Try changing** the snake's points, or the board size.

:::exercise title="Head or body"
Make `symbol` return `@` for the first segment and `o` for the rest.

```osl
def symbol(int index) string (
  return "o"
)

log symbol(1) symbol(2) symbol(3)
```

```output
@ o o
```

> [!hint]
> `if index == 1 then ... else ...`.

```osl solution
def symbol(int index) string (
  return if index == 1 then "@" else "o"
)

log symbol(1) symbol(2) symbol(3)
```
:::


## Move

Moving is: put a new head in front, drop the last segment. `step` takes a direction and returns the moved snake. The try-it tab moves right and then down.

```osl
struct Point (
  int x
  int y
)

def render(Point[] snake, int width, int height) string (
  string board = ""
  for y in 1 to height (
    string row = ""
    for x in 1 to width (
      string cell = "."
      for i, p in snake (
        if p.x == x and p.y == y (
          cell = if i == 1 then "@" else "o"
        )
      )
      row ++= cell
    )
    board ++= row ++ "\n"
  )
  return board
)


def step(Point[] snake, string dir) Point[] (
  Point head = snake[1]
  Point next = head
  switch dir (
    case "up"
      next = Point(head.x, head.y - 1)
    case "down"
      next = Point(head.x, head.y + 1)
    case "left"
      next = Point(head.x - 1, head.y)
    case "right"
      next = Point(head.x + 1, head.y)
  )
  Point[] moved = [next]
  for i, p in snake (
    if i < snake.len (
      moved.append(p)
    )
  )
  return moved
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

:::exercise title="Opposites"
Write `opposite` so it returns `right` for `left`, `down` for `up`, and so on. Next step needs it to stop the snake turning back on itself.

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
> A `switch` on `dir` with a `return` in each case.

```osl solution
def opposite(string dir) string (
  switch dir (
    case "left"
      return "right"
    case "right"
      return "left"
    case "up"
      return "down"
    default
      return "up"
  )
)

log opposite("left") opposite("up") opposite("down") opposite("right")
```
:::


## Make it a game

State and rules now live in a `Game` class: the snake, the direction and methods `turn`, `update` and `render`. `turn` ignores a reversal, because turning back into your own neck would be instant death. The try-it tab queues a few turns and updates.

```osl
struct Point (
  int x
  int y
)

class Game (
  int width = 10
  int height = 5
  Point[] snake = [Point(4, 3), Point(3, 3), Point(2, 3)]
  string dir = "right"

  def turn(string next) (
    boolean reverse = (self.dir == "left" and next == "right") or (self.dir == "right" and next == "left") or (self.dir == "up" and next == "down") or (self.dir == "down" and next == "up")
    if !reverse (
      self.dir = next
    )
  )

  def update() (
    Point head = self.snake[1]
    Point next = head
    switch self.dir (
      case "up"
        next = Point(head.x, head.y - 1)
      case "down"
        next = Point(head.x, head.y + 1)
      case "left"
        next = Point(head.x - 1, head.y)
      case "right"
        next = Point(head.x + 1, head.y)
    )
    Point[] moved = [next]
    for i, p in self.snake (
      if i < self.snake.len (
        moved.append(p)
      )
    )
    self.snake = moved
  )

  def render() string (
    string board = ""
    for y in 1 to self.height (
      string row = ""
      for x in 1 to self.width (
        string cell = "."
        for i, p in self.snake (
          if p.x == x and p.y == y (
            cell = if i == 1 then "@" else "o"
          )
        )
        row ++= cell
      )
      board ++= row ++ "\n"
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

:::quiz
`Point` is a struct and `Game` is a class. Why?

- [ ] Classes are faster.
- [x] A point is a small value that's fine to copy. The game is one thing whose state changes.
- [ ] Structs can't hold numbers.

Structs copy on assignment and classes are shared. `game.update()` has to change the one game everyone holds.
:::

## Food and score

The food is a point. When the head lands on it, the tail stays, so the snake grows, the score goes up and the food moves. Where? `random` is a tiny generator inside the game, so the same seed always gives the same food and every step here prints the same board.

```osl
struct Point (
  int x
  int y
)

class Game (
  int width = 10
  int height = 5
  Point[] snake = [Point(4, 3), Point(3, 3), Point(2, 3)]
  string dir = "right"
  Point food = Point(7, 3)
  int score = 0
  int seed = 5

  def random(int below) int (
    self.seed = ((self.seed * 1103515245) + 12345) % 2147483648
    return self.seed % below
  )

  def turn(string next) (
    boolean reverse = (self.dir == "left" and next == "right") or (self.dir == "right" and next == "left") or (self.dir == "up" and next == "down") or (self.dir == "down" and next == "up")
    if !reverse (
      self.dir = next
    )
  )

  def placeFood() (
    boolean free = false
    while !free (
      Point spot = Point(1 + self.random(self.width), 1 + self.random(self.height))
      free = true
      for p in self.snake (
        if p.x == spot.x and p.y == spot.y (
          free = false
        )
      )
      self.food = spot
    )
  )

  def update() (
    Point head = self.snake[1]
    Point next = head
    switch self.dir (
      case "up"
        next = Point(head.x, head.y - 1)
      case "down"
        next = Point(head.x, head.y + 1)
      case "left"
        next = Point(head.x - 1, head.y)
      case "right"
        next = Point(head.x + 1, head.y)
    )
    Point[] moved = [next]
    for i, p in self.snake (
      if i < self.snake.len (
        moved.append(p)
      )
    )
    if next.x == self.food.x and next.y == self.food.y (
      moved.append(self.snake[self.snake.len])
      self.score += 1
      self.snake = moved
      self.placeFood()
    ) else (
      self.snake = moved
    )
  )

  def render() string (
    string board = ""
    for y in 1 to self.height (
      string row = ""
      for x in 1 to self.width (
        string cell = "."
        if self.food.x == x and self.food.y == y (
          cell = "*"
        )
        for i, p in self.snake (
          if p.x == x and p.y == y (
            cell = if i == 1 then "@" else "o"
          )
        )
        row ++= cell
      )
      board ++= row ++ "\n"
    )
    return board ++ "score " ++ self.score
  )
)

// try it
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
*..ooo@...
..........
..........
score 1
4
```

**Try changing** `seed`, and watch the food land somewhere else.

:::exercise title="Stay on the board"
Write `inBounds`: true when the point is inside the board.

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

Hitting a wall or your own body sets `over`, and `update` stops doing anything. Eight steps to the right is more than the board has: the try-it tab ends in `GAME OVER`.

```osl
struct Point (
  int x
  int y
)

class Game (
  int width = 10
  int height = 5
  Point[] snake = [Point(4, 3), Point(3, 3), Point(2, 3)]
  string dir = "right"
  Point food = Point(7, 3)
  int score = 0
  bool over = false
  int seed = 5

  def random(int below) int (
    self.seed = ((self.seed * 1103515245) + 12345) % 2147483648
    return self.seed % below
  )

  def turn(string next) (
    boolean reverse = (self.dir == "left" and next == "right") or (self.dir == "right" and next == "left") or (self.dir == "up" and next == "down") or (self.dir == "down" and next == "up")
    if !reverse (
      self.dir = next
    )
  )

  def placeFood() (
    boolean free = false
    while !free (
      Point spot = Point(1 + self.random(self.width), 1 + self.random(self.height))
      free = true
      for p in self.snake (
        if p.x == spot.x and p.y == spot.y (
          free = false
        )
      )
      self.food = spot
    )
  )

  def update() (
    if self.over return
    Point head = self.snake[1]
    Point next = head
    switch self.dir (
      case "up"
        next = Point(head.x, head.y - 1)
      case "down"
        next = Point(head.x, head.y + 1)
      case "left"
        next = Point(head.x - 1, head.y)
      case "right"
        next = Point(head.x + 1, head.y)
    )
    if next.x < 1 or next.x > self.width or next.y < 1 or next.y > self.height (
      self.over = true
      return
    )
    for p in self.snake (
      if p.x == next.x and p.y == next.y (
        self.over = true
        return
      )
    )
    Point[] moved = [next]
    for i, p in self.snake (
      if i < self.snake.len (
        moved.append(p)
      )
    )
    if next.x == self.food.x and next.y == self.food.y (
      moved.append(self.snake[self.snake.len])
      self.score += 1
      self.snake = moved
      self.placeFood()
    ) else (
      self.snake = moved
    )
  )

  def render() string (
    string board = ""
    for y in 1 to self.height (
      string row = ""
      for x in 1 to self.width (
        string cell = "."
        if self.food.x == x and self.food.y == y (
          cell = "*"
        )
        for i, p in self.snake (
          if p.x == x and p.y == y (
            cell = if i == 1 then "@" else "o"
          )
        )
        row ++= cell
      )
      board ++= row ++ "\n"
    )
    string status = if self.over then "GAME OVER" else "score " ++ self.score
    return board ++ status
  )
)

// try it
Game g = Game()
for _ in 1 to 8 (
  g.update()
)
log g.render()
log g.over
```

```output
..........
..........
*.....ooo@
..........
..........
GAME OVER
true
```

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

## Play a scripted game

A `play` function feeds a list of moves in, one per tick (`-` means keep going). This is how you'd test a rule: set up a game, play it, and check the result.

```osl
struct Point (
  int x
  int y
)

class Game (
  int width = 10
  int height = 5
  Point[] snake = [Point(4, 3), Point(3, 3), Point(2, 3)]
  string dir = "right"
  Point food = Point(7, 3)
  int score = 0
  bool over = false
  int seed = 5

  def random(int below) int (
    self.seed = ((self.seed * 1103515245) + 12345) % 2147483648
    return self.seed % below
  )

  def turn(string next) (
    boolean reverse = (self.dir == "left" and next == "right") or (self.dir == "right" and next == "left") or (self.dir == "up" and next == "down") or (self.dir == "down" and next == "up")
    if !reverse (
      self.dir = next
    )
  )

  def placeFood() (
    boolean free = false
    while !free (
      Point spot = Point(1 + self.random(self.width), 1 + self.random(self.height))
      free = true
      for p in self.snake (
        if p.x == spot.x and p.y == spot.y (
          free = false
        )
      )
      self.food = spot
    )
  )

  def update() (
    if self.over return
    Point head = self.snake[1]
    Point next = head
    switch self.dir (
      case "up"
        next = Point(head.x, head.y - 1)
      case "down"
        next = Point(head.x, head.y + 1)
      case "left"
        next = Point(head.x - 1, head.y)
      case "right"
        next = Point(head.x + 1, head.y)
    )
    if next.x < 1 or next.x > self.width or next.y < 1 or next.y > self.height (
      self.over = true
      return
    )
    for p in self.snake (
      if p.x == next.x and p.y == next.y (
        self.over = true
        return
      )
    )
    Point[] moved = [next]
    for i, p in self.snake (
      if i < self.snake.len (
        moved.append(p)
      )
    )
    if next.x == self.food.x and next.y == self.food.y (
      moved.append(self.snake[self.snake.len])
      self.score += 1
      self.snake = moved
      self.placeFood()
    ) else (
      self.snake = moved
    )
  )

  def render() string (
    string board = ""
    for y in 1 to self.height (
      string row = ""
      for x in 1 to self.width (
        string cell = "."
        if self.food.x == x and self.food.y == y (
          cell = "*"
        )
        for i, p in self.snake (
          if p.x == x and p.y == y (
            cell = if i == 1 then "@" else "o"
          )
        )
        row ++= cell
      )
      board ++= row ++ "\n"
    )
    string status = if self.over then "GAME OVER" else "score " ++ self.score
    return board ++ status
  )
)

def play(Game g, string[] moves) (
  for move in moves (
    if move != "-" (
      g.turn(move)
    )
    g.update()
  )
)

// try it
Game g = Game()
play(g, ["-", "-", "-", "down", "-", "left", "-", "-", "up"])
log g.render()
log g.snake.len g.score g.over
```

```output
..........
..........
*.........
...@......
...ooo....
score 1
4 1 false
```

**Try changing** the moves, and see if you can reach 2 points.

## Draw it with raylib

Now the window. `raylib.runWindow(frame, options)` opens one and calls `frame(ms)` each frame until it closes. The frame reads the arrow keys, calls `turn`, `update`s every 150 ms, and draws the state: `raylib.clear`, then a `rectangle` per segment and some `text`. None of the rules changed. Raylib draws through SDL2, which needs its development files to build. Next: [raylib](../packages/raylib.md) (textures, sound, 3D), or a [terminal dashboard](terminal-dashboard.md).

```osl norun
import "std:raylib"

struct Point (
  int x
  int y
)

class Game (
  int width = 10
  int height = 5
  Point[] snake = [Point(4, 3), Point(3, 3), Point(2, 3)]
  string dir = "right"
  Point food = Point(7, 3)
  int score = 0
  bool over = false
  int seed = 5

  def random(int below) int (
    self.seed = ((self.seed * 1103515245) + 12345) % 2147483648
    return self.seed % below
  )

  def turn(string next) (
    boolean reverse = (self.dir == "left" and next == "right") or (self.dir == "right" and next == "left") or (self.dir == "up" and next == "down") or (self.dir == "down" and next == "up")
    if !reverse (
      self.dir = next
    )
  )

  def placeFood() (
    boolean free = false
    while !free (
      Point spot = Point(1 + self.random(self.width), 1 + self.random(self.height))
      free = true
      for p in self.snake (
        if p.x == spot.x and p.y == spot.y (
          free = false
        )
      )
      self.food = spot
    )
  )

  def update() (
    if self.over return
    Point head = self.snake[1]
    Point next = head
    switch self.dir (
      case "up"
        next = Point(head.x, head.y - 1)
      case "down"
        next = Point(head.x, head.y + 1)
      case "left"
        next = Point(head.x - 1, head.y)
      case "right"
        next = Point(head.x + 1, head.y)
    )
    if next.x < 1 or next.x > self.width or next.y < 1 or next.y > self.height (
      self.over = true
      return
    )
    for p in self.snake (
      if p.x == next.x and p.y == next.y (
        self.over = true
        return
      )
    )
    Point[] moved = [next]
    for i, p in self.snake (
      if i < self.snake.len (
        moved.append(p)
      )
    )
    if next.x == self.food.x and next.y == self.food.y (
      moved.append(self.snake[self.snake.len])
      self.score += 1
      self.snake = moved
      self.placeFood()
    ) else (
      self.snake = moved
    )
  )

  def render() string (
    string board = ""
    for y in 1 to self.height (
      string row = ""
      for x in 1 to self.width (
        string cell = "."
        if self.food.x == x and self.food.y == y (
          cell = "*"
        )
        for i, p in self.snake (
          if p.x == x and p.y == y (
            cell = if i == 1 then "@" else "o"
          )
        )
        row ++= cell
      )
      board ++= row ++ "\n"
    )
    string status = if self.over then "GAME OVER" else "score " ++ self.score
    return board ++ status
  )
)

int cell = 32
Game game = Game()
game.width = 16
game.height = 12
number elapsed = 0

raylib.runWindow(def(number ms) (
  if raylib.isKeyPressed("up") (
    game.turn("up")
  )
  if raylib.isKeyPressed("down") (
    game.turn("down")
  )
  if raylib.isKeyPressed("left") (
    game.turn("left")
  )
  if raylib.isKeyPressed("right") (
    game.turn("right")
  )
  if game.over and raylib.isKeyPressed("r") (
    game = Game()
    game.width = 16
    game.height = 12
  )

  elapsed += ms
  if elapsed >= 150 (
    elapsed -= 150
    game.update()
  )

  raylib.clear("#1e1e2e")
  raylib.rectangle({x: ((game.food.x - 1) * cell) + 4, y: ((game.food.y - 1) * cell) + 4, width: cell - 8, height: cell - 8}, "#f38ba8", {radius: 8})
  for i, p in game.snake (
    string color = if i == 1 then "#a6e3a1" else "#74c7ec"
    raylib.rectangle({x: ((p.x - 1) * cell) + 1, y: ((p.y - 1) * cell) + 1, width: cell - 2, height: cell - 2}, color, {radius: 6})
  )
  raylib.text("Score " ++ game.score, {x: 8, y: 6}, {size: 20, color: "#cdd6f4"})
  if game.over (
    raylib.text("Game over. Press R", {x: 150, y: 170}, {size: 28, color: "#cdd6f4"})
  )
), {width: 512, height: 384, title: "Snake", fps: 60})
```

