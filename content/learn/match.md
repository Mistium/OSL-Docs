---
description: Choose between many cases with match, which gives a value, and switch, which runs code.
lesson: 8
---

# match and switch

A chain of `else if` works, but when you're comparing one value against many possibilities, `match` and `switch` say it more clearly.

## match gives a value

`match` compares a value against each pattern in turn and gives back the result of the first one that fits. `_` matches anything, so it catches every case not listed:

```osl
def dayName(int day) string -> match day (
  1 -> "Monday"
  2 -> "Tuesday"
  3 -> "Wednesday"
  4 -> "Thursday"
  5 -> "Friday"
  _ -> "the weekend"
)

log dayName(3)
log dayName(7)
```

```output
Wednesday
the weekend
```

`match` is an expression, so it goes anywhere a value can: after `=`, in a `log`, as an argument, or as the whole body of a function, as here.

## Covering every case

The compiler checks that a `match` covers everything its value could be. For a number or string that means you need a `_` arm, because there are always more values than the ones you've listed:

```osl error
int code = 404
string label = match code (
  200 -> "ok"
  404 -> "not found"
)
```

For a `boolean`, `true` and `false` are enough, and for an [enum](enums.md) you list its variants. If you add a variant later, every `match` that forgot it stops compiling, which is exactly where you want to be told.

```osl
boolean online = false
log match online (
  true -> "connected"
  false -> "offline"
)
```

```output
offline
```

## Arms with more to do

When an arm needs more than one expression, give it a block and `return` the value from it:

```osl
int status = 503
string message = match status (
  200 -> "ok"
  _ -> (
    log "unexpected status " ++ status
    return "error"
  )
)
log message
```

```output
unexpected status 503
error
```

## switch runs code

`switch` is for when each case *does* something rather than producing a value. It runs the statements under the first `case` that matches, and `default` runs when none do. Cases written one after another share the code beneath them:

```osl
def react(string command) (
  switch command (
    case "start"
      log "starting"
    case "stop"
    case "quit"
      log "stopping"
    default
      log "unknown command: " ++ command
  )
)

react("start")
react("quit")
react("dance")
```

```output
starting
stopping
unknown command: dance
```

Only one case ever runs, so there's no falling through to the next one by accident. `break` leaves a case early.

Stacking cases is also how to give several values the same treatment, which a `match` arm can't do:

```osl
def kind(string letter) string (
  switch letter.toLower() (
    case "a"
    case "e"
    case "i"
    case "o"
    case "u"
      return "vowel"
    default
      return "consonant"
  )
)

log kind("E")
log kind("z")
```

```output
vowel
consonant
```

> [!tip] Which one?
> If every branch ends in a value, use `match`. If the branches do different things, use `switch`. Both get more powerful with [enums](enums.md) and [results](errors.md), where they also pull values out of what they match.

:::quiz
What does this print?

```osl fragment
log match 4 (
  1 -> "one"
  2 -> "two"
  _ -> "many"
)
```

- [ ] `one`
- [x] `many`
- [ ] It doesn't compile.

4 isn't 1 or 2, so `_` catches it.
:::

:::exercise title="Rock, paper, scissors"
Finish `beats` so it returns what each move beats: rock beats scissors, paper beats rock and scissors beats paper. Anything else beats `"nothing"`.

```osl
def beats(string move) string -> "nothing"

log beats("rock")
log beats("paper")
log beats("scissors")
log beats("lizard")
```

```output
scissors
rock
paper
nothing
```

> [!hint]
> Replace `"nothing"` with a `match move ( ... )`.

> [!hint]
> You need three arms for the moves and a `_` arm for everything else.

```osl solution
def beats(string move) string -> match move (
  "rock" -> "scissors"
  "paper" -> "rock"
  "scissors" -> "paper"
  _ -> "nothing"
)

log beats("rock")
log beats("paper")
log beats("scissors")
log beats("lizard")
```
:::
