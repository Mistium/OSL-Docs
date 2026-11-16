---
description: Say that a value is one of a fixed set of cases, carry data with each case, and let match check you've handled them all.
lesson: 12
---

# Enums

Some values can only be one of a few things: a traffic light is red, amber or green; a download is waiting, running, done or failed. An enum lists those cases, and the compiler makes sure every part of your program handles all of them.

```osl
enum Light (
  Red
  Amber
  Green
)

Light now = Light.Red
log now == Light.Red
log now == Light.Green
```

```output
true
false
```

Write each case on its own line. Refer to a case through the enum's name: `Light.Red`.

## match checks every case

`match` on an enum must cover every case, so you can't forget one:

```osl
enum Light (
  Red
  Amber
  Green
)

def next(Light l) Light -> match l (
  Light.Red -> Light.Green
  Light.Green -> Light.Amber
  Light.Amber -> Light.Red
)

def say(Light l) string -> match l (
  Light.Red -> "stop"
  Light.Amber -> "wait"
  Light.Green -> "go"
)

Light l = Light.Red
loop 4 (
  log say(l)
  l = next(l)
)
```

```output
stop
go
wait
stop
```

Add a fourth case to `Light` and both functions stop compiling until you handle it:

```osl error
enum Light (
  Red
  Amber
  Green
  FlashingAmber
)

def say(Light l) string -> match l (
  Light.Red -> "stop"
  Light.Amber -> "wait"
  Light.Green -> "go"
)
```

That's the point of an enum: when the set of cases changes, the compiler finds every place that needs updating.

## Cases that carry data

A case can hold a value, written in brackets after its name. Each case can hold a different type, or nothing at all:

```osl
enum Shape (
  Circle(number)
  Square(number)
  Dot
)

def area(Shape s) number -> match s (
  Shape.Circle(r) -> 3.14 * r * r
  Shape.Square(side) -> side * side
  Shape.Dot -> 0
)

Shape[] shapes = [Shape.Circle(2), Shape.Square(3), Shape.Dot]
for s in shapes (
  log area(s)
)
```

```output
12.56
9
0
```

In `Shape.Circle(r) -> ...`, the name `r` takes the value the circle was made with, so the arm can use it.

## A real example: loading

Enums with data describe states well. A value can't be "loaded" and "failed" at once, and the data that goes with each state only exists in that state:

```osl
enum Load (
  Waiting
  Done(string)
  Failed(string)
)

def show(Load state) string -> match state (
  Load.Waiting -> "loading…"
  Load.Done(text) -> "got " ++ text.len ++ " characters"
  Load.Failed(reason) -> "failed: " ++ reason
)

log show(Load.Waiting)
log show(Load.Done("hello world"))
log show(Load.Failed("timed out"))
```

```output
loading…
got 11 characters
failed: timed out
```

## switch on an enum

`switch` takes enum cases too, when each case should run code rather than produce a value. Inside the case, the cases are written without the enum name:

```osl
enum Command (
  Move(int)
  Turn(string)
  Stop
)

Command[] program = [Command.Move(3), Command.Turn("left"), Command.Move(1), Command.Stop]
for c in program (
  switch c (
    case Move(steps)
      log "move " ++ steps
    case Turn(direction)
      log "turn " ++ direction
    case Stop
      log "stop"
  )
)
```

```output
move 3
turn left
move 1
stop
```

:::quiz
Why is this better than storing the state as a string like `"waiting"` or `"done"`?

- [ ] Enums use less memory.
- [x] The compiler rejects misspelled cases and finds every `match` that misses a case.
- [ ] Strings can't be compared.

A typo in a string is just a different string. A typo in an enum case doesn't compile.
:::

:::exercise title="Coin values"
Finish `cents` so it returns each coin's value: a penny is 1, a nickel 5, a dime 10 and a quarter 25. Then the program prints the total of the purse.

```osl
enum Coin (
  Penny
  Nickel
  Dime
  Quarter
)

def cents(Coin c) int -> 0

Coin[] purse = [Coin.Quarter, Coin.Dime, Coin.Penny, Coin.Quarter, Coin.Nickel]
log purse.map(c -> cents(c)).sum()
```

```output
66
```

> [!hint]
> Replace `0` with a `match c ( ... )` that has an arm for each of the four coins.

```osl solution
enum Coin (
  Penny
  Nickel
  Dime
  Quarter
)

def cents(Coin c) int -> match c (
  Coin.Penny -> 1
  Coin.Nickel -> 5
  Coin.Dime -> 10
  Coin.Quarter -> 25
)

Coin[] purse = [Coin.Quarter, Coin.Dime, Coin.Penny, Coin.Quarter, Coin.Nickel]
log purse.map(c -> cents(c)).sum()
```
:::
