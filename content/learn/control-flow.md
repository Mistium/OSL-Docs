---
description: Make decisions with if, repeat work with for, loop, while and until, and leave loops early.
lesson: 7
---

# Control flow

Programs make decisions and repeat things. OSL does both with a small set of statements, and every block, the code a statement controls, goes in round brackets.

## if, else if, else

```osl
int temperature = 23

if temperature > 30 (
  log "hot"
) else if temperature > 15 (
  log "warm"
) else (
  log "cold"
)
```

```output
warm
```

The `(` that opens a block goes at the end of the line that owns it. `else` can sit on the same line as the `)` before it, as here, or start the next line.

Conditions are combined with `and` and `or`, and flipped with `!`:

```osl
int age = 20
boolean member = false

if age >= 18 and !member (
  log "adult, not a member"
)
if age < 13 or member (
  log "discount"
)
```

```output
adult, not a member
```

> [!warning] = and ==
> `=` puts a value in a variable and `==` compares. Writing `if x = 5 (` is a compile error that points at the `=`, so the mix-up can't slip through.

## Choosing a value

When you want a value rather than to run statements, use `if` as an expression, with `then` and `else`:

```osl
int count = 3
string noun = if count == 1 then "item" else "items"
log `${count} ${noun}`

int score = 72
string grade = if score >= 90 then "A"
  else if score >= 70 then "B"
  else "C"
log grade
```

```output
3 items
B
```

## Guards

A condition followed by `return`, `break` or `continue` can sit on one line. These guards keep the main path of a function flat:

```osl
def describe(int n) string (
  if n < 0 return "negative"
  if n == 0 return "zero"
  return "positive"
)

log describe(-4)
log describe(0)
log describe(9)
```

```output
negative
zero
positive
```

Anything else in an `if` needs a block.

## Repeating a number of times

`loop` repeats a block. `for` does the same and also counts, from 1 up to the number:

```osl
loop 3 (
  log "hip hip"
)
log "hooray"

for i 4 (
  log i * i
)
```

```output
hip hip
hip hip
hip hip
hooray
1
4
9
16
```

## Looping over things

`for ... in` goes through the items of an array, the characters of a string or the entries of an object. Give it two names to get the position as well:

```osl
string[] tasks = ["write", "test", "ship"]

for task in tasks (
  log "- " ++ task
)

for n, task in tasks (
  log `${n}. ${task}`
)
```

```output
- write
- test
- ship
1. write
2. test
3. ship
```

To count between two numbers, loop over a range:

```osl
for year in 2020 to 2023 (
  log year
)
```

```output
2020
2021
2022
2023
```

## while and until

`while` repeats as long as its condition is true. `until` repeats until its condition becomes true:

```osl
int n = 27
int steps = 0
while n != 1 (
  n = if n % 2 == 0 then n / 2 else (n * 3) + 1
  steps++
)
log steps

int tries = 0
until tries == 3 (
  tries++
)
log tries
```

```output
111
3
```

## Leaving early

`break` leaves the loop it's in. `continue` skips to the next time round:

```osl
for n in 1 to 10 (
  if n % 2 == 0 continue
  if n > 7 break
  log n
)
```

```output
1
3
5
7
```

## Blocks and names

A variable declared inside a block belongs to that block, and disappears when it ends:

```osl error
boolean ready = true
if ready (
  string message = "inside"
)
log message
```

Declare it before the block when you need it afterwards:

```osl
boolean ready = true
string message = "before"
if ready (
  message = "changed inside"
)
log message
```

```output
changed inside
```

:::quiz
How many times does `for i 5 ( ... )` run its block, and what is `i` the first time?

- [ ] 5 times, starting at 0
- [x] 5 times, starting at 1
- [ ] 6 times, starting at 0

Counting starts at one, so `i` goes 1, 2, 3, 4, 5.
:::

:::quiz
Which of these is a complete, valid statement?

- [x] `if done return`
- [ ] `if done log "finished"`
- [ ] `if done: return`

Only `return`, `break` and `continue` can follow a condition on the same line. Anything else needs a block: `if done ( log "finished" )`.
:::

:::exercise title="FizzBuzz"
Print the numbers 1 to 15, but print `Fizz` for multiples of 3, `Buzz` for multiples of 5 and `FizzBuzz` for multiples of both.

```osl
for n in 1 to 15 (
  log n
)
```

```output
1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz
```

> [!hint]
> `n % 3 == 0` is true for multiples of 3.

> [!hint]
> Check for multiples of 15 first, otherwise the multiples of 3 or 5 catch them before you get there.

```osl solution
for n in 1 to 15 (
  if n % 15 == 0 (
    log "FizzBuzz"
  ) else if n % 3 == 0 (
    log "Fizz"
  ) else if n % 5 == 0 (
    log "Buzz"
  ) else (
    log n
  )
)
```
:::
