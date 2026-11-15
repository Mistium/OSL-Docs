---
description: Name values with variables, give them types, change them, and keep the ones that shouldn't change fixed.
lesson: 2
---

# Variables

A variable is a name for a value. In OSL you write the type first, then the name, then the value:

```osl
string name = "Ada"
int age = 36
number height = 1.65
boolean curious = true

log name age height curious
```

```output
Ada 36 1.65 true
```

Those four are the types you'll use most:

| Type | Holds | Examples |
| --- | --- | --- |
| `string` | text | `"Ada"`, `'hi'`, `""` |
| `int` | whole numbers | `42`, `-7`, `1_000_000` |
| `number` | numbers with a fractional part | `1.65`, `0.5`, `3.0` |
| `boolean` (or `bool`) | `true` or `false` | `true` |

## Let the compiler work out the type

When the value makes the type obvious, write `auto` and the compiler fills it in:

```osl
auto city = "Lisbon"      // a string
auto population = 545000  // an int
log city ++ " has " ++ population ++ " people"
```

```output
Lisbon has 545000 people
```

`auto` still gives the variable one fixed type. It just saves you writing it. OSL code tends to spell types out where they help the reader, such as at the top of a file and on functions, and use `auto` for short-lived values in the middle.

`++` joins values into text, turning numbers into strings on the way. You'll see it everywhere.

## Changing a variable

Assign a new value with `=`. There are shortcuts for the common changes:

```osl
int score = 10
score = 15
score += 5     // score = score + 5
score -= 2
score *= 2
score++        // add one
log score

string greeting = "Hello"
greeting ++= ", world"   // greeting = greeting ++ ", world"
log greeting
```

```output
37
Hello, world
```

A variable keeps the type it was declared with. Putting a value of another type in it is an error the compiler catches before the program runs:

```osl error
int score = 10
score = "ten"
```

## Declare before you use

Every variable is declared once, with its type or `auto`. Assigning to a name that hasn't been declared is an error, so a typo can't quietly create a new variable:

```osl error
int count = 1
cuont = count + 1
```

The message names the mistake and shows the declaration you probably meant. If a value is computed but not needed, assign it to `_` to throw it away on purpose.

:::quiz
Which of these lines doesn't compile?

- [ ] `auto total = 0`
- [ ] `int total = 0` followed by `total += 4`
- [x] `int total = 0` followed by `total = 4.5`
- [ ] `number total = 4.5`

`total` is an `int`, so it can't hold `4.5`. Declare it as `number` if it needs a fractional part.
:::

## Values that never change

Use `const<T>` for a value that must stay as it is. The compiler rejects any later assignment:

```osl
const<int> maxPlayers = 4
const<string> title = "Space Race"
log title ++ " for up to " ++ maxPlayers
```

```output
Space Race for up to 4
```

```osl error
const<int> maxPlayers = 4
maxPlayers = 5
```

`const` also protects arrays and objects from being changed through that name, which you'll meet in the lessons on [arrays](arrays.md) and [types](types.md#const-values).

## Names

Names start with a letter or an underscore and continue with letters, digits and underscores. OSL code uses `camelCase` for variables and functions and `PascalCase` for types. Letters from any language are fine: `string año = "2026"` works.

A few words belong to the language and can't be names, such as `if`, `for`, `return`, `class` and `import`. The compiler tells you when you've picked one, and suggests another name.

:::exercise title="A shopping total"
Three apples cost 40 each and a loaf costs 150, so the total should be 270. This program prints 193. Fix the line that works out `total`.

```osl
int apples = 3
int applePrice = 40
int loaf = 150

int total = apples + applePrice + loaf
log total
```

```output
270
```

> [!hint]
> It adds the number of apples to the price of one. The apples cost `apples * applePrice`.

> [!hint]
> Mixing `+` and `*` in one expression needs brackets in OSL, so write `(apples * applePrice) + loaf`. The [operators lesson](operators.md) explains why.

```osl solution
int apples = 3
int applePrice = 40
int loaf = 150

int total = (apples * applePrice) + loaf
log total
```
:::
