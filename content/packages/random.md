---
description: Seedable random numbers, picks, shuffles and strings for games, sampling and test data, and when to use crypto instead.
package: random
---

# random

`std:random` makes pseudo-random values: dice rolls, picks from a list, shuffles, random text. It is fast and, importantly, repeatable: seed it and the same sequence comes out every time, which makes games, simulations and tests reproducible.

It is not safe for secrets. Passwords, tokens and keys need `std:crypto`, because a seeded generator can be predicted.

Examples on this page that print raw random values are marked as varying, since their output changes on every run. The ones that call `random.seed` first always print the same thing.

## Numbers

`random.number()` is from 0 up to but not including 1. Give it one bound for 0 up to that, or two for a range. `random.int(min, max)` is a whole number and includes both ends, so `random.int(1, 6)` is a die.

```osl varies
import "std:random"

log random.number()
log random.number(10)
log random.number(5, 10)
log random.int(1, 6)
```

You can rely on the ranges even when you can't predict the value. Here we roll a thousand dice and check every roll was a legal one:

```osl
import "std:random"

auto ok = true
for _ in 1 to 1000 (
  auto roll = random.int(1, 6)
  if roll < 1 or roll > 6 ( ok = false )
)
log ok
```

```output
true
```

## Seeding

`random.seed(n)` restarts the generator. Seed it with the same number and every call after that repeats:

```osl
import "std:random"

random.seed(42)
auto first = [random.int(1, 100), random.int(1, 100), random.int(1, 100)]

random.seed(42)
auto second = [random.int(1, 100), random.int(1, 100), random.int(1, 100)]

log first == second
```

```output
true
```

Without a call to `random.seed`, each run starts differently. Seed with a fixed number in tests, and with something like the time (`date.now().unix()`) when you want a repeatable value you can also record and replay later.

## Choosing and sampling

`random.item(items)` picks one item, typed as the array's items are. `random.sample(items, count)` picks several different ones, in random order. Neither changes the array.

```osl
import "std:random"

random.seed(7)
string[] names = ["Ada", "Bo", "Cy", "Di", "Ed"]

string winner = random.item(names)
string[] team = random.sample(names, 3)

log names.contains(winner)
log team.len
log team.deDupe().len
log names.len
```

```output
true
3
3
5
```

`team.deDupe().len` being 3 shows the picks are all different. Asking for more items than the array has returns them all, shuffled.

## Shuffling

`random.shuffle(items)` returns a shuffled copy and leaves the original alone:

```osl
import "std:random"

random.seed(1)
auto deck = [1, 2, 3, 4, 5, 6, 7, 8]
auto shuffled = random.shuffle(deck)

log deck
log shuffled.len
log shuffled.toSorted() == deck
```

```output
[1,2,3,4,5,6,7,8]
8
true
```

Sorting the shuffled copy gives the deck back, so nothing was lost or duplicated. That is a good property to test: you can't assert the order, but you can assert what must stay the same.

## Chance

`random.bool()` is a coin flip. Give it a probability from 0 to 1 to weight it. 0 never gives true and 1 always does:

```osl
import "std:random"

log random.bool(1)
log random.bool(0)

random.seed(3)
int hits = 0
for _ in 1 to 1000 (
  if random.bool(0.25) ( hits++ )
)
log hits > 150 and hits < 350
```

```output
true
false
true
```

## Bell curves

`random.gaussian()` has mean 0 and standard deviation 1. Pass a mean and a standard deviation for another curve. Most values fall near the mean, which suits heights, noise and anything natural:

```osl
import "std:random"
import "std:math"

random.seed(5)
number[] heights = []
for _ in 1 to 2000 (
  heights.append(random.gaussian(170, 10))
)
auto mean = math.avg(heights).unwrap()
log mean > 168 and mean < 172
```

```output
true
```

## Random text

`random.string()` gives 16 letters and digits. Pass a length, and optionally an alphabet to draw from:

```osl
import "std:random"

random.seed(9)
log random.string().len
log random.string(8).len

string bits = random.string(10, "01")
log bits.len
log bits.replace("0", "").replace("1", "").len
```

```output
16
8
10
0
```

The last line removes every `0` and `1` and finds nothing left, so only the alphabet was used. Use this for test data, throwaway ids and filler. For tokens that protect something, use `std:crypto`.

## Pattern: a seeded game

Seeding makes a whole game reproducible: the same seed is the same dungeon. Share the seed and players share the map.

```osl
import "std:random"

def rollDice(int count) int[] (
  int[] rolls = []
  for _ in 1 to count (
    rolls.append(random.int(1, 6))
  )
  return rolls
)

random.seed(2024)
auto a = rollDice(5)
random.seed(2024)
auto b = rollDice(5)

log a == b
log a.len
```

```output
true
5
```

:::quiz
A test needs the same "random" shuffle on every run. What do you do?

- [ ] Call `random.shuffle` twice and keep the second result.
- [x] Call `random.seed` with a fixed number first.
- [ ] Use `std:crypto`, which is repeatable.

A seeded generator repeats its sequence. `std:crypto` is the opposite: it is unpredictable on purpose.
:::

:::exercise title="A fair die"
Finish `roll` so it returns a random whole number from 1 to `sides`, both ends included. The loop rolls a thousand times and checks every roll was legal.

```osl
import "std:random"

def roll(int sides) int -> 0

boolean legal = true
for _ in 1 to 1000 (
  int r = roll(6)
  if r < 1 or r > 6 ( legal = false )
)
log legal
```

```output
true
```

> [!hint]
> `random.int(min, max)` includes both ends.

```osl solution
import "std:random"

def roll(int sides) int -> random.int(1, sides)

boolean legal = true
for _ in 1 to 1000 (
  int r = roll(6)
  if r < 1 or r > 6 ( legal = false )
)
log legal
```
:::

## API reference

::api
