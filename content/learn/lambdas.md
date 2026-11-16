---
description: Write small functions on the spot, pass them around, and let them remember the variables around them.
lesson: 10
---

# Lambdas

A lambda is a function without a name, written right where it's needed. You've already used them with arrays: `n -> n * 2` is a lambda.

## Writing a lambda

The short form is parameters, `->`, and an expression. With one parameter whose type the compiler can work out, that's all you need:

```osl
int[] numbers = [1, 2, 3, 4]
log numbers.map(n -> n * 10)
log numbers.filter(n -> n > 2)
```

```output
[10,20,30,40]
[3,4]
```

The compiler knows `numbers` holds `int`s, so it knows `n` is an `int`. When it can't tell, or when you want to be explicit, start the lambda with `def` and write the types out the same way as for a named function:

```osl
auto add = def(int a, int b) int -> a + b
log add(2, 3)
```

```output
5
```

## Lambdas with more to do

For more than one expression, give it a block:

```osl
auto describe = def(int n) string -> (
  if n < 0 return "negative"
  if n == 0 return "zero"
  return "positive"
)

log [-2, 0, 5].map(describe)
```

```output
["negative","zero","positive"]
```

## Sorting by something

`sortBy` takes a lambda that picks what to sort on:

```osl
object[] people = [
  {name: "Linus", age: 54},
  {name: "Ada", age: 36},
  {name: "Grace", age: 85}
]

log people.sortBy(p -> p.age).map(p -> p.name)
log people.sortBy(p -> p.name).map(p -> p.name)
```

```output
["Ada","Linus","Grace"]
["Ada","Grace","Linus"]
```

`sortBy` also takes a field name as a string: `people.sortBy("age")`.

## Remembering variables

A lambda can use the variables around the place it was written, and it keeps them even after that code has finished. This is called a closure:

```osl
def makeCounter() def() int (
  int count = 0
  return def() int -> (
    count++
    return count
  )
)

auto next = makeCounter()
log next()
log next()
log next()

auto other = makeCounter()
log other()
```

```output
1
2
3
1
```

Each call to `makeCounter` gets its own `count`, and the lambda it returns holds on to it.

## Functions that make functions

Because lambdas remember their surroundings, a function can build a custom function and hand it back:

```osl
def multiplier(int factor) def(int) int -> def(int n) int -> n * factor

auto triple = multiplier(3)
auto tenfold = multiplier(10)
log triple(7)
log tenfold(7)
log [1, 2, 3].map(triple)
```

```output
21
70
[3,6,9]
```

## Naming function types

A function type such as `def(int) int` can be named with `type`, which helps when it appears in several places:

```osl
type Rule = def(string) boolean

def check(string text, Rule[] rules) boolean -> rules.every(rule -> rule(text))

Rule notEmpty = def(string s) boolean -> s.len > 0
Rule short = def(string s) boolean -> s.len <= 8

log check("osl", [notEmpty, short])
log check("much too long", [notEmpty, short])
```

```output
true
false
```

## Async lambdas

A lambda can run on its own thread too. Write `async` where `def` would go. Calling it returns a thread handle, and `.wait()` gives the value:

```osl
auto double = async(int n) int -> n * 2
auto shout = async(string s) string (
  thread.sleep(10)
  return s.toUpper()
)

log double(4).wait()
log shout("hi").wait()
```

```output
8
HI
```

The [concurrency lesson](concurrency.md) shows them passed around and run several at a time.

## Pipes

`|>` passes the value on its left to the function on its right, so a chain of steps reads in the order it happens:

```osl
def double(int n) int -> n * 2
def addOne(int n) int -> n + 1

log 5 |> double |> addOne
log addOne(double(5))
```

```output
11
11
```

:::quiz
What does this print?

```osl fragment
auto make = def(int start) def() int (
  int n = start
  return def() int -> (
    n += 5
    return n
  )
)
auto f = make(10)
f()
log f()
```

- [ ] `15`
- [x] `20`
- [ ] `10`

The lambda keeps its own `n`. The first call makes it 15 and the second 20.
:::

:::exercise title="Longest word"
Use `sortBy` with a lambda to print the words from longest to shortest.

```osl
string[] words = ["fig", "banana", "kiwi", "apple"]

log words
```

```output
["banana","apple","kiwi","fig"]
```

> [!hint]
> `words.sortBy(w -> w.len)` sorts from shortest to longest.

> [!hint]
> `.reverse()` flips the result.

```osl solution
string[] words = ["fig", "banana", "kiwi", "apple"]

log words.sortBy(w -> w.len).reverse()
```
:::
